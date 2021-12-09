import gql from 'graphql-tag';

export const QuestSearchQuery = gql`
  query questSearch($first: Int, $skip: Int, $text: String) {
    QuestSearch(text: $text) {
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
