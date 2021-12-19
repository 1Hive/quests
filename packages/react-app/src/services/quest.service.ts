import { Contract } from 'ethers';
import { request } from 'graphql-request';
import { Filter } from 'src/models/filter';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import { getNetwork } from 'src/networks';
import { QuestEntityQuery } from 'src/queries/quest-entity.query';
import { toAscii } from 'web3-utils';
import { DEFAULT_AMOUNT, DEFAULT_TOKEN, GQL_MAX_INT, TOKENS } from '../constants';
import ERC20Abi from '../contracts/ERC20.json';
import { wrapError } from '../utils/errors.util';
import { Logger } from '../utils/logger';
import { parseAmount, toHex } from '../utils/web3.utils';
import { getIpfsBaseUri, pushObjectToIpfs } from './ipfs.service';

let questList: QuestData[] = [];

// #region Private

async function mapQuests(quests: any[]): Promise<QuestData[]> {
  const x = await Promise.all(
    quests.map(async (questEntity) => {
      try {
        const quest = {
          address: questEntity.questAddress,
          title: questEntity.questTitle,
          description: questEntity.questDescription ?? undefined,
          detailsRefIpfs: toAscii(questEntity.questDetailsRef),
          rewardTokenAddress: questEntity.questRewardTokenAddress,
          claimDeposit: DEFAULT_AMOUNT,
          bounty: DEFAULT_AMOUNT,
          expireTimeMs: questEntity.questExpireTimeSec * 1000, // sec to Ms
        } as QuestData;
        if (!quest.description) quest.description = getIpfsBaseUri() + quest.detailsRefIpfs;

        return quest;
      } catch (error) {
        Logger.error('Failed to map quest : ', questEntity);
        return undefined;
      }
    }),
  );
  return x.filter((quest) => !!quest) as QuestData[]; // Filter out undefined quests (skiped)
}
// #endregion

// #region Public

export async function getMoreQuests(
  currentIndex: number,
  count: number,
  filter: Filter,
): Promise<QuestData[]> {
  const network = getNetwork();
  const queryResult = (
    await request(network.subgraph, QuestEntityQuery, {
      skip: currentIndex,
      first: count,
      expireTimeLower: filter.expire?.start
        ? Math.round(filter.expire.start.getTime() / 1000) // MS to Sec
        : 0,
      expireTimeUpper: filter.expire?.end
        ? Math.round(filter.expire.end.getTime() / 1000) // MS to Sec
        : GQL_MAX_INT, // January 18, 2038 10:14:07 PM  // TODO : Change to a later time when supported by grapql-request
      address: filter.address,
      title: filter.title,
      description: filter.description,
    })
  ).questEntities;

  const newQuests = await mapQuests(queryResult);
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
    const ipfsHash = await pushObjectToIpfs(data.description ?? '');

    const questExpireTimeUtcSec = Math.round(data.expireTimeMs! / 1000); // Ms to UTC timestamp
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

export async function fundQuest(questAddress: string, amount: TokenAmount, contractERC20: any) {
  await contractERC20.transfer(questAddress, parseAmount(amount));
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
    token: DEFAULT_TOKEN,
  } as TokenAmount;
}

// TODO
export function fetchClaimingPlayers(quest: QuestData) {
  Logger.debug(quest);
  return [];
}

// #endregion
