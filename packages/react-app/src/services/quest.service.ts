import { request } from 'graphql-request';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { hexToBytes, toAscii, toChecksumAddress } from 'web3-utils';
import {
  GovernQueueChallengesQuery,
  GovernQueueEntityContainersQuery,
  GovernQueueEntityQuery,
} from 'src/queries/govern-queue-entity.query';
import { BigNumber, ContractTransaction, ethers } from 'ethers';
import { ConfigModel, ContainerModel, PayloadModel } from 'src/models/govern.model';
import { ClaimModel } from 'src/models/claim.model';
import { ChallengeModel } from 'src/models/challenge.model';
import { TokenModel } from 'src/models/token.model';
import { toTokenAmountModel } from 'src/utils/data.utils';
import { DisputeModel } from 'src/models/dispute.model';
import { arrayDistinct } from 'src/utils/array.util';
import { DashboardModel } from 'src/models/dashboard.model';
import {
  fetchQuestEnity,
  fetchQuestEntities,
  fetchActiveQuestEntitiesLight,
  fetchQuestRewardTokens,
} from 'src/queries/quests.query';
import { DEFAULT_CLAIM_EXECUTION_DELAY_MS, IS_DEV, TOKENS } from '../constants';
import { Logger } from '../utils/logger';
import { fromBigNumber, toBigNumber } from '../utils/web3.utils';
import {
  getObjectFromIpfs,
  pushObjectToIpfs,
  formatIpfsMarkdownLink,
  ipfsTheGraph,
} from './ipfs.service';
import {
  getTokenInfo,
  getQuestContractInterface,
  getERC20Contract,
  getQuestFactoryContract,
  getQuestContract,
  getGovernQueueContract,
  getCelesteContract,
} from '../utils/contract.util';
import { processQuestState } from './state-machine';
import { getLastBlockTimestamp } from '../utils/date.utils';
import { cacheFetchTokenPrice } from './cache.service';

let questList: QuestModel[] = [];

type onTxCallback = (_hash: string) => void;

// #region Private
async function mapQuest(questEntity: any) {
  if (!questEntity) return undefined;
  try {
    let quest = {
      address: toChecksumAddress(questEntity.questAddress),
      title: questEntity.questTitle,
      description: questEntity.questDescription || undefined, // if '' -> undefined
      detailsRefIpfs: toAscii(questEntity.questDetailsRef),
      rewardToken: await getTokenInfo(questEntity.questRewardTokenAddress),
      expireTime: new Date(questEntity.questExpireTimeSec * 1000), // sec to Ms
      creationTime: new Date(questEntity.creationTimestamp * 1000), // sec to Ms
    } as QuestModel;
    quest = processQuestState(quest);
    if (!quest.detailsRefIpfs) quest.description = '[No description]';
    // If failed to fetch ipfs description
    else if (!quest.description)
      quest.description = formatIpfsMarkdownLink(quest.detailsRefIpfs, 'See description');
    return quest;
  } catch (error) {
    Logger.exception(error, `Failed to map quest :\n${JSON.stringify(questEntity)}`);
    return undefined;
  }
}

function mapQuestList(quests: any[]): Promise<QuestModel[]> {
  return Promise.all(quests.map(mapQuest).filter((quest) => !!quest)) as Promise<QuestModel[]>; // Filter out undefined quests (skiped)
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
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  // Let the trx initiate before playing with the receipt
  if (!tx) return null;
  try {
    onTx?.(tx.hash);
  } catch (error) {
    Logger.exception(error);
  }
  Logger.info('Tx hash', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  if (receipt.status) Logger.debug('Tx receipt', receipt);
  else {
    Logger.error('Transaction failed', { txReceipt: receipt });
  }
  return receipt;
}

async function generateScheduleContainer(
  walletAddress: string,
  claimData: ClaimModel,
  extraDelaySec?: number,
): Promise<ContainerModel> {
  const { governAddress } = getNetwork();
  const governQueueResult = await fetchGovernQueue();
  const erc3000Config = governQueueResult.config;
  const lastBlockTimestamp = await getLastBlockTimestamp();

  if (!claimData.evidence) throw new Error('Evidence field is required');

  // A bit more than the execution delay
  const executionTime =
    lastBlockTimestamp +
    erc3000Config.executionDelay +
    (extraDelaySec || DEFAULT_CLAIM_EXECUTION_DELAY_MS / 1000); // Add 15 minutes by default
  const evidenceIpfsHash = await pushObjectToIpfs(claimData.evidence);
  const claimCall = encodeClaimAction(claimData, evidenceIpfsHash);

  return {
    config: erc3000Config,
    payload: {
      nonce: governQueueResult.nonce + 1, // Increment nonce for each schedule
      executionTime,
      submitter: walletAddress,
      executor: governAddress,
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

// #endregion

// #region Subgraph Queries

export async function fetchQuestsPaging(
  currentIndex: number,
  count: number,
  filter: FilterModel,
): Promise<QuestModel[]> {
  const queryResult = await fetchQuestEntities(currentIndex, count, filter);
  const newQuests = await mapQuestList(queryResult);
  questList = questList.concat(newQuests);
  return newQuests;
}

export async function fetchQuest(questAddress: string) {
  const queryResult = await fetchQuestEnity(questAddress);
  const newQuest = mapQuest(queryResult);
  return newQuest;
}

export async function fetchQuestClaims(quest: QuestModel): Promise<ClaimModel[]> {
  const res = await fetchGovernQueueContainers();

  return Promise.all(
    res
      .filter((x) => x.payload.actions[0].to.toLowerCase() === quest.address?.toLowerCase())
      .map(async (container) => {
        const { evidenceIpfsHash, claimAmount, playerAddress } = decodeClaimAction(
          container.payload,
        );

        const tokenModel =
          typeof quest.rewardToken === 'string'
            ? ((await getTokenInfo(quest.rewardToken)) as TokenModel)
            : quest.rewardToken;
        return {
          claimedAmount: {
            token: tokenModel,
            parsedAmount: fromBigNumber(BigNumber.from(claimAmount), tokenModel?.decimals),
          },
          evidenceIpfsHash,
          playerAddress,
          questAddress: quest.address,
          state: container.state,
          executionTimeMs: +container.payload.executionTime * 1000, // Sec to MS
          container,
        } as ClaimModel;
      }),
  ).then((claims) =>
    claims.sort((a: ClaimModel, b: ClaimModel) => b.executionTimeMs! - a.executionTimeMs!),
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
  ).containerEventChallenges.find((x: any) =>
    x.container.queue.id.localeCompare(governQueueAddress),
  ); // Validate same queue as app GovernQueue

  if (!result) return null;

  const { disputeId, reason, createdAt, resolver, collateral, challenger } = result;
  let fetchedReason: string | undefined;
  try {
    fetchedReason = await getObjectFromIpfs(reason);
  } catch (error) {
    fetchedReason = await getObjectFromIpfs(reason, ipfsTheGraph); // try with thegraph ipfs node
    Logger.exception(error, 'Failed to get IPFS object when fetching challenge');
  }
  return {
    deposit: {
      parsedAmount: fromBigNumber(collateral.amount, collateral.decimals),
      token: collateral,
    },
    reason: fetchedReason ?? formatIpfsMarkdownLink(reason, 'See reason'),
    createdAt,
    resolver,
    challengerAddress: toChecksumAddress(challenger),
    disputeId,
  };
}

export async function fetchRewardTokens(): Promise<TokenModel[]> {
  const tokenAddresses = await fetchQuestRewardTokens();
  return Promise.all(
    arrayDistinct<string>(tokenAddresses)
      .map(getTokenInfo)
      .filter((x) => !!x),
  ) as Promise<TokenModel[]>;
}

export async function getDashboardInfo(): Promise<DashboardModel> {
  const result = await fetchActiveQuestEntitiesLight();
  const quests = result.questEntities as { id: string; questRewardTokenAddress: string }[];
  const funds = (
    await Promise.all(
      quests.map(async (quest) => getBalanceOf(quest.questRewardTokenAddress, quest.id)),
    )
  ).filter((x) => !!x) as TokenAmountModel[];

  const totalFunds = funds.map((x) => x.usdValue).filter((x) => x !== undefined) as number[];

  if (IS_DEV) {
    BigNumber.prototype.toJSON = function toJSON() {
      return fromBigNumber(this, 18);
    };
    Logger.debug('totalFunds', JSON.stringify(totalFunds, null, 4));
  }

  const totalFundsSummed = totalFunds.length ? totalFunds.reduce((a, b) => a + b) : 0;

  return {
    questCount: result.questEntities.length,
    totalFunds: totalFundsSummed,
  };
}

// #endregion

// #region QuestFactory

export async function saveQuest(
  walletAddress: string,
  fallbackAddress: string,
  data: Partial<QuestModel>,
  address?: string,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  if (address) throw Error('Saving existing quest is not yet implemented');
  Logger.debug('Saving quest...', { fallbackAddress, data, address });
  const { defaultGazFees } = getNetwork();
  const ipfsHash = await pushObjectToIpfs(data.description ?? '');
  const questExpireTimeUtcSec = Math.round(data.expireTime!.getTime() / 1000); // Ms to UTC timestamp
  const tx = await getQuestFactoryContract(walletAddress)?.createQuest(
    data.title,
    ipfsHash, // Push description to IPFS and push hash to quest contract
    typeof data.rewardToken === 'string' ? data.expireTime : data.rewardToken!.token,
    questExpireTimeUtcSec,
    fallbackAddress,
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

// #endregion

// #region Quest

export async function reclaimQuestUnusedFunds(
  walletAddress: string,
  quest: QuestModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  if (!quest.address) throw new Error('Quest address is not defined when reclaiming');
  const questContract = getQuestContract(quest.address, walletAddress);
  if (!questContract) return null;
  Logger.debug('Reclaiming quest unused funds...', { quest });
  const tx = await questContract.recoverUnclaimedFunds();
  return handleTransaction(tx, onTx);
}

export async function getQuestRecoveryAddress(questAddress: string): Promise<string | null> {
  return getQuestContract(questAddress)?.fundsRecoveryAddress() ?? null;
}

// #region

// #region ERC20

export async function fundQuest(
  walletAddress: string,
  questAddress: string,
  amount: TokenAmountModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const contract = getERC20Contract(amount.token, walletAddress);
  if (!contract) return null;
  Logger.debug('Funding quest...', { questAddress, amount });
  const tx = await contract.transfer(questAddress, toBigNumber(amount));
  return handleTransaction(tx, onTx);
}

export async function approveTokenAmount(
  walletAddress: string,
  toAddress: string,
  tokenAmount: TokenModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const erc20Contract = getERC20Contract(tokenAmount.token, walletAddress);
  if (!erc20Contract) return null;
  const { defaultGazFees } = getNetwork();
  Logger.debug('Approving token amount...', { tokenAmount, fromAddress: toAddress });
  const tx = await erc20Contract.approve(toAddress, tokenAmount.amount, defaultGazFees);
  return handleTransaction(tx, onTx);
}

export async function getBalanceOf(
  token: TokenModel | string,
  address: string,
): Promise<TokenAmountModel | null> {
  try {
    let tokenInfo: TokenModel;
    if (typeof token === 'string') tokenInfo = (await getTokenInfo(token)) as TokenModel;
    else tokenInfo = token;
    if (tokenInfo) {
      const erc20Contract = getERC20Contract(tokenInfo);
      if (!erc20Contract) return null;
      const balance = (await erc20Contract.balanceOf(address)) as BigNumber;
      tokenInfo.amount = balance.toString();
      const price = await cacheFetchTokenPrice(tokenInfo);
      const parsedAmount = fromBigNumber(balance, tokenInfo.decimals);
      return {
        token: tokenInfo,
        parsedAmount,
        usdValue: parsedAmount * fromBigNumber(price, tokenInfo.decimals),
      };
    }
  } catch (error) {
    Logger.exception(error);
  }
  return null;
}

// #endregion

// #region GovernQueue

export async function scheduleQuestClaim(
  walletAddress: string,
  claimData: ClaimModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const governQueueContract = getGovernQueueContract(walletAddress);
  if (!governQueueContract) return null;
  const container = await generateScheduleContainer(walletAddress, claimData);
  const { defaultGazFees } = getNetwork();
  Logger.debug('Scheduling quest claim...', { container });
  const tx = (await governQueueContract.schedule(container, defaultGazFees)) as ContractTransaction;
  return handleTransaction(tx, onTx);
}

export async function executeQuestClaim(
  walletAddress: string,
  claimData: ClaimModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const governQueueContract = getGovernQueueContract(walletAddress);
  if (!governQueueContract) return null;
  const { defaultGazFees } = getNetwork();
  Logger.debug('Executing quest claim...', { container: claimData.container, claimData });
  const tx = await governQueueContract.execute(
    { config: claimData.container!.config, payload: claimData.container!.payload },
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

export async function challengeQuestClaim(
  walletAddress: string,
  challenge: ChallengeModel,
  container: ContainerModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const governQueueContract = getGovernQueueContract(walletAddress);
  if (!governQueueContract) return null;
  Logger.debug('Challenging quest...', { container, challenge });
  const challengeReasonIpfs = await pushObjectToIpfs(challenge.reason ?? '');
  const { defaultGazFees } = getNetwork();
  const tx = await governQueueContract.challenge(
    { config: container.config, payload: container.payload },
    challengeReasonIpfs,
    defaultGazFees,
  );
  return handleTransaction(tx, onTx);
}

export async function resolveClaimChallenge(
  walletAddress: string,
  container: ContainerModel,
  dispute: DisputeModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const governQueueContract = getGovernQueueContract(walletAddress);
  if (!governQueueContract) return null;
  Logger.debug('Resolving claim challenge...', { container, dispute });
  const { defaultGazFees } = getNetwork();
  const tx = await governQueueContract.resolve(container, dispute.id, defaultGazFees);
  return handleTransaction(tx, onTx);
}

// #region

// #region Celeste

export async function fetchChallengeFee(): Promise<TokenAmountModel | null> {
  const celesteContract = getCelesteContract();
  if (!celesteContract) return null;
  const [, feeToken, feeAmount] = await celesteContract.getDisputeFees();
  return toTokenAmountModel({
    ...TOKENS.Honey,
    token: feeToken,
    amount: feeAmount,
  });
}

export async function fetchChallengeDispute(
  challenge: ChallengeModel,
): Promise<DisputeModel | null> {
  const celesteContract = getCelesteContract();
  if (!celesteContract) return null;
  if (challenge.disputeId === undefined)
    throw new Error('Dispute does not exist yet, please try again later');
  const { state } = await celesteContract.disputes(challenge.disputeId);
  return {
    id: challenge.disputeId,
    state,
  };
}

// #endregion
