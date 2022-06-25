import request from 'graphql-request';
import gql from 'graphql-tag';
import { ENUM_QUEST_STATE, GQL_MAX_INT_MS } from 'src/constants';
import env from 'src/environment';
import { FilterModel } from 'src/models/filter.model';
import { getNetwork } from 'src/networks';
import { msToSec } from 'src/utils/date.utils';

const QuestEntityQuery = gql`
  query questEntity($ID: String) {
    questEntity(id: $ID, subgraphError: allow) {
      id
      questAddress
      questTitle
      questDescription
      questExpireTimeSec
      questDetailsRef
      questRewardTokenAddress
      creationTimestamp
      depositToken
      depositAmount
      questCreator
      questFundsRecoveryAddress
    }
  }
`;

const QuestEntitiesQuery = (payload: any) => gql`
  query questEntities(
    $first: Int
    $skip: Int
    $expireTimeLower: Int
    $expireTimeUpper: Int
    $address: String
    $title: String
    $description: String
    $blackList: [String]
    $whiteList: [String]
  ) {
    questEntities(
      first: $first
      skip: $skip
      where: {
        questExpireTimeSec_gte: $expireTimeLower
        questExpireTimeSec_lte: $expireTimeUpper
        questTitle_contains_nocase: $title
        questDescription_contains_nocase: $description
        ${payload.blackList !== undefined ? 'questAddress_not_in: $blackList' : ''}
        ${payload.whiteList !== undefined ? 'questAddress_in: $whiteList' : ''}
      }
      orderBy: creationTimestamp
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      questAddress
      questTitle
      questDescription
      questExpireTimeSec
      questDetailsRef
      questRewardTokenAddress
      creationTimestamp
      depositToken
      depositAmount
      questCreator
      questFundsRecoveryAddress
    }
  }
`;

const QuestRewardTokens = gql`
  query questEntities($first: Int) {
    questEntities(first: $first, orderBy: creationTimestamp, orderDirection: desc) {
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
      questRewardTokenAddress
      depositToken
      depositAmount
    }
  }
`;

export const fetchQuestEnity = (questAddress: string) => {
  const { questsSubgraph } = getNetwork();
  return request(questsSubgraph, QuestEntityQuery, {
    ID: questAddress.toLowerCase(), // Subgraph address are stored lowercase
  }).then((res) => res.questEntity);
};

export const fetchQuestEntities = async (
  currentIndex: number,
  count: number,
  filter: FilterModel,
) => {
  const { questsSubgraph, networkId } = getNetwork();
  let expireTimeLowerMs = 0;
  let expireTimeUpperMs = GQL_MAX_INT_MS;
  if (filter.status === ENUM_QUEST_STATE.Active) {
    expireTimeLowerMs = Math.max(filter.minExpireTime?.getTime() ?? 0, Date.now());
  } else if (filter.status === ENUM_QUEST_STATE.Expired) {
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
    title: filter.title,
    description: filter.description,
    blackList: blackList !== undefined ? blackList.toLowerCase().split(',') : undefined,
    whiteList: whiteList && whiteList !== '*' ? whiteList.toLowerCase().split(',') : undefined,
  };

  const res = await request(questsSubgraph, QuestEntitiesQuery(payload), payload);

  return res.questEntities;
};

export const fetchQuestRewardTokens = () => {
  const { questsSubgraph } = getNetwork();
  return request(questsSubgraph, QuestRewardTokens, { first: 100 }).then((res) =>
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
