// rinkeby
const DEFAULT_CHAIN_ID = 4;

const ENV_VARS = {
  CHAIN_ID() {
    let chainId = NaN;
    if (process.env.REACT_APP_CHAIN_IDs) chainId = parseInt(process.env.REACT_APP_CHAIN_ID!, 10);
    return Number.isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId;
  },
};

export default function env(name: string) {
  const envVar = ENV_VARS[name];
  return typeof envVar === 'function' ? envVar() : null;
}
