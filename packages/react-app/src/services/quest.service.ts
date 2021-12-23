import { request } from 'graphql-request';
import { Filter } from 'src/models/filter';
import { QuestData } from 'src/models/quest-data';
import { TokenAmount } from 'src/models/token-amount';
import { getNetwork } from 'src/networks';
import { QuestEntitiesQuery } from 'src/queries/quest-entities.query';
import { QuestEntityQuery } from 'src/queries/quest-entity.query';
import { toAscii, toChecksumAddress } from 'web3-utils';
import { DEFAULT_AMOUNT, GQL_MAX_INT, TOKENS } from '../constants';
import { wrapError } from '../utils/errors.util';
import { Logger } from '../utils/logger';
import { toBigNumber, toHex } from '../utils/web3.utils';
import { getIpfsBaseUri, pushObjectToIpfs } from './ipfs.service';

let questList: QuestData[] = [];

// #region Private
function mapQuest(questEntity: any) {
  const { defaultToken } = getNetwork();
  try {
    const quest = {
      address: toChecksumAddress(questEntity.questAddress),
      title: questEntity.questTitle,
      description: questEntity.questDescription || undefined, // if '' -> undefined
      detailsRefIpfs: toAscii(questEntity.questDetailsRef),
      rewardToken: {
        ...defaultToken,
        address: questEntity.questRewardTokenAddress,
      },
      expireTimeMs: questEntity.questExpireTimeSec * 1000, // sec to Ms
    } as QuestData;
    if (!quest.description) quest.description = getIpfsBaseUri() + quest.detailsRefIpfs;
    return quest;
  } catch (error) {
    Logger.error('Failed to map quest : ', questEntity);
    return undefined;
  }
}

function mapQuestList(quests: any[]): QuestData[] {
  return quests.map(mapQuest).filter((quest) => !!quest) as QuestData[]; // Filter out undefined quests (skiped)
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
    await request(network.subgraph, QuestEntitiesQuery, {
      skip: currentIndex,
      first: count,
      expireTimeLower: filter.expire?.start
        ? Math.round(filter.expire.start.getTime() / 1000) // MS to Sec
        : 0,
      expireTimeUpper: filter.expire?.end
        ? Math.round(filter.expire.end.getTime() / 1000) // MS to Sec
        : GQL_MAX_INT, // January 18, 2038 10:14:07 PM  // TODO : Change to a later time when supported by grapql-request
      address: filter.address.toLowerCase(), // Quest address was not stored with mixed-case
      title: filter.title,
      description: filter.description,
    })
  ).questEntities;

  const newQuests = mapQuestList(queryResult);
  questList = questList.concat(newQuests);
  return newQuests;
}
export async function getQuest(address: string) {
  const network = getNetwork();
  const queryResult = (
    await request(network.subgraph, QuestEntityQuery, {
      ID: address.toLowerCase(), // Subgraph address are stored lowercase
    })
  ).questEntity;
  const newQuest = mapQuest(queryResult);
  return newQuest;
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
      TOKENS.Honey.address,
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

export function fundQuest(contractERC20: any, questAddress: string, amount: TokenAmount) {
  return contractERC20.transfer(questAddress, toBigNumber(amount));
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
export async function fetchAvailableBounty(quest: QuestData, erc20Contract: any) {
  if (!quest?.rewardToken) return DEFAULT_AMOUNT;
  const balance = await erc20Contract.balanceOf(quest.address);
  return {
    amount: balance.toString(),
    token: quest.rewardToken,
  } as TokenAmount;
}

// TODO
export function fetchClaimingPlayers(quest: QuestData) {
  Logger.debug(quest);
  return [];
}

// #endregion
