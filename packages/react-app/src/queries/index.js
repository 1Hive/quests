import gql from 'graphql-tag';

export const QuestEntity = gql`
  query questEntities($first: Int, $skip: Int, $minVersion: String) {
    questEntities(first: $first, skip: $skip, where: { questVersion_gte: $minVersion }) {
      id
      questAddress
      questMetadataHash
      questRewardTokenAddress
      questExpireTime
      questVersion
    }
  }
`;
