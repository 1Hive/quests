import { gql } from 'graphql-request';

export const QuestSearchQuery = gql`
  query questSearch($first: Int, $skip: Int, $search: String) {
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
