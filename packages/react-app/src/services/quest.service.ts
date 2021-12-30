/* eslint-disable no-unused-vars */
import { request } from 'graphql-request';
import { FilterModel } from 'src/models/filter.model';
import { QuestModel } from 'src/models/quest.model';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { QuestEntityQuery, QuestEntitiesQuery } from 'src/queries/quest-entity.query';
import { toAscii, toChecksumAddress, toHex } from 'web3-utils';
import {
  fakeContainerResult,
  GovernQueueEntityContainersQuery,
  GovernQueueEntityQuery,
} from 'src/queries/govern-queue-entity.query';
import { BigNumber, ethers } from 'ethers';
import { ConfigModel, ContainerModel, PayloadModel } from 'src/models/govern.model';
import { ClaimModel } from 'src/models/claim.model';
import { ChallengeModel } from 'src/models/challenge.model';
import { DEAULT_CLAIM_EXECUTION_DELAY, CLAIM_STATUS, GQL_MAX_INT, TOKENS } from '../constants';
import { Logger } from '../utils/logger';
import { fromBigNumber, toBigNumber } from '../utils/web3.utils';
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
        challengeDeposit: {
          amount: fromBigNumber(
            BigNumber.from(config.challengeDeposit.amount),
            defaultToken.decimals,
          ),
          token: nativeToken,
        },
        scheduleDeposit: {
          amount: fromBigNumber(
            BigNumber.from(config.scheduleDeposit.amount),
            defaultToken.decimals,
          ),
          token: nativeToken,
        },
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

  // const containers = result.governQueue.containers.map( // TODO : UNFAKE
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
        config: {
          challengeDeposit: {
            amount: x.config.challengeDeposit.amount,
          },
        },
      } as ContainerModel),
  );

  return containers;
}

async function getContainer(claimData: ClaimModel): Promise<ContainerModel> {
  const { govern, celeste } = getNetwork();

  const governQueueResult = await fetchGovernQueue();

  const ERC3000Config = {
    ...governQueueResult.config, // default config fetched from govern subgraph
    resolver: celeste, // Celeste
    executionDelay: DEAULT_CLAIM_EXECUTION_DELAY, // delay after which the claim can be executed by player
  } as ConfigModel;

  const currentBlock = await ethers.getDefaultProvider().getBlock('latest');

  // A bit more than the execution delay
  const executionTime =
    claimData.executionTime ?? currentBlock.timestamp + DEAULT_CLAIM_EXECUTION_DELAY + 60;

  const evidenceIpfsHash = await pushObjectToIpfs(claimData.evidence);
  const claimCall = encodeClaimAction(claimData, evidenceIpfsHash);

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

function decodeClaimAction(payload: PayloadModel) {
  const [evidenceIpfsHash, playerAddress, claimAmount] =
    getQuestContractInterface().decodeFunctionData('claim', payload.actions[0].data);
  return { evidenceIpfsHash, playerAddress, claimAmount };
}

function encodeClaimAction(claimData: ClaimModel, evidenceIpfsHash: string) {
  return getQuestContractInterface().encodeFunctionData('claim', [
    toHex(evidenceIpfsHash),
    claimData.playerAddress,
    claimData.claimedAmount.amount,
  ]);
}

// #endregion

// #region Public

export async function getMoreQuests(
  currentIndex: number,
  count: number,
  filter: FilterModel,
): Promise<QuestModel[]> {
  const { questSubgraph } = getNetwork();
  const queryResult = (
    await request(questSubgraph, QuestEntitiesQuery, {
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
  const { questSubgraph } = getNetwork();
  const queryResult = (
    await request(questSubgraph, QuestEntityQuery, {
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
  // eslint-disable-next-line no-unused-vars
  onTxx?: (hash: string) => void,
) {
  if (address) throw Error('Saving existing quest is not yet implemented');
  if (!questFactoryContract) throw Error('QuestFactoryContract parameter is required');
  const ipfsHash = await pushObjectToIpfs(data.description ?? '');

  const questExpireTimeUtcSec = Math.round(data.expireTimeMs! / 1000); // Ms to UTC timestamp
  const tx = await questFactoryContract.createQuest(
    data.title,
    ipfsHash, // Push description to IPFS and push hash to quest contract
    TOKENS.Honey.address,
    questExpireTimeUtcSec,
    fallbackAddress,
  );
  onTxx?.(tx.hash);
  Logger.info('Tx hash', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  Logger.info('Tx logs', receipt.logs);
  return receipt;
}

export async function fundQuest(
  contractERC20: any,
  questAddress: string,
  amount: TokenAmountModel,
  // eslint-disable-next-line no-unused-vars
  onTxx?: (hash: string) => void,
) {
  const tx = await contractERC20.transfer(questAddress, toBigNumber(amount));
  onTxx?.(tx.hash);
  Logger.info('TX HASH', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  Logger.info('Tx logs', receipt.logs);
  return receipt;
}

export async function scheduleQuestClaim(
  governQueueContract: any,
  claimData: ClaimModel,
  scheduleDeposit: TokenAmountModel,
  // eslint-disable-next-line no-unused-vars
  onTxx?: (hash: string) => void,
) {
  const container = await getContainer(claimData);
  Logger.debug('Scheduling quest claim ...', { container, claimData });
  const tx = await governQueueContract.schedule(container).send({
    value: scheduleDeposit.amount,
  });
  onTxx?.(tx.hash);
  Logger.info('TX HASH', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  Logger.info('Tx logs', receipt.logs);
  return receipt;
}

export async function executeQuestClaim(
  governQueueContract: any,
  claimData: ClaimModel,
  execTime?: number,
  // eslint-disable-next-line no-unused-vars
  onTxx?: (hash: string) => void,
) {
  const container = await getContainer(claimData);
  Logger.debug('Executing quest claim ...', { container, claimData });
  const tx = await governQueueContract.execute(container);
  onTxx?.(tx.hash);
  Logger.info('TX HASH', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  Logger.info('Tx logs', receipt.logs);
  return receipt;
}

export async function challengeQuestClaim(
  governQueueContract: any,
  challenge: ChallengeModel,
  // eslint-disable-next-line no-unused-vars
  onTxx?: (hash: string) => void,
) {
  const container = await getContainer(challenge.claim);
  Logger.debug('Challenging quest ...', { container, challenge });
  const challengeReasonIpfs = await pushObjectToIpfs(challenge.reason ?? '');
  const tx = await governQueueContract.challenge(container, challengeReasonIpfs);
  onTxx?.(tx.hash);
  Logger.info('TX HASH', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  Logger.info('Tx logs', receipt.logs);
  return receipt;
}

export async function getClaimExecutableTime(questAddress: string, playerAddress: string) {
  const governQueueContainers = await fetchGovernQueueContainers();
  const container: ContainerModel | undefined = governQueueContainers?.find(
    (x: ContainerModel) =>
      x.payload.submitter === playerAddress && x.payload.actions[0].to === questAddress,
  );

  return container && +container.payload.executionTime * 1000; // Convert Sec to MS
}

export async function getQuestClaims(quest: QuestModel): Promise<ClaimModel[]> {
  const { defaultToken, nativeToken } = getNetwork();
  const res = await fetchGovernQueueContainers();

  return Promise.all(
    res
      .filter(
        (x) =>
          x.payload.actions[0].to === quest.address &&
          (x.state === CLAIM_STATUS.Scheduled || x.state === CLAIM_STATUS.Challenged),
      )
      .map(async (x) => {
        const { evidenceIpfsHash, claimAmount, playerAddress } = decodeClaimAction(x.payload);
        const evidence = await getObjectFromIpfs(evidenceIpfsHash);

        return {
          claimedAmount: { token: quest.rewardToken, amount: +claimAmount },
          evidence,
          playerAddress,
          questAddress: quest.address,
          state: x.state,
          challengeDeposit: {
            amount: fromBigNumber(
              BigNumber.from(x.config.challengeDeposit.amount),
              defaultToken.decimals,
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
  return config.scheduleDeposit;
}

export function getTagSuggestions() {
  return []; // TODO : Restore after MVP questList.map((x) => x.tags).flat();
}

export async function reclaimUnusedFunds(questContract: any, onTx?: (hash: string) => void) {
  console.log('questContract', questContract);

  const tx = await questContract.recoverUnclaimedFunds();
  onTx?.(tx.hash);
  Logger.info('Tx hash', tx.hash);
  const receipt = (await tx.wait()) as ethers.ContractReceipt;
  Logger.info('Tx logs', receipt.logs);
  return receipt;
}

// #endregion
