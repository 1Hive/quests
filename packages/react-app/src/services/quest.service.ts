import { request } from 'graphql-request';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { hexToBytes, toAscii, toChecksumAddress, hexToAscii } from 'web3-utils';
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
import { DepositModel } from 'src/models/deposit-model';
import { compareCaseInsensitive } from 'src/utils/string.util';
import { DEFAULT_CLAIM_EXECUTION_DELAY_MS, ENUM_CLAIM_STATE } from '../constants';
import { Logger } from '../utils/logger';
import { fromBigNumber, toBigNumber } from '../utils/web3.utils';
import {
  getObjectFromIpfs,
  pushObjectToIpfs,
  formatIpfsMarkdownLink,
  ipfsTheGraph,
  getIpfsBaseUri,
} from './ipfs.service';
import {
  getTokenInfo,
  getQuestContractInterface,
  getERC20Contract,
  getQuestFactoryContract,
  getQuestContract,
  getGovernQueueContract,
  getCelesteDisputeManagerContract,
} from '../utils/contract.util';
import { getLastBlockTimestamp } from '../utils/date.utils';
import { cacheFetchBalance, cacheFetchTokenPrice } from './cache.service';

let questList: QuestModel[] = [];

type onTxCallback = (_hash: string) => void;

// #region Private
async function mapQuest(questEntity: any) {
  if (!questEntity) return undefined;
  try {
    const quest = {
      address: toChecksumAddress(questEntity.questAddress),
      title: questEntity.questTitle,
      description: questEntity.questDescription || undefined, // if '' -> undefined
      detailsRefIpfs: toAscii(questEntity.questDetailsRef),
      rewardToken: await getTokenInfo(questEntity.questRewardTokenAddress),
      expireTime: new Date(questEntity.questExpireTimeSec * 1000), // sec to Ms
      creationTime: new Date(questEntity.creationTimestamp * 1000), // sec to Ms
      deposit: +questEntity.depositToken
        ? ({
            amount: BigNumber.from(questEntity.depositAmount),
            token: toChecksumAddress(questEntity.depositToken),
          } as DepositModel)
        : undefined,
      fallbackAddress: toChecksumAddress(questEntity.questFundsRecoveryAddress),
      creatorAddress: toChecksumAddress(questEntity.questCreator),
    } as QuestModel;

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
  const [claimInfoIpfsHash, playerAddress, claimAmount, claimAll] =
    getQuestContractInterface().decodeFunctionData('claim', payload.actions[0].data);
  return { claimInfoIpfsHash, playerAddress, claimAmount, claimAll };
}

function encodeClaimAction(claimData: ClaimModel, claimInfoIpfsHash: string) {
  return getQuestContractInterface().encodeFunctionData('claim', [
    claimInfoIpfsHash,
    claimData.playerAddress,
    toBigNumber(claimData.claimedAmount),
    claimData.claimAll,
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
  questData: QuestModel,
  extraDelaySec?: number,
): Promise<ContainerModel> {
  const questContract = getQuestContract(claimData.questAddress);
  const governAddress = await questContract.aragonGovernAddress();
  const governQueueResult = await fetchGovernQueue();
  const erc3000Config = governQueueResult.config;
  const lastBlockTimestamp = await getLastBlockTimestamp();

  if (!claimData.evidence) throw new Error('Evidence field is required');

  // A bit more than the execution delay
  const executionTime =
    lastBlockTimestamp +
    erc3000Config.executionDelay +
    (extraDelaySec || DEFAULT_CLAIM_EXECUTION_DELAY_MS / 1000); // Add 15 minutes by default
  const { evidence } = claimData;
  const disputableDescription = `Claim action on ${questData.title}`;
  const claimInfoIpfsHash = await pushObjectToIpfs(evidence);
  const questPayloadIpfsHash = await pushObjectToIpfs({
    evidence,
    contactInformation: claimData.contactInformation,
    description: disputableDescription,
    disputedActionText: 'Challenged Quest claim',
    disputedActionURL: getIpfsBaseUri() + hexToAscii(claimInfoIpfsHash),
    agreementTitle: '1Hive Community Covenant',
    disputedActionRadspec: `https://quests.1hive.org/#/detail?id=${questData.address}`,
    organization: 'Quests',
    defendant: claimData.playerAddress,
  });

  const claimCall = encodeClaimAction(claimData, questPayloadIpfsHash);

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
      proof: claimInfoIpfsHash,
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

export async function fetchQuestClaims(
  quest: QuestModel,
  skipIpfs?: boolean,
): Promise<ClaimModel[]> {
  const res = await fetchGovernQueueContainers();

  return Promise.all(
    res
      .filter((x) => x.payload.actions[0].to.toLowerCase() === quest.address?.toLowerCase())
      .map(async (container) => {
        const { claimInfoIpfsHash, claimAmount, playerAddress, claimAll } = decodeClaimAction(
          container.payload,
        );

        const tokenModel =
          typeof quest.rewardToken === 'string'
            ? ((await getTokenInfo(quest.rewardToken)) as TokenModel)
            : quest.rewardToken;
        const claim = {
          claimedAmount: {
            token: tokenModel,
            parsedAmount: fromBigNumber(BigNumber.from(claimAmount), tokenModel?.decimals),
          },
          claimInfoIpfsHash,
          playerAddress,
          questAddress: quest.address,
          state: container.state ? ENUM_CLAIM_STATE[container.state] : undefined,
          claimAll,
          executionTimeMs: +container.payload.executionTime * 1000, // Sec to MS
          container,
        } as ClaimModel;

        if (skipIpfs) {
          claim.evidence = formatIpfsMarkdownLink(claimInfoIpfsHash, 'See evidence');
        } else {
          const { evidence, contactInformation } = await fetchClaimIpfsInfo(claimInfoIpfsHash);
          claim.evidence = evidence;
          claim.contactInformation = contactInformation;
        }

        return claim;
      }),
  ).then((claims) =>
    claims.sort((a: ClaimModel, b: ClaimModel) => b.executionTimeMs! - a.executionTimeMs!),
  );
}

export async function fetchClaimIpfsInfo(claimInfoIpfsHash?: string) {
  if (claimInfoIpfsHash) {
    try {
      const ipfsResult = await getObjectFromIpfs<{
        evidence: string;
        contactInformation?: string;
      }>(claimInfoIpfsHash, ipfsTheGraph);

      if (!ipfsResult) throw new Error('IPFS result is undefined');

      //  Backward compatibility of only string format
      if (typeof ipfsResult === 'string') {
        if (ipfsResult.includes('ContactInformation: ')) {
          const splitResult = ipfsResult.split('\n');
          const contactInformation = splitResult[splitResult.length - 1].replace(
            'ContactInformation: ',
            '',
          ); // Contact information is always the last line and remove the prefix
          const evidence = splitResult.slice(0, splitResult.length - 1).join('\n'); // Evidence is everything but the last line
          return { evidence, contactInformation };
        }
      } else {
        return {
          evidence: ipfsResult.evidence,
          contactInformation: ipfsResult.contactInformation,
        };
      }

      return { evidence: ipfsResult };
    } catch (error) {
      return { evidence: formatIpfsMarkdownLink(claimInfoIpfsHash, 'See evidence') };
    }
  } else {
    return { evidence: 'No evidence submited from the Player' };
  }
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
  const fetchedReason = await getObjectFromIpfs(reason, ipfsTheGraph);
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
  const tokensResult = await (Promise.all(
    arrayDistinct<string>(tokenAddresses).map(getTokenInfo),
  ) as Promise<TokenModel[]>);
  return tokensResult.filter((token) => !!token); // Filter out not found tokens
}

export async function getDashboardInfo(): Promise<DashboardModel> {
  const { isTestNetwork } = getNetwork();
  const result = await fetchActiveQuestEntitiesLight();
  const quests = result.questEntities as {
    id: string;
    questRewardTokenAddress: string;
    depositToken: string;
    depositAmount: string;
  }[];
  const funds = (
    await Promise.all(
      quests.map(async (quest) =>
        getBalanceOf(
          quest.questRewardTokenAddress,
          quest.id,
          {
            amount: BigNumber.from(quest.depositAmount),
            token: quest.depositToken,
          },
          true,
        ),
      ),
    )
  ).filter((x) => !!x) as TokenAmountModel[];
  const totalFunds = funds
    .map((x) => {
      if (isTestNetwork && x.usdValue === undefined) {
        return x.parsedAmount; // fallabck to 1$ value for rinkeby environment
      }
      return x.usdValue ?? 0;
    })
    .filter((x) => x !== undefined) as number[];

  BigNumber.prototype.toJSON = function toJSON() {
    return fromBigNumber(this, 18);
  };
  Logger.debug('totalFunds', JSON.stringify(totalFunds, null, 4));

  const totalFundsSummed = totalFunds.length ? totalFunds.reduce((a, b) => a + b) : 0;

  return {
    questCount: result.questEntities.length,
    totalFunds: totalFundsSummed,
  };
}

export async function fetchCreateQuestDeposit(walletAddress: string) {
  const questFactoryContract = getQuestFactoryContract(walletAddress);
  const res = await questFactoryContract.deposit();
  const token = await getTokenInfo(res.token);
  if (!token) {
    return null;
  }
  return toTokenAmountModel({
    ...token,
    amount: res.amount.toString(),
  });
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
  const ipfsHash = await pushObjectToIpfs(data.description ?? '');
  const questExpireTimeUtcSec = Math.round(data.expireTime!.getTime() / 1000); // Ms to UTC timestamp
  const tx = await getQuestFactoryContract(walletAddress)?.createQuest(
    data.title,
    ipfsHash, // Push description to IPFS and push hash to quest contract
    typeof data.rewardToken === 'string' ? data.expireTime : data.rewardToken!.token,
    questExpireTimeUtcSec,
    fallbackAddress,
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
  const tx = await questContract.recoverFundsAndDeposit({
    gasLimit: 1000000,
  });
  return handleTransaction(tx, onTx);
}

export async function getQuestRecoveryAddress(questAddress: string): Promise<string | null> {
  return getQuestContract(questAddress)?.fundsRecoveryAddress() ?? null;
}

export async function isQuestDepositReleased(questAddress: string): Promise<boolean> {
  try {
    const quest = getQuestContract(questAddress);
    return await quest.isDepositReleased();
  } catch (error) {
    Logger.debug('Failed to get quest deposit status', { questAddress, error });
    return false;
  }
}

// #endregion

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
  const tx = await contract.transfer(questAddress, toBigNumber(amount), {
    gasLimit: 1000000,
  });
  return handleTransaction(tx, onTx);
}

export async function approveTokenAmount(
  walletAddress: string,
  toAddress: string,
  tokenAmount: TokenModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  Logger.debug('Approving token amount...', { toAddress, tokenAmount });
  const erc20Contract = getERC20Contract(tokenAmount.token, walletAddress);
  if (!erc20Contract)
    throw new Error(
      `Failed when approving token amount : Erc20Contract is null \n${JSON.stringify({
        walletAddress,
        toAddress,
        tokenAmount,
      })}`,
    );

  const tx = await erc20Contract.approve(toAddress, tokenAmount.amount, {
    gasLimit: 1000000,
  });
  return handleTransaction(tx, onTx);
}

export function getAllowanceOf(walletAddress: string, token: TokenModel, spender: string) {
  const erc20Contract = getERC20Contract(token.token, walletAddress);
  if (!erc20Contract) throw new Error('Fetching allowance : Erc20Contract is null');
  return erc20Contract.allowance(walletAddress, spender);
}

export async function getBalanceOf(
  token: TokenModel | string,
  address: string,
  lockedFunds?: DepositModel,
  useCache?: boolean,
): Promise<TokenAmountModel | null> {
  try {
    let tokenInfo: TokenModel;
    if (typeof token === 'string') tokenInfo = (await getTokenInfo(token)) as TokenModel;
    else tokenInfo = token;
    if (tokenInfo) {
      const erc20Contract = getERC20Contract(tokenInfo);
      if (!erc20Contract) return null;
      let balance = useCache
        ? await cacheFetchBalance(tokenInfo, address, erc20Contract)
        : ((await erc20Contract.balanceOf(address)) as BigNumber);
      if (lockedFunds && compareCaseInsensitive(lockedFunds.token, tokenInfo.token)) {
        // Substract deposit from funds if both same token
        balance = balance.sub(BigNumber.from(lockedFunds.amount));
      }
      tokenInfo.amount = balance.toString();
      const price = await cacheFetchTokenPrice(tokenInfo);
      const parsedAmount = fromBigNumber(balance, tokenInfo.decimals);
      return {
        token: tokenInfo,
        parsedAmount,
        usdValue:
          price === undefined ? undefined : parsedAmount * fromBigNumber(price, tokenInfo.decimals),
      };
    }
  } catch (error: any) {
    Logger.exception(
      error,
      `Failed to fetch balance of ${(token as any).token ? (token as any).token : token}`,
    );
  }
  return null;
}

// #endregion

// #region GovernQueue

export async function scheduleQuestClaim(
  walletAddress: string,
  questData: QuestModel,
  claimData: ClaimModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const governQueueContract = getGovernQueueContract(walletAddress);
  if (!governQueueContract) return null;
  const container = await generateScheduleContainer(walletAddress, claimData, questData);
  Logger.debug('Scheduling quest claim...', { container });
  const tx = (await governQueueContract.schedule(container, {
    gasLimit: 500000,
  })) as ContractTransaction;
  return handleTransaction(tx, onTx);
}

export async function executeQuestClaim(
  walletAddress: string,
  claimData: ClaimModel,
  onTx?: onTxCallback,
): Promise<ethers.ContractReceipt | null> {
  const governQueueContract = getGovernQueueContract(walletAddress);
  if (!governQueueContract) return null;
  Logger.debug('Executing quest claim...', { container: claimData.container, claimData });
  const tx = await governQueueContract.execute(
    {
      config: claimData.container!.config,
      payload: claimData.container!.payload,
    },
    {
      gasLimit: 500000,
    },
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
  const tx = await governQueueContract.challenge(
    { config: container.config, payload: container.payload },
    challengeReasonIpfs,
    {
      gasLimit: 1000000,
    },
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
  const tx = await governQueueContract.resolve(container, dispute.id, {
    gasLimit: 1000000,
  });
  return handleTransaction(tx, onTx);
}

// #endregion

// #region Celeste

export async function fetchChallengeFee(): Promise<TokenAmountModel | null> {
  const celesteContract = await getCelesteDisputeManagerContract();
  if (!celesteContract) return null;
  const [feeToken, feeAmount] = await celesteContract.getDisputeFees();
  const token = await getTokenInfo(feeToken);
  if (!token) return null;
  return toTokenAmountModel({
    ...token,
    amount: feeAmount,
  });
}

export async function fetchChallengeDispute(
  challenge: ChallengeModel,
): Promise<DisputeModel | null> {
  const celesteDisputeManagerContract = await getCelesteDisputeManagerContract();
  if (!celesteDisputeManagerContract) {
    return null;
  }
  if (!challenge.disputeId) {
    throw new Error('Dispute does not exist yet, please try again later');
  }
  const dispute = await celesteDisputeManagerContract.getDispute(challenge.disputeId);
  return {
    id: challenge.disputeId,
    state: dispute.state,
  };
}

// #endregion
