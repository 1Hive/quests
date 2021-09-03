import gql from 'graphql-tag';

export const QuestFactory = gql`
  query questFactories($first: Int, $skip: Int) {
    questFactories(first: $first, skip: $skip) {
      id
      questAddress
      questMetadata
    }
  }
`;
