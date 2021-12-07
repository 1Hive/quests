import gql from 'graphql-tag';

export const DebugQuery = gql`
  {
    indexingStatuses(subgraphs: ["QmaoR2qU9N7oP4ffLmrj1EJwCoRkvkuRiiPQ71s29Kq6yM"]) {
      node
      synced
      health
      fatalError {
        message
        block {
          number
          hash
        }
        handler
      }
      nonFatalErrors {
        message
        block {
          number
          hash
        }
        handler
      }
      chains {
        network
        chainHeadBlock {
          number
        }
        earliestBlock {
          number
        }
        latestBlock {
          number
        }
        lastHealthyBlock {
          number
        }
      }
      entityCount
    }
  }
`;
