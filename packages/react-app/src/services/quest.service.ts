import { Contract } from 'ethers';
import { request } from 'graphql-request';
import { noop } from 'lodash-es';
import { Filter } from 'src/models/filter';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import { getNetwork } from 'src/networks';
import { QuestEntityQuery } from 'src/queries/quest-entity.query';
import { QuestSearchQuery } from 'src/queries/quest-search.query';
import { DEFAULT_AMOUNT, GQL_MAX_INT, TOKENS } from '../constants';
import ERC20Abi from '../contracts/ERC20.json';
import { wrapError } from '../utils/errors.util';
import { Logger } from '../utils/logger';
import { getCurrentAccount, sendTransaction, toHex } from '../utils/web3.utils';
import { getObjectFromIpfs, pushObjectToIpfs } from './ipfs.service';

let questList: QuestData[] = [];

// #region Private

function mapQuests(quests: any[]): QuestData[] {
  return quests
    .map((questEntity) => {
      try {
        return {
          address: questEntity.questAddress,
          title: questEntity.questTitle,
          description: questEntity.questDescription,
          detailsRefIpfs: questEntity.questDetailsRef.toString(),
          rewardTokenAddress: questEntity.questRewardTokenAddress,
          claimDeposit: { amount: 0, token: TOKENS.honey },
          bounty: { amount: 0, token: TOKENS.honey },
          expireTimeMs: questEntity.questExpireTimeSec * 1000, // sec to Ms
        } as QuestData;
      } catch (error) {
        Logger.error('Failed to map quest : ', questEntity);
        return undefined;
      }
    })
    .filter((x) => !!x) as QuestData[];
}

// #endregion

// #region Public

export async function getMoreQuests(
  currentIndex: number,
  count: number,
  filter: Filter,
): Promise<QuestData[]> {
  const network = getNetwork();
  let queryResult;
  if (filter.search) {
    queryResult = (
      await request(network.subgraph, QuestSearchQuery, {
        skip: currentIndex,
        first: count,
        text: filter.search,
      })
    ).questSearch;
  } else {
    queryResult = (
      await request(network.subgraph, QuestEntityQuery, {
        skip: currentIndex,
        first: count,
        expireTimeLower: filter.expire?.start
          ? Math.round(filter.expire.start.getTime() / 1000) // MS to Sec
          : 0,
        expireTimeUpper: filter.expire?.end
          ? Math.round(filter.expire.end.getTime() / 1000) // MS to Sec
          : GQL_MAX_INT, // January 18, 2038 10:14:07 PM  // TODO : Change to a later time when supported by grapql-request
      })
    ).questEntities;
  }

  const newQuests = mapQuests(queryResult);
  questList = questList.concat(newQuests);
  return newQuests;
}

export async function saveQuest(
  questFactoryContract: any,
  fallbackAddress: string,
  data: Partial<QuestData>,
  address?: string,
) {
  if (address) throw Error('Saving existing quest is not yet implemented');
  if (questFactoryContract) {
    const ipfsObj = { description: data.description ?? '' };
    const ipfsHash = await pushObjectToIpfs(ipfsObj);
    const questExpireTimeUtcSec = Math.round(data.expireTimeMs! / 1000); // Ms to UTC timestamp
    Logger.debug(`Pinging ${ipfsHash}...`);
    const pingResult = await getObjectFromIpfs(ipfsHash); // ping IPFS before pushing it so subgraph will not timeout
    if (pingResult) Logger.debug('Ping successfull : ', pingResult);
    else Logger.error('Error when pinging : ', ipfsHash);
    const tx = await questFactoryContract.createQuest(
      data.title,
      toHex(ipfsHash), // Push description to IPFS and push hash to quest contract
      TOKENS.honey.address,
      questExpireTimeUtcSec,
      fallbackAddress,
    );
    Logger.info('TX HASH', tx.hash);
    const receipt = await tx.wait();
    const questDeployedAddress = receipt?.events[0]?.args[0];
    return questDeployedAddress;
  }

  return null;
}

export async function fundQuest(
  questAddress: string,
  amount: TokenAmount,
  onCompleted: Function = noop,
) {
  const currentAccount = await getCurrentAccount();
  if (!currentAccount)
    throw wrapError('User account not connected when trying to found a quest!', {
      questAddress,
      amount,
    });
  await sendTransaction(questAddress, amount, onCompleted);
}

export async function claimQuest(questAddress: string, address: string) {
  if (!address)
    throw wrapError('Address is not defined', {
      questAddress,
    });
}

export function getTagSuggestions() {
  return []; // TODO : Restore after MVP questList.map((x) => x.tags).flat();
}

// TODO : To verify
export async function fetchAvailableBounty(quest: QuestData, account: any) {
  if (!quest?.rewardTokenAddress) return DEFAULT_AMOUNT;
  const contract = new Contract(quest.rewardTokenAddress, ERC20Abi, account);
  const balance = await contract.balanceOf(quest.address);
  return {
    amount: balance.toString(),
    token: TOKENS.honey,
  } as TokenAmount;
}

// TODO
export function fetchClaimingPlayers(quest: QuestData) {
  Logger.debug(quest);
  return [];
}

// #endregion
