/* eslint-disable no-console */

// rinkeby
const DEFAULT_CHAIN_ID = 100;

const ENV_VARS = {
  CHAIN_ID() {
    let chainId = NaN;
    if (process.env.REACT_APP_CHAIN_ID) chainId = +process.env.REACT_APP_CHAIN_ID;
    return Number.isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId;
  },
};

export default function env(name: string): string | undefined {
  const envVar = ENV_VARS[name];
  let result;
  if (!envVar) result = process.env[`REACT_APP_${name}`];
  else {
    result = typeof envVar === 'function' ? envVar() : envVar;
  }
  if (result) {
    console.debug(`Using ${name}=${result}`);
  }
  return result;
}
