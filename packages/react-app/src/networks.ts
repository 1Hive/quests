import HardhatDeployement from './contracts/hardhat_contracts.json';
import { getDefaultChain } from './local-settings';
import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3.utils';
import { TOKENS } from './constants';
import { NetworkModel } from './models/network.model';

const networks = {
  mainnet: {
    chainId: 1,
    name: 'Mainnet',
    type: 'mainnet',
    defaultEthNode: 'https://eth.aragon.network/',
    subgraph: '',
    defaultToken: TOKENS.HoneyTest,
    nativeToken: TOKENS.Ether,
  },
  rinkeby: {
    chainId: 4,
    name: 'Rinkeby',
    type: 'rinkeby',
    defaultEthNode: 'https://rinkeby.eth.aragon.network/',
    questSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby',
    questFactory: HardhatDeployement[4].rinkeby.contracts.QuestFactory.address,
    govern: '0x0f37760f7bF292A3E1578583bDb8db9835E37229',
    governQueue: '0x034464e101eb7a0e8daa4cca220f40696ace0053', // TODO:Restore real govern queue '0x1EF2B45F8707E981cdf6859C22Dc1390cCc01697',
    celeste: '0x949f75Ab8362B4e53967742dC93CC289eFb43f6D',
    defaultToken: TOKENS.HoneyTest,
    nativeToken: TOKENS.Ether,
  } as NetworkModel,
  xdai: {
    chainId: 100,
    name: 'xDai',
    type: 'xdai',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    questFactory: HardhatDeployement[100]?.xdai.contracts.QuestFactory.address,
    govern: '', // TODO : When govern will be on xDai
    defaultToken: TOKENS.Honey,
    nativeToken: TOKENS.xDAI,
  },
  local: {
    chainId: 1337,
    name: 'Localhost',
    type: 'private',
    subgraph: 'http://localhost:8000/subgraphs/name/corantin/quests-subgraph',
    defaultEthNode: 'http://0.0.0.0:8545/',
    questFactory: HardhatDeployement[1337].localhost.contracts.QuestFactory.address,
    govern: 0,
  },
};

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId);
}

export function getNetwork(chainId = getDefaultChain()): NetworkModel {
  return networks[getNetworkInternalName(chainId)];
}
