/* eslint-disable no-unused-vars */
import { request } from 'graphql-request';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { QuestEntityQuery, QuestEntitiesQuery } from 'src/queries/quest-entity.query';
import { hexToBytes, toAscii, toChecksumAddress } from 'web3-utils';
import {
  GovernQueueChallengesQuery,
  GovernQueueEntityContainersQuery,
  GovernQueueEntityQuery,
} from 'src/queries/govern-queue-entity.query';
import { BigNumber, Contract, ContractTransaction, ethers } from 'ethers';
import { ConfigModel, ContainerModel, PayloadModel } from 'src/models/govern.model';
import { ClaimModel } from 'src/models/claim.model';
import { ChallengeModel } from 'src/models/challenge.model';
import { TokenModel } from 'src/models/token.model';
import { toTokenAmountModel } from 'src/utils/data.utils';
import { ContractInstanceError, NullableContract } from 'src/models/contract-error';
import { number } from 'prop-types';
import { DisputeModel } from 'src/models/dispute.model';
import { ENUM_CLAIM_STATE, GQL_MAX_INT, TOKENS } from '../constants';
import { Logger } from '../utils/logger';
import { fromBigNumber, toBigNumber } from '../utils/web3.utils';
import { getIpfsBaseUri, getObjectFromIpfs, pushObjectToIpfs } from './ipfs.service';
import { getQuestContractInterface } from '../hooks/use-contract.hook';
import { processQuestState } from './state-machine';
import { getLastBlockTimestamp } from '../utils/date.utils';
import {
  CelesteCourtConfigEntitiesQuery,
  CelesteDisputeEntityQuery,
} from '../queries/celeste-config-entity.query';

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
  const { governSubgraph, governQueueAddress } = getNetwork();

  const result = await request(governSubgraph, GovernQueueEntityQuery, {
    ID: governQueueAddress.toLowerCase(),
  });

  if (!result?.governQueue)
    throw new Error(`GovernQueue does not exist at this address : ${governQueueAddress}`);
  const { config, nonce } = result.governQueue;
  return (
    result.governQueue && {
      config: {
        ...config,
        rules: hexToBytes(config.rules),
        maxCalldataSize: +config.maxCalldataSize,
        executionDelay: +config.executionDelay,
      },
      nonce: +nonce,
    }
  );
}

async function fetchGovernQueueContainers(): Promise<ContainerModel[]> {
  const { governSubgraph, governQueueAddress } = getNetwork();
  const result = await request(governSubgraph, GovernQueueEntityContainersQuery, {
    ID: governQueueAddress.toLowerCase(),
  });
  if (!result?.governQueue)
    throw new Error(`GovernQueue does not exist at this address : ${governQueueAddress}`);

  const containers = result.governQueue.containers.map(
    (x: any) =>
      ({
        id: x.id,
        payload: {
          ...x.payload,
          executionTime: +x.payload.executionTime,
          nonce: +x.payload.nonce,
          actions: x.payload.actions.map((a: any) => ({
            to: toChecksumAddress(a.to),
            data: a.data,
            value: +a.value,
          })),
          executor: toChecksumAddress(x.payload.executor.id),
          submitter: toChecksumAddress(x.payload.submitter),
          allowFailuresMap: x.payload.allowFailuresMap,
        },
        state: x.state,
        config: {
          ...x.config,
          rules: x.config.rules,
          maxCalldataSize: +x.config.maxCalldataSize,
        },
      } as ContainerModel),
  );

  return containers as ContainerModel[];
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
    toBigNumber(claimData.claimedAmount),
  ]);
}

async function handleTransaction(
  tx: any,
  onTx?: (hash: string) => void,
): Promise<ethers.ContractReceipt> {
  // Let the trx initiate before playing with the receipt
  try {
    onTx?.(tx.hash);
  } catch (error) {
    Logger.error(error);
  }
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

// #region Subgraph Queries

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
  else expireTimeLower = filter.status ? 0 : now;
  if (filter.expire?.end) expireTimeUpper = Math.round(filter.expire.end.getTime() / 1000);
  // TODO : Change to a later time when supported by grapql-request
  else expireTimeUpper = filter.status ? now : GQL_MAX_INT; // January 18, 2038 10:14:07 PM
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

export async function computeScheduleContainer(
  claimData: ClaimModel,
  extraDelaySec?: number,
): Promise<ContainerModel> {
  const { governAddress: govern } = getNetwork();

  const governQueueResult = await fetchGovernQueue();

  const ERC3000Config = {
    ...governQueueResult.config, // default config fetched from govern subgraph
    // resolver: celeste, // Celeste
    // executionDelay: Math.round(DEAULT_CLAIM_EXECUTION_DELAY_MS / 1000), // delay after which the claim can be executed by player
  } as ConfigModel;

  const erc3000Config = governQueueResult.config;

  const lastBlockTimestamp = await getLastBlockTimestamp();

  // A bit more than the execution delay
  const executionTime = +lastBlockTimestamp + +erc3000Config.executionDelay + (extraDelaySec ?? 60); // Add 1 minute by default

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
  const res = await fetchGovernQueueContainers();

  return Promise.all(
    res
      .filter(
        (x) =>
          x.payload.actions[0].to.toLowerCase() === quest.address?.toLowerCase() &&
          (x.state === ENUM_CLAIM_STATE.Scheduled || x.state === ENUM_CLAIM_STATE.Challenged),
      )
      .map(async (x) => {
        const { evidenceIpfsHash, claimAmount, playerAddress } = decodeClaimAction(x.payload);
        const evidence = await getObjectFromIpfs(evidenceIpfsHash);
        return {
          claimedAmount: {
            token: quest.rewardToken,
            parsedAmount: fromBigNumber(BigNumber.from(claimAmount), quest.rewardToken?.decimals),
          },
          evidence,
          playerAddress,
          questAddress: quest.address,
          state: x.state,
          executionTimeMs: +x.payload.executionTime * 1000, // Sec to MS
          container: x,
        } as ClaimModel;
      }),
  );
}

export async function fetchDeposits() {
  const { config } = await fetchGovernQueue();
  return {
    claim: toTokenAmountModel(config.scheduleDeposit),
    challenge: toTokenAmountModel(config.challengeDeposit),
  };
}

export async function getClaimExecutableTime(questAddress: string, playerAddress: string) {
  const governQueueContainers = await fetchGovernQueueContainers();
  const container: ContainerModel | undefined = governQueueContainers?.find(
    (x: ContainerModel) =>
      x.payload.submitter === playerAddress && x.payload.actions[0].to === questAddress,
  );

  return container && +container.payload.executionTime * 1000; // Convert Sec to MS
}

export async function fetchChallenge(container: ContainerModel): Promise<ChallengeModel | null> {
  const { governSubgraph, governQueueAddress } = getNetwork();
  const result = (
    await request(governSubgraph, GovernQueueChallengesQuery, {
      containerId: container.id,
    })
  ).containerEventChallenges.find((x: any) => x.container.queue.id === governQueueAddress); // Validate same queue as app GovernQueue
  if (!result)
    return {
      reason: 'Fake reason',
      challengerAddress: '0xf4b90fa2bd7c95afb248e9d4b98edd30b8a4b452',
    } as any; // TODO  unfake

  const { disputeId, reason, createdAt, resolver, collateral, challenger } = result;
  return {
    deposit: {
      parsedAmount: fromBigNumber(collateral.amount, collateral.decimals),
      token: collateral,
    },
    reason: (await getObjectFromIpfs(reason)) ?? '',
    createdAt,
    resolver,
    challengerAddress: challenger,
    disputeId,
  };
}

// #endregion

// #region QuestFactory

export async function saveQuest(
  questFactoryContract: NullableContract,
  fallbackAddress: string,
  data: Partial<QuestModel>,
  address?: string,
  onTx?: (hash: string) => void,
) {
  if (!questFactoryContract.instance) throw questFactoryContract.error;
  if (address) throw Error('Saving existing quest is not yet implemented');
  if (!questFactoryContract.instance?.address)
    throw Error('ContractError : <questFactoryContract> has not been set properly');
  Logger.debug('Saving quest...', { fallbackAddress, data, address });
  const { defaultToken, defaultGazFees } = getNetwork();
  const ipfsHash = await pushObjectToIpfs(data.description ?? '');
  const questExpireTimeUtcSec = Math.round(data.expireTimeMs! / 1000); // Ms to UTC timestamp
  const tx = await questFactoryContract.instance.createQuest(
    data.title,
    ipfsHash, // Push description to IPFS and push hash to quest contract
    defaultToken.token,
    questExpireTimeUtcSec,
    fallbackAddress,
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

// #endregion

// #region Quest

export async function reclaimQuestUnusedFunds(
  questContract: NullableContract,
  onTx?: (hash: string) => void,
) {
  if (!questContract.instance) throw questContract.error;
  Logger.debug('Reclaiming quest unused funds...', { quest: questContract.instance.address });
  const tx = await questContract.instance.recoverUnclaimedFunds();
  return handleTransaction(tx, onTx);
}

// #region

// #region ERC20

export async function fundQuest(
  erc20Contract: NullableContract,
  questAddress: string,
  amount: TokenAmountModel,
  onTx?: (hash: string) => void,
) {
  if (!erc20Contract.instance) throw erc20Contract.error;
  Logger.debug('Funding quest...', { questAddress, amount });
  const tx = await erc20Contract.instance.transfer(questAddress, toBigNumber(amount));
  return handleTransaction(tx, onTx);
}

export async function getBalanceOf(
  erc20Contract: NullableContract,
  token: TokenModel,
  address: string,
): Promise<TokenAmountModel> {
  if (!erc20Contract.instance) throw erc20Contract.error;
  const balance = await erc20Contract.instance.balanceOf(address);
  return {
    token,
    parsedAmount: fromBigNumber(balance, token.decimals),
  };
}

export async function approveTokenAmount(
  erc20Contract: NullableContract,
  toAddress: string,
  tokenAmount: TokenModel,
  onTx?: (hash: string) => void,
) {
  if (!erc20Contract.instance) throw erc20Contract.error;

  const { defaultGazFees } = getNetwork();
  Logger.debug('Approving token amount ...', { tokenAmount, fromAddress: toAddress });
  const tx = await erc20Contract.instance.approve(toAddress, tokenAmount.amount, defaultGazFees);
  return handleTransaction(tx, onTx);
}

// #endregion

// #region GovernQueue

export async function scheduleQuestClaim(
  governQueueContract: NullableContract,
  container: ContainerModel,
  onTx?: (hash: string) => void,
) {
  if (!governQueueContract.instance) throw governQueueContract.error;
  const { defaultGazFees } = getNetwork();
  Logger.debug('Scheduling quest claim...', { container });
  const tx = (await governQueueContract.instance.schedule(
    container,
    defaultGazFees,
  )) as ContractTransaction;
  return handleTransaction(tx, onTx);
}

export async function executeQuestClaim(
  governQueueContract: NullableContract,
  claimData: ClaimModel,
  onTx?: (hash: string) => void,
) {
  if (!governQueueContract.instance) throw governQueueContract.error;
  const { defaultGazFees } = getNetwork();
  Logger.debug('Executing quest claim...', { container: claimData.container, claimData });
  const tx = await governQueueContract.instance.execute(
    { config: claimData.container!.config, payload: claimData.container!.payload },
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

export async function challengeQuestClaim(
  governQueueContract: NullableContract,
  challenge: ChallengeModel,
  container: ContainerModel,
  onTx?: (hash: string) => void,
) {
  if (!governQueueContract.instance) throw governQueueContract.error;
  Logger.debug('Challenging quest...', { container, challenge });
  const challengeReasonIpfs = await pushObjectToIpfs(challenge.reason ?? '');
  const { defaultGazFees } = getNetwork();
  const tx = await governQueueContract.instance.challenge(
    { config: container.config, payload: container.payload },
    challengeReasonIpfs,
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

export async function resolveClaimChallenge(
  governQueueContract: NullableContract,
  container: ContainerModel,
  dispute: DisputeModel,
  onTx?: (hash: string) => void,
) {
  if (!governQueueContract.instance) throw governQueueContract.error;
  Logger.debug('Resolving claim challenge...', { container, dispute });
  const { defaultGazFees } = getNetwork();
  const tx = await governQueueContract.instance.resolveClaimChallenge(
    container,
    dispute.id,
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

// #region

// #region Celeste

export async function fetchChallengeFee(
  celesteContract: NullableContract,
): Promise<TokenAmountModel> {
  if (!celesteContract.instance) throw celesteContract.error;
  const [, feeToken, feeAmount] = await celesteContract.instance.getDisputeFees();

  return toTokenAmountModel({
    ...TOKENS.Honey,
    token: feeToken,
    amount: feeAmount,
  });
}

export async function fetchChallengeDispute(
  celesteContract: NullableContract,
  challenge: ChallengeModel,
): Promise<DisputeModel> {
  if (!celesteContract.instance) throw celesteContract.error;
  if (!challenge.disputeId) throw new Error('Dispute does not exist yet, please try again later');

  const { state } = await celesteContract.instance.disputes(challenge.disputeId);

  return {
    id: challenge.disputeId,
    state,
  };
}

// #endregion
