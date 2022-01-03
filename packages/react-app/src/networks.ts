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
    explorerBase: 'https://etherscan.io/tx/',
    defaultEthNode: 'https://eth.aragon.network/',
    subgraph: '',
    defaultToken: TOKENS.HoneyTest,
    nativeToken: TOKENS.Ether,
  },
  rinkeby: {
    chainId: 4,
    name: 'Rinkeby',
    type: 'rinkeby',
    explorerBase: 'https://rinkeby.etherscan.io/tx',
    defaultEthNode: 'https://rinkeby.eth.aragon.network/',
    questSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-rinkeby',
    celesteSubgraph: 'https://api.thegraph.com/subgraphs/name/1hive/celeste-rinkeby',
    celesteConfigAddress: '0x35e7433141d5f7f2eb7081186f5284dcdd2ccace',
    questFactoryAddress: HardhatDeployement[4].rinkeby.contracts.QuestFactory.address,
    governAddress: '0x0f37760f7bF292A3E1578583bDb8db9835E37229',
    governQueueAddress: '0x72c757c2F7302D15e81ddc5c9E4a724aeB09F567',
    celesteAddress: '0x949f75Ab8362B4e53967742dC93CC289eFb43f6D',
    defaultToken: TOKENS.HoneyTest,
    nativeToken: TOKENS.Ether,
  } as NetworkModel,
  xdai: {
    chainId: 100,
    name: 'xDai',
    type: 'xdai',
    explorerBase: 'https://etherscan.io/tx/',
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
    subgraph: 'https://localhost:8000/subgraphs/name/corantin/quests-subgraph',
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
