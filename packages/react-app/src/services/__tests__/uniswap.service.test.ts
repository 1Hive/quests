/* eslint-disable no-console */
import { fetchPairWithStables, fetchRoutePairWithStable } from '../uniswap.service';

jest.setTimeout(1000 * 30);

describe('Test Uniswap subgraph', () => {
  it(
    'should fetch a pairs with stables pre-defined',
    async () => {
      const res = await fetchPairWithStables('0x6e7c3BC98bee14302AA2A98B4c5C86b13eB4b6Cd'); // HNY
      // const res = await fetchPairWithStables('0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9'); // HNYT
      // const res = await fetchPairWithStables('0x01be23585060835e02b77ef475b0cc51aa1e0709'); // LINK
      console.dir(res);
      expect(res).toBeTruthy();
    },
    1000 * 30,
  );
});

xdescribe('Test Uniswap Router', () => {
  it(
    'should fetch a pairs with stables pre-defined with router',
    async () => {
      // const res = await fetchRoutePairWithStable('0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9'); // HNYT
      const res = await fetchRoutePairWithStable('0x01be23585060835e02b77ef475b0cc51aa1e0709'); // LINK
      console.dir(res);
      expect(res).toBeTruthy();
    },
    1000 * 30,
  );
});
