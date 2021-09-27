import gql from 'graphql-tag';

export const QuestEntity = gql`
  query questEntities($first: Int, $skip: Int) {
    questEntities(first: $first, skip: $skip) {
      id
      questAddress
      questMetadataHash
      questRewardTokenAddress
      questExpireTime
      questVersion
    }
  }
`;
