import HardhatDeployement from './contracts/hardhat_contracts.json';
import { getDefaultChain } from './local-settings';
import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3.utils';
import { TOKENS } from './constants';
import { NetworkModel } from './models/network.model';

export const networks = Object.freeze({
  mainnet: {
    chainId: 1,
    name: 'Mainnet',
    type: 'mainnet',
    explorerBase: 'etherscan',
    defaultEthNode: 'https://eth.aragon.network/',
    subgraph: '',
    defaultToken: TOKENS.HoneyTest,
    nativeToken: TOKENS.Ether,
    stableToken: TOKENS.Thether,
    isTestNetwork: false,
  },
  rinkeby: {
    chainId: 4,
    name: 'Rinkeby',
    type: 'rinkeby',
    explorerBase: 'etherscan',
    // defaultEthNode: 'https://rinkeby.eth.aragon.network/',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph-staging', // TODO : Restore to https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-rinkeby',
    celesteSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/celest-1hive-rinkeby',
    uniswapSubgraph:
      'https://api.thegraph.com/subgraphs/name/luckywebdev/uniswap-v2-subgraph-rinkeby',
    questFactoryAddress: HardhatDeployement[4].rinkeby.contracts.QuestFactory.address,
    governAddress: '0xa0F5e6759d49063040eAB18c1B0E684C45a4B4cA',
    governQueueAddress: '0x19B918802eA9C71c500Ca481917F383f3992cDB0',
    celesteAddress: '0xdd58ebed3c36460939285a92807f90e3d3a26789',
    httpProvider: 'https://rinkeby.infura.io/v3',
    defaultToken: TOKENS.HoneyTest,
    nativeToken: TOKENS.Ether,
    isTestNetwork: true,
    defaultGazFees: {
      gasLimit: 11e5,
      gasPrice: 2e9,
    },
  } as NetworkModel,
  xdai: {
    chainId: 100,
    name: 'xDai',
    type: 'xdai',
    explorerBase: 'blockscout',
    defaultEthNode: 'https://xdai.poanetwork.dev/',
    questFactory: HardhatDeployement[100]?.xdai.contracts.QuestFactory.address,
    govern: '', // TODO : When govern will be on xDai
    httpProvider: 'https://xdai.poanetwork.dev',
    defaultToken: TOKENS.Honey,
    nativeToken: TOKENS.xDAI,
    stableToken: TOKENS.xDAI,
    isTestNetwork: false,
  },
  local: {
    chainId: 1337,
    name: 'Localhost',
    type: 'private',
    subgraph: 'https://localhost:8000/subgraphs/name/corantin/quests-subgraph',
    defaultEthNode: 'http://0.0.0.0:8545/',
    questFactory: HardhatDeployement[1337]?.localhost.contracts.QuestFactory.address,
    govern: 0,
    isTestNetwork: true,
  },
});

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId);
}

export function getNetwork(chainId = getDefaultChain()): NetworkModel {
  return networks[getNetworkInternalName(chainId)];
}
