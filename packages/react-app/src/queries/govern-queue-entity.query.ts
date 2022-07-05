import gql from 'graphql-tag';

export const GovernQueueEntityQuery = gql`
  query governQueue($ID: String) {
    governQueue(id: $ID) {
      nonce
      config {
        resolver
        rules
        executionDelay
        scheduleDeposit {
          amount
          token
          decimals
          name
          symbol
        }
        challengeDeposit {
          amount
          token
          decimals
          name
          symbol
        }
        maxCalldataSize
      }
    }
  }
`;

export const GovernQueueEntityContainersQuery = gql`
  query governQueue($ID: String) {
    governQueue(id: $ID) {
      id
      containers {
        id
        state
        payload {
          id
          nonce
          proof
          submitter
          executionTime
          executor {
            id
          }
          actions {
            to
            value
            data
          }
          allowFailuresMap
        }
        config {
          id
          executionDelay
          scheduleDeposit {
            id
            token
            amount
            decimals
            name
            symbol
          }
          challengeDeposit {
            id
            token
            amount
            decimals
            name
            symbol
          }
          resolver
          rules
          maxCalldataSize
        }
      }
    }
  }
`;

export const GovernQueueEntityClaimsLightQuery = gql`
  query governQueue($ID: String) {
    governQueue(id: $ID) {
      containers {
        payload {
          actions {
            to
          }
        }
        state
      }
    }
  }
`;

export const GovernQueueChallengesQuery = gql`
  query containerEventChallenges($containerId: String) {
    containerEventChallenges(
      where: { container_starts_with: $containerId }
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      disputeId
      reason
      createdAt
      resolver
      challenger
      collateral {
        id
        token
        amount
        decimals
        name
        symbol
      }
      container {
        queue {
          id
        }
      }
    }
  }
`;
