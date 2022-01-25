// rinkeby
const DEFAULT_CHAIN_ID = 4;

const ENV_VARS = {
  CHAIN_ID() {
    let chainId = NaN;
    if (process.env.REACT_APP_CHAIN_ID) chainId = +process.env.REACT_APP_CHAIN_ID;
    return Number.isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId;
  },
};

export default function env(name: string) {
  const envVar = ENV_VARS[name];
  if (!envVar) return process.env[`REACT_APP_${name}`];
  return typeof envVar === 'function' ? envVar() : envVar;
}
