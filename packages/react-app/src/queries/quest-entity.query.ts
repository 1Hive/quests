import gql from 'graphql-tag';

export const QuestEntityQuery = gql`
  query questEntity(
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
      orderBy: questExpireTimeSec
      orderDirection: asc
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
