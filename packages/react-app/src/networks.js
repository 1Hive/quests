import { getDefaultChain } from './local-settings';
import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3-utils';

const networks = {
  mainnet: {
    chainId: 1,
    name: 'Mainnet',
    type: 'mainnet',
    defaultEthNode: 'https://eth.aragon.network/',
    subgraph: '',
  },
  rinkeby: {
    chainId: 4,
    name: 'Rinkeby',
    type: 'rinkeby',
    defaultEthNode: 'https://rinkeby.eth.aragon.network/',
    subgraph: 'https://api.thegraph.com/subgraphs/name/1hive/vesting-party-rinkeby', // TODO : Change to honey
    factory: '0x4D85D70E1036bc05342b25e6a3aD520790Ec6680',
  },
  xdai: {
    chainId: 100,
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
  },
  local: {
    chainId: 1337,
    name: 'Local',
    type: 'private',
    defaultEthNode: 'http://0.0.0.0:8545/',
  },
};

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId);
}

export function getNetwork(chainId = getDefaultChain()) {
  return networks[getNetworkInternalName(chainId)];
}
