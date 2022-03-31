import { fetchPairWithStables } from '../uniswap.service';

jest.setTimeout(1000 * 30);

describe('Test Uniswap subgraph', () => {
  it(
    'should some pairs',
    async () => {
      //   const res = await fetchPairWithStables('0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9'); // HNYT
      const res = await fetchPairWithStables('0x01be23585060835e02b77ef475b0cc51aa1e0709'); // LINK
      console.dir(res);
      expect(res).toBeTruthy();
    },
    1000 * 30,
  );
});
