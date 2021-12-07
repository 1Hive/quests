import HardhatDeployement from './contracts/hardhat_contracts.json';
import { getDefaultChain } from './local-settings';
import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3.utils';

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
    subgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph',
    questFactory: HardhatDeployement[4].rinkeby.contracts.QuestFactory.address,
    govern: '0x1EF2B45F8707E981cdf6859C22Dc1390cCc01697',
    governQueue: '0x1EF2B45F8707E981cdf6859C22Dc1390cCc01697',
  },
  xdai: {
    chainId: 100,
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    // questFactory: HardhatDeployement[100].xdai.contracts.QuestFactory.address,
    govern: '', // TODO : When govern will be on xDai
  },
  local: {
    chainId: 1337,
    name: 'Local',
    type: 'private',
    defaultEthNode: 'http://0.0.0.0:8545/',
    // questFactory: HardhatDeployement[1337].localhost.contracts.QuestFactory.address,
    govern: 0,
  },
};

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId);
}

export function getNetwork(chainId = getDefaultChain()) {
  return networks[getNetworkInternalName(chainId)];
}
