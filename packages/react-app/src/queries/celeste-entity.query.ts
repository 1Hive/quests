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
  query dispute($ID: Int) {
    dispute(id: $ID) {
      id
      state
      finalRuling
    }
  }
`;
