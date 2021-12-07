import gql from 'graphql-tag';

export const QuestEntityQuery = gql`
  query questEntity($first: Int, $skip: Int, $expireTimeLower: Int, $expireTimeUpper: Int) {
    questEntities(
      first: $first
      skip: $skip
      where: { questExpireTimeSec_gte: $expireTimeLower, questExpireTimeSec_lte: $expireTimeUpper }
      orderBy: questExpireTimeSec
      orderDirection: asc
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
