/* eslint-disable no-console */
import { BigNumber } from 'ethers';
import { fromBigNumber } from '../web3.utils';

describe('Test fromBigNumber', () => {
  it(
    'should add 1380000000000000000000 with 10007000000000000000000 and return 11387',
    async () => {
      const res = BigNumber.from('1380000000000000000000').add(
        BigNumber.from('10007000000000000000000'),
      );
      console.log(res);
      const expected = fromBigNumber(res, undefined);

      expect(res).toBeTruthy();
      expect(expected).toBe(11387);
    },
    1000 * 30,
  );
});
