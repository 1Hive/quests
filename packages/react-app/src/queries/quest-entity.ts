import gql from 'graphql-tag';

export const QuestEntity = gql`
  query questEntities($first: Int, $skip: Int, $minVersion: String) {
    questEntities(first: $first, skip: $skip, where: { questVersion_gte: $minVersion }) {
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
