import request from 'graphql-request';
import gql from 'graphql-tag';
import { GQL_MAX_INT_MS } from 'src/constants';
import { QuestPlayStatus } from 'src/enums/quest-play-status.enum';
import { QuestStatus } from 'src/enums/quest-status.enum';
import env from 'src/environment';
import { FilterModel } from 'src/models/filter.model';
import { getNetwork } from 'src/networks';
import { msToSec } from 'src/utils/date.utils';

const QuestEntityQuery = gql`
  query questEntity($ID: String) {
    questEntity(id: $ID, subgraphError: allow) {
      id
      version
      questAddress
      questTitle
      questExpireTimeSec
      questMetadata {
        id
        questDescription
        questCommunicationLink
      }
      questRewardTokenAddress
      creationTimestamp
      questCreateDepositToken
      questCreateDepositAmount
      questPlayDepositToken
      questPlayDepositAmount
      questCreator
      questFundsRecoveryAddress
      questMaxPlayers
      questPlayers
      questIsWhiteListed
    }
  }
`;

const QuestEntitiesQuery = (payload: any) => gql`
  query ${payload.search ? 'questSearch' : 'questEntities'}(
    $first: Int
    $skip: Int
    $expireTimeLower: Int
    $expireTimeUpper: Int
    ${
      payload.search
        ? `
      $search: String
      `
        : `
      $title: String
      $description: String
    `
    }
    $walletAddress: String
    $blackList: [String]
    $whiteList: [String]
  ) {
    ${payload.search ? 'questSearch' : 'questEntities'} (
      first: $first
      skip: $skip,
      ${
        payload.search
          ? `
        text: $search
      `
          : ''
      }
      where: {
        questExpireTimeSec_gte: $expireTimeLower
        questExpireTimeSec_lte: $expireTimeUpper
        ${
          payload.walletAddress !== undefined && payload.playStatus === QuestPlayStatus.Played
            ? 'questPlayers_contains:[$walletAddress]'
            : ''
        }
        ${payload.playStatus === QuestPlayStatus.Unplayed ? 'questPlayers_not:null' : ''}
        ${payload.blackList !== undefined ? 'questAddress_not_in: $blackList' : ''}
        ${payload.whiteList !== undefined ? 'questAddress_in: $whiteList' : ''}
      }
      ${
        payload.search
          ? ''
          : `
      orderBy: creationTimestamp
      orderDirection: desc
      `
      }
      subgraphError: allow
    ) {
      id
      version
      questAddress
      questTitle
      questExpireTimeSec
      questMetadata {
        id
        questDescription
        questCommunicationLink
      }
      questRewardTokenAddress
      creationTimestamp
      questCreateDepositToken
      questCreateDepositAmount
      questPlayDepositToken
      questPlayDepositAmount
      questCreator
      questFundsRecoveryAddress
      questMaxPlayers
      questPlayers
      questIsWhiteListed
    }
  }
`;

const QuestRewardTokens = (payload: any) => gql`
  query questEntities($first: Int, $blackList: [String], $whiteList: [String]) {
    questEntities(first: $first, orderBy: creationTimestamp, orderDirection: desc, where: {
        ${payload.blackList !== undefined ? 'questAddress_not_in: $blackList' : ''}
        ${payload.whiteList !== undefined ? 'questAddress_in: $whiteList' : ''}
      }
      orderBy: creationTimestamp
      orderDirection: desc
      subgraphError: allow
    ) {
      questRewardTokenAddress
    }
  }
`;

const QuestEntitiesLight = (payload: any) => gql`
  query questEntities(
    $expireTimeLower: Int
    $blackList: [String]
    $whiteList: [String]) {
    questEntities(where: {
      questExpireTimeSec_gt: $expireTimeLower
      ${payload.blackList !== undefined ? 'questAddress_not_in: $blackList' : ''}
      ${payload.whiteList !== undefined ? 'questAddress_in: $whiteList' : ''}
     }) {
      id
      version
      questAddress
      questRewardTokenAddress
      questCreateDepositToken
      questCreateDepositAmount
      questPlayDepositToken
      questPlayDepositAmount
      questMaxPlayers
      questIsWhiteListed
    }
  }
`;

export const fetchQuestEntity = async (questAddress: string) => {
  const { questsSubgraph } = getNetwork();
  const res = await request(questsSubgraph, QuestEntityQuery, {
    ID: questAddress.toLowerCase(), // Subgraph address are stored lowercase
  });
  return res.questEntity;
};

export const fetchQuestEntities = async (
  currentIndex: number,
  count: number,
  filter: FilterModel,
  walletAddress: string,
) => {
  const { questsSubgraph, networkId } = getNetwork();
  let expireTimeLowerMs = 0;
  let expireTimeUpperMs = GQL_MAX_INT_MS;
  const { playStatus } = filter;

  if (filter.status === QuestStatus.Active) {
    expireTimeLowerMs = Math.max(filter.minExpireTime?.getTime() ?? 0, Date.now());
  } else if (filter.status === QuestStatus.Expired) {
    expireTimeLowerMs = Math.min(filter.minExpireTime?.getTime() ?? 0, Date.now());
    expireTimeUpperMs = Date.now();
  } else {
    expireTimeLowerMs = filter.minExpireTime?.getTime() ?? 0;
  }

  const whiteList = env(`${networkId.toUpperCase()}_WHITE_LIST`);
  let blackList = env(`${networkId.toUpperCase()}_BLACK_LIST`);
  if (blackList === '*') {
    return [];
  }
  if (blackList === '') {
    blackList = '*';
  }

  const payload = {
    skip: currentIndex,
    first: count,
    expireTimeLower: Math.round(expireTimeLowerMs / 1000),
    expireTimeUpper: Math.round(expireTimeUpperMs / 1000),
    walletAddress: walletAddress?.toLowerCase(),
    playStatus,
    search: filter.search
      ? filter.search
          .split(/[&|]/gm)
          .map((segment) => `'${segment}'`)
          .join('')
      : undefined,
    blackList: blackList !== undefined ? blackList.toLowerCase().split(',') : undefined,
    whiteList: whiteList && whiteList !== '*' ? whiteList.toLowerCase().split(',') : undefined,
  };
  const res = await request(questsSubgraph, QuestEntitiesQuery(payload), payload);

  return res.questEntities ?? res.questSearch;
};

export const fetchQuestRewardTokens = () => {
  const { questsSubgraph, networkId } = getNetwork();
  const whiteList = env(`${networkId.toUpperCase()}_WHITE_LIST`);
  let blackList = env(`${networkId.toUpperCase()}_BLACK_LIST`);
  if (blackList === '*') {
    return [];
  }
  if (blackList === '') {
    blackList = '*';
  }
  const payload = {
    first: 100,
    blackList: blackList !== undefined ? blackList.toLowerCase().split(',') : undefined,
    whiteList: whiteList && whiteList !== '*' ? whiteList.toLowerCase().split(',') : undefined,
  };
  return request(questsSubgraph, QuestRewardTokens(payload), payload).then((res) =>
    res.questEntities.map((quest: any) => quest.questRewardTokenAddress),
  );
};

export const fetchActiveQuestEntitiesLight = () => {
  const { questsSubgraph, networkId } = getNetwork();
  const whiteList = env(`${networkId.toUpperCase()}_WHITE_LIST`);
  let blackList = env(`${networkId.toUpperCase()}_BLACK_LIST`);
  if (blackList === '*') {
    return [];
  }
  if (blackList === '') {
    blackList = '*';
  }
  const payload = {
    expireTimeLower: msToSec(Date.now()),
    blackList: blackList !== undefined ? blackList.toLowerCase().split(',') : undefined,
    whiteList: whiteList && whiteList !== '*' ? whiteList.toLowerCase().split(',') : undefined,
  };
  return request(questsSubgraph, QuestEntitiesLight(payload), payload);
};
