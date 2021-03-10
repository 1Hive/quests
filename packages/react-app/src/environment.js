// rinkeby
const DEFAULT_CHAIN_ID = 4

const ENV_VARS = {
  CHAIN_ID() {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
    return isNaN(chainId) ? DEFAULT_CHAIN_ID : chainId
  },
  AIRTABLE_KEY() {
    return process.env.REACT_APP_AIRTABLE_KEY
  },
}

export default function env(name) {
  const envVar = ENV_VARS[name]
  return typeof envVar === 'function' ? envVar() : null
}
