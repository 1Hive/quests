import request from 'graphql-request';
import gql from 'graphql-tag';
import { ENUM_QUEST_STATE, GQL_MAX_INT_MS } from 'src/constants';
import { FilterModel } from 'src/models/filter.model';
import { getNetwork } from 'src/networks';
import { msToSec } from 'src/utils/date.utils';

const { questsSubgraph } = getNetwork();

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

const QuestEntitiesQuery = gql`
  query questEntities(
    $first: Int
    $skip: Int
    $expireTimeLower: Int
    $expireTimeUpper: Int
    $address: String
    $title: String
    $description: String
  ) {
    questEntities(
      first: $first
      skip: $skip
      where: {
        questExpireTimeSec_gte: $expireTimeLower
        questExpireTimeSec_lte: $expireTimeUpper
        questTitle_contains: $title
        questDescription_contains: $description
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

const LastDepositEntityQuery = gql`
  query depositEntities {
    depositEntities(first: 1, orderBy: timestamp) {
      id
      timestamp
      depositToken
      depositAmount
    }
  }
`;

// TODO : Uncoment when subgraph have support for combining where and full text query
// const QuestSearchQuery = gql`
//   query questSearch($first: Int, $skip: Int, $text: String) {
//     questSearch(first: $first, skip: $skip, text: $text) {
//       id
//       questAddress
//       questTitle
//       questDescription
//       questExpireTimeSec
//       questDetailsRef
//       questRewardTokenAddress
//       creationTimestamp
//     }
//   }
// `;

const QuestRewardTokens = gql`
  query questEntities($first: Int) {
    questEntities(first: $first, orderBy: creationTimestamp, orderDirection: desc) {
      questRewardTokenAddress
    }
  }
`;

const QuestEntitiesLight = gql`
  query questEntities($expireTimeLower: Int) {
    questEntities(where: { questExpireTimeSec_gt: $expireTimeLower }) {
      id
      questRewardTokenAddress
      depositToken
      depositAmount
    }
  }
`;

export const fetchQuestEnity = (questAddress: string) =>
  request(questsSubgraph, QuestEntityQuery, {
    ID: questAddress.toLowerCase(), // Subgraph address are stored lowercase
  }).then((res) => res.questEntity);

export const fetchQuestEntities = async (
  currentIndex: number,
  count: number,
  filter: FilterModel,
) => {
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
  const res = await request(questsSubgraph, QuestEntitiesQuery, {
    skip: currentIndex,
    first: count,
    expireTimeLower: Math.round(expireTimeLowerMs / 1000),
    expireTimeUpper: Math.round(expireTimeUpperMs / 1000),
    title: filter.title,
    description: filter.description,
  });
  return res.questEntities;
};

export const fetchQuestRewardTokens = () =>
  request(questsSubgraph, QuestRewardTokens, { first: 100 }).then((res) =>
    res.questEntities.map((quest: any) => quest.questRewardTokenAddress),
  );

export const fetchActiveQuestEntitiesLight = () =>
  request(questsSubgraph, QuestEntitiesLight, {
    expireTimeLower: msToSec(Date.now()),
  });

export const fetchLastDepositEntity = () => request(questsSubgraph, LastDepositEntityQuery, {});
