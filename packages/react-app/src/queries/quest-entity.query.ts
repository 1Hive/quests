import gql from 'graphql-tag';

export const QuestEntityQuery = gql`
  query questEntity(
    $first: Int
    $skip: Int
    $search: String
    $minVersion: String
    $tags: [String]
    $expireTimeLower: Int
    $expireTimeUpper: Int
  ) {
    questEntities(
      first: $first
      skip: $skip
      where: {
        questVersion_gte: $minVersion
        questMetaTags_contains: $tags
        questExpireTimeSec_gte: $expireTimeLower
        questExpireTimeSec_lte: $expireTimeUpper
      }
    ) {
      id
      questAddress
      questRewardTokenAddress
      questExpireTimeSec
      questVersion
      questMetaIpfsHash
      questMetaTitle
      questMetaDescription
      questMetaCollateralPercentage
      questMetaTags
    }
  }
`;
