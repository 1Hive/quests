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
    subgraph: 'https://thegraph.com/legacy-explorer/subgraph/sunguru98/quests',
    factory: '0x50f36Ded366cA239Dd3a00dABD04Ddc3739E2244', // TODO : Change each time there is a new deployement
    govern: '0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E',
  },
  xdai: {
    chainId: 100,
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    factory: '', // TODO : When questFactory will be on xDai
    govern: '', // TODO : When govern will be on xDai
  },
  local: {
    chainId: 1337,
    name: 'Local',
    type: 'private',
    defaultEthNode: 'http://0.0.0.0:8545/',
    govern: 0,
  },
};

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId);
}

export function getNetwork(chainId = getDefaultChain()) {
  return networks[getNetworkInternalName(chainId)];
}
