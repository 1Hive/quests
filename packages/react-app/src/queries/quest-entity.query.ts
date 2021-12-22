import gql from 'graphql-tag';

export const QuestEntityQuery = gql`
  query questEntity($ID: String) {
    questEntity(id: $ID, subgraphError: allow) {
      id
      questAddress
      questTitle
      questDescription
      questExpireTimeSec
      questDetailsRef
      questRewardTokenAddress
    }
  }
`;
