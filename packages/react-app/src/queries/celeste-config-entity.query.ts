import gql from 'graphql-tag';

export const CelesteCourtConfigQuery = gql`
  query courtConfigs($first: Int, $skip: Int) {
    courtConfigs(first: $first, skip: $skip) {
      id
      feeToken {
        id
        name
        symbol
        decimals
      }
      settleFee
    }
  }
`;
