import HardhatDeployement from './contracts/hardhat_contracts.json';
import { getDefaultChain } from './local-settings';
import { getNetworkType, isLocalOrUnknownNetwork } from './utils/web3.utils';
import { NetworkModel } from './models/network.model';
import { TOKENS } from './constants';

type StagingNetworkModel = Partial<NetworkModel> & {
  stagingOf: string;
};

export const networks = Object.freeze({
  rinkeby: {
    networkId: 'rinkeby',
    chainId: 4,
    name: 'Rinkeby',
    explorerBase: 'etherscan',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-rinkeby',
    uniswapSubgraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    questFactoryAddress: HardhatDeployement[4].rinkeby.contracts.QuestFactory.address,
    governQueueAddress: HardhatDeployement[4].rinkeby.contracts.GovernQueue.address,
    celesteAddress: '0xdd58ebed3c36460939285a92807f90e3d3a26789',
    httpProvider: 'https://rinkeby.infura.io/v3',
    isTestNetwork: true,
    stableTokens: [TOKENS.RinkebyDai, TOKENS.RinkebyTheter],
  },
  rinkebyStaging: {
    stagingOf: 'rinkeby',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph-staging',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-rinkeby-staging',
  } as StagingNetworkModel,
  gnosis: {
    networkId: 'gnosis',
    chainId: 100,
    name: 'gnosis',
    explorerBase: 'blockscout',
    questsSubgraph: 'TODO',
    uniswapSubgraph: 'TODO',
    questFactoryAddress: HardhatDeployement[100]?.xdai.contracts.QuestFactory.address,
    governQueueAddress: HardhatDeployement[100]?.xdai.contracts.GovernQueue.address,
    celesteAddress: 'TODO',
    httpProvider: 'https://xdai.poanetwork.dev',
    isTestNetwork: false,
    stableTokens: [TOKENS.Thether, TOKENS.UsdCoin],
  } as NetworkModel,
  gnosisStaging: {
    stagingOf: 'gnosis',
  } as StagingNetworkModel,
  local: {
    id: 'local',
    chainId: 1337,
    name: 'Localhost',
    subgraph: 'https://localhost:8000/subgraphs/name/corantin/quests-subgraph',
    defaultEthNode: 'http://0.0.0.0:8545/',
    questFactory: HardhatDeployement[1337]?.localhost.contracts.QuestFactory.address,
    govern: 0,
    isTestNetwork: true,
  } as unknown as NetworkModel,
} as { [key: string]: NetworkModel | StagingNetworkModel });

function getNetworkInternalName(chainId = getDefaultChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkType(chainId);
}

export function getNetwork(chainId = getDefaultChain()): NetworkModel {
  let network = networks[getNetworkInternalName(chainId)];
  if ('stagingOf' in network) {
    network = { ...networks[network.stagingOf], ...network } as NetworkModel;
  }
  return network;
}
