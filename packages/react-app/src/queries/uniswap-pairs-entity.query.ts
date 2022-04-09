import gql from 'graphql-tag';

export const UniswapPairsEntityQuery = gql`
  query pairs($tokenA: String, $tokenBArray: [String]) {
    pairs(where: { token0: $tokenA, token1_in: $tokenBArray }, subgraphError: allow) {
      id
      token0 {
        token: id
        symbol
        decimals
      }
      token0Price
      token1 {
        token: id
        symbol
        decimals
      }
      token1Price
      totalSupply
      reserve0
      reserve1
    }
  }
`;
