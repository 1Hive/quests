import gql from 'graphql-tag';

export const QuestEntity = gql`
  query questSearch($first: Int, $skip: Int, $search: String, $minVersion: String) {
    questSearch(first: $first, skip: $skip, text: $search) {
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
