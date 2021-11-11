import gql from 'graphql-tag';

export const QuestEntity = gql`
  query questEntity(
    $first: Int
    $skip: Int
    $search: String
    $minVersion: String
    $tags: [String]
  ) {
    questEntities(
      first: $first
      skip: $skip
      where: { questVersion_gte: $minVersion, questMetaTags_contains: $tags }
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
