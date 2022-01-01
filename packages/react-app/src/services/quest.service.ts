/* eslint-disable no-unused-vars */
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
} from 'src/queries/govern-queue-entity.query';
import { BigNumber, Contract, ContractTransaction, ethers } from 'ethers';
import { ConfigModel, ContainerModel, PayloadModel } from 'src/models/govern.model';
import { ClaimModel } from 'src/models/claim.model';
import { ChallengeModel } from 'src/models/challenge.model';
import { TokenModel } from 'src/models/token.model';
import { toTokenAmountModel } from 'src/utils/data.utils';
import { ContractError } from 'src/models/contract-error';
import { DEAULT_CLAIM_EXECUTION_DELAY_MS, CLAIM_STATUS, GQL_MAX_INT, TOKENS } from '../constants';
import { Logger } from '../utils/logger';
import { fromBigNumber, toBigNumber } from '../utils/web3.utils';
import { getIpfsBaseUri, getObjectFromIpfs, pushObjectToIpfs } from './ipfs.service';
import { getQuestContractInterface } from '../hooks/use-contract.hook';
import { processQuestState } from './state-machine';

let questList: QuestModel[] = [];

// #region Private
function mapQuest(questEntity: any) {
  const { defaultToken } = getNetwork();
  try {
    let quest = {
      address: toChecksumAddress(questEntity.questAddress),
      title: questEntity.questTitle,
      description: questEntity.questDescription || undefined, // if '' -> undefined
      detailsRefIpfs: toAscii(questEntity.questDetailsRef),
      rewardToken: {
        ...defaultToken,
        token: questEntity.questRewardTokenAddress,
      },
      expireTimeMs: questEntity.questExpireTimeSec * 1000, // sec to Ms
    } as QuestModel;
    quest = processQuestState(quest);
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
  const { governSubgraph, governQueue, defaultToken, nativeToken } = getNetwork();

  const result = await request(governSubgraph, GovernQueueEntityQuery, {
    ID: governQueue.toLowerCase(),
  });
  if (!result?.governQueue)
    throw new Error(`GovernQueue does not exist at this address : ${governQueue}`);
  const { config } = result.governQueue;
  return (
    result.governQueue && {
      config: {
        ...config,
        maxCalldataSize: +config.maxCalldataSize,
      },
      nonce: +result.governQueue.nonce,
    }
  );
}

async function fetchGovernQueueContainers(): Promise<ContainerModel[]> {
  const { governSubgraph, governQueue } = getNetwork();
  const result = await request(governSubgraph, GovernQueueEntityContainersQuery, {
    ID: governQueue.toLowerCase(),
  });
  if (!result?.governQueue)
    throw new Error(`GovernQueue does not exist at this address : ${governQueue}`);

  const containers = result.governQueue.containers.map(
    //  const containers = fakeContainerResult.map(
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
        config: {
          challengeDeposit: x.config.challengeDeposit,
          scheduleDeposit: x.config.scheduleDeposit,
        },
      } as ContainerModel),
  );

  return containers;
}

function decodeClaimAction(payload: PayloadModel) {
  const [evidenceIpfsHash, playerAddress, claimAmount] =
    getQuestContractInterface().decodeFunctionData('claim', payload.actions[0].data);
  return { evidenceIpfsHash, playerAddress, claimAmount };
}

function encodeClaimAction(claimData: ClaimModel, evidenceIpfsHash: string) {
  return getQuestContractInterface().encodeFunctionData('claim', [
    evidenceIpfsHash,
    claimData.playerAddress,
    claimData.claimedAmount.parsedAmount,
  ]);
}

async function handleTransaction(tx: any): Promise<ethers.ContractReceipt> {
  Logger.info('Tx hash', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  if (receipt.status) Logger.debug('Tx receipt', receipt);
  else {
    Logger.error('Transaction failed', { txReceipt: receipt });
  }
  return receipt;
}

// exposeGlobally(encodeClaimAction); // TODO : Remove when see

// #endregion

// #region Subgraph Query

export async function fetchQuestsPaging(
  currentIndex: number,
  count: number,
  filter: FilterModel,
): Promise<QuestModel[]> {
  const { questSubgraph } = getNetwork();
  const now = Math.round(Date.now() / 1000);
  let expireTimeLower;
  let expireTimeUpper;
  if (filter.expire?.start) expireTimeLower = Math.round(filter.expire.start.getTime() / 1000);
  else expireTimeLower = filter.showExpired ? 0 : now;
  if (filter.expire?.end) expireTimeUpper = Math.round(filter.expire.end.getTime() / 1000);
  // TODO : Change to a later time when supported by grapql-request
  else expireTimeUpper = filter.showExpired ? now : GQL_MAX_INT; // January 18, 2038 10:14:07 PM
  const queryResult = (
    await request(questSubgraph, QuestEntitiesQuery, {
      skip: currentIndex,
      first: count,
      expireTimeLower,
      expireTimeUpper,
      address: filter.address.toLowerCase(), // Quest address was not indexed with mixed-case
      title: filter.title,
      description: filter.description,
    })
  ).questEntities;

  const newQuests = mapQuestList(queryResult);
  questList = questList.concat(newQuests);
  return newQuests;
}

export async function fetchQuest(questAddress: string) {
  const { questSubgraph } = getNetwork();
  const queryResult = (
    await request(questSubgraph, QuestEntityQuery, {
      ID: questAddress.toLowerCase(), // Subgraph address are stored lowercase
    })
  ).questEntity;
  const newQuest = mapQuest(queryResult);
  return newQuest;
}

export async function computeContainer(claimData: ClaimModel): Promise<ContainerModel> {
  const { govern, celeste } = getNetwork();

  const governQueueResult = await fetchGovernQueue();

  // const ERC3000Config = {
  //   ...governQueueResult.config, // default config fetched from govern subgraph
  //   resolver: celeste, // Celeste
  //   executionDelay: Math.round(DEAULT_CLAIM_EXECUTION_DELAY_MS / 1000), // delay after which the claim can be executed by player
  // } as ConfigModel;

  const erc3000Config = governQueueResult.config;

  const currentBlock = await ethers.getDefaultProvider().getBlock('latest');

  // A bit more than the execution delay
  const executionTime =
    claimData.executionTime ?? currentBlock.timestamp + erc3000Config.executionDelay + 60;

  const evidenceIpfsHash = await pushObjectToIpfs(claimData.evidence);
  const claimCall = encodeClaimAction(claimData, evidenceIpfsHash);

  return {
    config: erc3000Config,
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
      allowFailuresMap: '0x0000000000000000000000000000000000000000000000000000000000000000',
      proof: evidenceIpfsHash,
    },
  } as ContainerModel;
}

export async function fetchQuestClaims(quest: QuestModel): Promise<ClaimModel[]> {
  const { defaultToken, nativeToken } = getNetwork();
  const res = await fetchGovernQueueContainers();

  return Promise.all(
    res
      .filter(
        (x) =>
          x.payload.actions[0].to === quest.address &&
          (x.state === CLAIM_STATUS.Scheduled || x.state === CLAIM_STATUS.Challenged) &&
          +x.payload.executionTime * 1000 > Date.now(),
      )
      .map(async (x) => {
        const { evidenceIpfsHash, claimAmount, playerAddress } = decodeClaimAction(x.payload);
        const evidence = await getObjectFromIpfs(evidenceIpfsHash);

        return {
          claimedAmount: { token: quest.rewardToken, parsedAmount: +claimAmount },
          evidence,
          playerAddress,
          questAddress: quest.address,
          state: x.state,
          challengeDeposit: {
            parsedAmount: fromBigNumber(
              BigNumber.from(x.config.challengeDeposit.amount),
              x.config.challengeDeposit.decimals,
            ),
            token: nativeToken,
          },
          executionTime: +x.payload.executionTime * 1000, // Sec to MS
        } as ClaimModel;
      }),
  );
}

export async function fetchClaimDeposit() {
  const { config } = await fetchGovernQueue();
  return toTokenAmountModel(config.scheduleDeposit);
}

export async function getClaimExecutableTime(questAddress: string, playerAddress: string) {
  const governQueueContainers = await fetchGovernQueueContainers();
  const container: ContainerModel | undefined = governQueueContainers?.find(
    (x: ContainerModel) =>
      x.payload.submitter === playerAddress && x.payload.actions[0].to === questAddress,
  );

  return container && +container.payload.executionTime * 1000; // Convert Sec to MS
}

// #endregion

// #region Contracts transactions

export async function saveQuest(
  questFactoryContract: Contract | ContractError,
  fallbackAddress: string,
  data: Partial<QuestModel>,
  address?: string,
  onTx?: (hash: string) => void,
) {
  if (questFactoryContract instanceof ContractError) throw questFactoryContract; // Throw error
  if (address) throw Error('Saving existing quest is not yet implemented');
  if (!questFactoryContract?.address)
    throw Error('ContractError : <questFactoryContract> has not been set properly');
  Logger.debug('Saving quest...', { fallbackAddress, data, address });
  const ipfsHash = await pushObjectToIpfs(data.description ?? '');
  const questExpireTimeUtcSec = Math.round(data.expireTimeMs! / 1000); // Ms to UTC timestamp
  const tx = await questFactoryContract.createQuest(
    data.title,
    ipfsHash, // Push description to IPFS and push hash to quest contract
    TOKENS.Honey.token,
    questExpireTimeUtcSec,
    fallbackAddress,
  );
  onTx?.(tx.hash);
  Logger.info('Tx hash', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  if (receipt.status) Logger.debug('Tx receipt', receipt);
  else Logger.error('Transaction failed', { txReceipt: receipt });
  return receipt;
}

export async function fundQuest(
  erc20Contract: Contract | ContractError,
  questAddress: string,
  amount: TokenAmountModel,
  onTx?: (hash: string) => void,
) {
  if (erc20Contract instanceof ContractError) throw erc20Contract; // Throw error
  Logger.debug('Funding quest...', { questAddress, amount });
  const tx = await erc20Contract.transfer(questAddress, toBigNumber(amount));
  onTx?.(tx.hash);
  return handleTransaction(tx);
}

export async function scheduleQuestClaim(
  governQueueContract: Contract | ContractError,
  container: ContainerModel,
  onTx?: (hash: string) => void,
) {
  if (governQueueContract instanceof ContractError) throw governQueueContract; // Throw error
  Logger.debug('Scheduling quest claim...', { container });
  const tx = (await governQueueContract.schedule(container, {
    gasLimit: 12e6,
    gasPrice: 2e9,
  })) as ContractTransaction;
  onTx?.(tx.hash);
  return handleTransaction(tx);
}

export async function executeQuestClaim(
  governQueueContract: Contract | ContractError,
  claimData: ClaimModel,
  execTime?: number,
  onTx?: (hash: string) => void,
) {
  if (governQueueContract instanceof ContractError) throw governQueueContract; // Throw error
  if (!governQueueContract?.address)
    throw Error('ContractError : <governQueueContract> has not been set properly');
  claimData.executionTime = claimData.executionTime ?? execTime;
  const container = await computeContainer(claimData);
  Logger.debug('Executing quest claim...', { container, claimData });
  const tx = await governQueueContract.execute(container, { gasLimit: 12e6, gasPrice: 2e9 });
  onTx?.(tx.hash);
  return handleTransaction(tx);
}

export async function challengeQuestClaim(
  governQueueContract: Contract | ContractError,
  container: ContainerModel,
  challenge: ChallengeModel,
  onTx?: (hash: string) => void,
) {
  if (governQueueContract instanceof ContractError) throw governQueueContract; // Throw error
  if (!governQueueContract?.address)
    throw Error('ContractError : <governQueueContract> has not been set properly');
  Logger.debug('Challenging quest...', { container, challenge });
  const challengeReasonIpfs = await pushObjectToIpfs(challenge.reason ?? '');
  const tx = await governQueueContract.functions.challenge(container, challengeReasonIpfs);
  onTx?.(tx.hash);
  return handleTransaction(tx);
}

export async function reclaimQuestUnusedFunds(
  questContract: Contract | ContractError,
  onTx?: (hash: string) => void,
) {
  if (questContract instanceof ContractError) throw questContract; // Throw error
  Logger.debug('Reclaiming quest unused funds...', { quest: questContract.address });
  const tx = await questContract.recoverUnclaimedFunds();
  onTx?.(tx.hash);
  return handleTransaction(tx);
}

export async function approveTokenAmount(
  erc20Contract: Contract | ContractError,
  fromAddress: string,
  tokenAmount: TokenModel,
  onTx?: (hash: string) => void,
) {
  if (erc20Contract instanceof ContractError) throw erc20Contract; // Throw error
  if (erc20Contract instanceof ContractError || !erc20Contract?.address) {
    throw erc20Contract;
  }
  Logger.debug('Approving token amount ...', { tokenAmount, fromAddress });
  const tx = await erc20Contract.approve(fromAddress, tokenAmount.amount);
  onTx?.(tx.hash);
  return handleTransaction(tx);
}

// #endregion
