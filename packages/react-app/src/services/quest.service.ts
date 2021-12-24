import { request } from 'graphql-request';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { QuestEntityQuery, QuestEntitiesQuery } from 'src/queries/quest-entity.query';
import { toAscii, toChecksumAddress } from 'web3-utils';
import {
  GovernQueueEntityContainersQuery,
  GovernQueueEntityQuery,
  fakeContainerResult,
} from 'src/queries/govern-queue-entity.query';
import { ethers } from 'ethers';
import { ConfigModel, ContainerModel } from 'src/models/govern.model';
import { ClaimModel } from 'src/models/claim.model';
import {
  DEAULT_CLAIM_EXECUTION_DELAY,
  CLAIM_STATUS,
  DEFAULT_AMOUNT,
  GQL_MAX_INT,
  TOKENS,
} from '../constants';
import { Logger } from '../utils/logger';
import { toBigNumber, toHex } from '../utils/web3.utils';
import { isDelayOver } from '../utils/date.utils';
import { getIpfsBaseUri, getObjectFromIpfs, pushObjectToIpfs } from './ipfs.service';
import { getQuestContractInterface } from '../hooks/use-contract.hook';

let questList: QuestModel[] = [];

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
    } as QuestModel;
    if (!quest.description) quest.description = getIpfsBaseUri() + quest.detailsRefIpfs;
    return quest;
  } catch (error) {
    Logger.error('Failed to map quest : ', questEntity);
    return undefined;
  }
}

function mapQuestList(quests: any[]): QuestModel[] {
  return quests.map(mapQuest).filter((quest) => !!quest) as QuestModel[]; // Filter out undefined quests (skiped)
}

async function fetchGovernQueue(): Promise<{ nonce: number; config: ConfigModel }> {
  const { governSubgraph, governQueue } = getNetwork();

  const result = await request(governSubgraph, GovernQueueEntityQuery, {
    ID: governQueue.toLowerCase(),
  });
  if (!result?.governQueue)
    throw new Error(`GovernQueue does not exist at this address : ${governQueue}`);
  return (
    result.governQueue && {
      config: result.governQueue.config,
      nonce: +result.governQueue.nonce,
    }
  );
}

async function fetchGovernQueueContainers(): Promise<ContainerModel[]> {
  const { governSubgraph, governQueue } = getNetwork();
  // const result = await request(governSubgraph, GovernQueueEntityContainersQuery, {
  //   ID: governQueue.toLowerCase(),
  // });
  // if (!result?.governQueue)
  //   throw new Error(`GovernQueue does not exist at this address : ${governQueue}`);

  // TODO : UNFAKE
  const containers = fakeContainerResult.map(
    (x: any) =>
      ({
        id: x.id,
        payload: {
          id: x.payload.id,
          actions: x.payload.actions,
          executionTime: +x.payload.executionTime,
          proof: x.payload.proof,
          submitter: x.payload.submitter,
        },
        state: x.state,
        config: undefined,
      } as ContainerModel),
  );
  return containers;
}

async function getContainer(claimData: ClaimModel, execTime?: number): Promise<ContainerModel> {
  const { govern, celeste } = getNetwork();

  const governQueueResult = await fetchGovernQueue();

  const ERC3000Config = {
    ...governQueueResult.config, // default config fetched from govern subgraph
    resolver: celeste, // Celeste
    executionDelay: DEAULT_CLAIM_EXECUTION_DELAY, // delay after which the claim can be executed by player
  } as ConfigModel;

  const currentBlock = await ethers.getDefaultProvider().getBlock('latest');

  // A bit more than the execution delay
  const executionTime = execTime ?? currentBlock.timestamp + DEAULT_CLAIM_EXECUTION_DELAY + 60;

  // Claim user data
  const evidenceIpfsHash = toHex(await pushObjectToIpfs(claimData.evidence));
  const claimCall = getQuestContractInterface().encodeFunctionData('claim', [
    evidenceIpfsHash,
    claimData.playerAddress,
    claimData.claimAmount.amount,
  ]);

  return {
    config: ERC3000Config,
    payload: {
      nonce: governQueueResult.nonce + 1, // Increment nonce for each schedule
      executionTime,
      submitter: claimData.playerAddress,
      executor: govern,
      actions: [
        {
          to: claimData.questAddress,
          value: 0,
          data: claimCall,
        },
      ],
      allowFailuresMap: `0x${'0'.repeat(60)}`,
      proof: evidenceIpfsHash,
    },
  } as ContainerModel;
}

// #endregion

// #region Public

export async function getMoreQuests(
  currentIndex: number,
  count: number,
  filter: FilterModel,
): Promise<QuestModel[]> {
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
  data: Partial<QuestModel>,
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

export function fundQuest(contractERC20: any, questAddress: string, amount: TokenAmountModel) {
  return contractERC20.transfer(questAddress, toBigNumber(amount));
}

export async function scheduleQuestClaim(
  governQueueContract: any,
  claimData: ClaimModel,
  execTime?: number,
) {
  const container = await getContainer(claimData, execTime);
  console.log({ container, claimData }, 'Scheduling claim ...');

  Logger.debug(`Scheduling container...`);
  // const tx = await governQueueContract.schedule(container);
  // const { logs } = (await tx.wait()) as ethers.ContractReceipt;
  // Logger.info(logs);
  Logger.debug(`Container scheduled, execution time ${container.payload.executionTime}`);
}

export async function executeQuestClaim(
  governQueueContract: any,
  claimData: ClaimModel,
  execTime?: number,
) {
  const container = await getContainer(claimData, execTime);

  console.log({ container, claimData }, 'Executing claim ...');
  Logger.debug(`Executing container...`);
  // const tx = await governQueueContract.execute(container);
  // const { logs } = (await tx.wait()) as ethers.ContractReceipt;
  // Logger.info(logs);
  Logger.info(`Container executed`);
}

export async function challengeQuestClaim(claim: ClaimModel) {
  return Promise.resolve();
}

export async function isQuestClaimScheduleEnded(questAddress: string, playerAddress: string) {
  const governQueueContainers = await fetchGovernQueueContainers();
  return (
    governQueueContainers?.find(
      (x: ContainerModel) =>
        x.payload.submitter === playerAddress && isDelayOver(+x.payload.executionTime),
    ) ?? false
  );
}

export async function fetchQuestClaims(quest: QuestModel): Promise<ClaimModel[]> {
  const res = await fetchGovernQueueContainers();
  return Promise.all(
    res
      .filter(
        (x) =>
          x.payload.actions[0].to === quest.address &&
          (x.state === CLAIM_STATUS.Scheduled || x.state === CLAIM_STATUS.Challenged),
      )
      .map(async (x) => {
        const claimAction = x.payload.actions[0];
        const [evidenceIpfsHash, playerAddress, claimAmount] =
          getQuestContractInterface().decodeFunctionData('claim', claimAction.data);
        const evidence = await getObjectFromIpfs(toAscii(evidenceIpfsHash));
        return {
          claimAmount: { token: quest.rewardToken, amount: +claimAmount },
          evidence,
          playerAddress,
          questAddress: quest.address,
          state: x.state,
        } as ClaimModel;
      }),
  );
}

export function getTagSuggestions() {
  return []; // TODO : Restore after MVP questList.map((x) => x.tags).flat();
}

// TODO : To verify
export async function fetchAvailableBounty(quest: QuestModel, erc20Contract: any) {
  if (!quest?.rewardToken) return DEFAULT_AMOUNT;
  const balance = await erc20Contract.balanceOf(quest.address);
  return {
    amount: balance.toString(),
    token: quest.rewardToken,
  } as TokenAmountModel;
}

// TODO
export function fetchClaimingPlayers(quest: QuestModel) {
  Logger.debug(quest);
  return [];
}

// #endregion
