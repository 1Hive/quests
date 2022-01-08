import gql from 'graphql-tag';

export const QuestEntityQuery = gql`
  query questEntity($ID: String) {
    questEntity(id: $ID, subgraphError: allow) {
      id
      questAddress
      questTitle
      questDescription
      questExpireTimeSec
      questDetailsRef
      questRewardTokenAddress
    }
  }
`;

export const QuestEntitiesQuery = gql`
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
        questAddress_contains: $address
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
    }
  }
`;

export const QuestSearchQuery = gql`
  query questSearch($first: Int, $skip: Int, $text: String) {
    questSearch(first: $first, skip: $skip, text: $text) {
      id
      questAddress
      questTitle
      questDescription
      questExpireTimeSec
      questDetailsRef
      questRewardTokenAddress
    }
  }
`;
