import gql from 'graphql-tag';

export const CelesteCourtConfigEntitiesQuery = gql`
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

export const CelesteDisputeEntityQuery = gql`
  query dispute($ID: String) {
    dispute(id: $ID) {
      id
      ruledAt
      state
    }
  }
`;
