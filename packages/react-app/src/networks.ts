import HardhatDeployement from './contracts/hardhat_contracts.json';
import { getCurrentChain } from './local-settings';
import { getNetworkId, isLocalOrUnknownNetwork } from './utils/web3.utils';
import { NetworkModel } from './models/network.model';
import { StableTokens, TOKENS } from './tokens';

type StagingNetworkModel = Partial<NetworkModel> & {
  stagingOf: string;
};

export const networks = Object.freeze({
  rinkeby: {
    networkId: 'rinkeby',
    chainId: 4,
    name: 'Rinkeby',
    explorer: 'etherscan',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-rinkeby',
    tokenPairSubgraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    questFactoryAddress: HardhatDeployement[4].rinkeby.contracts.QuestFactory.address,
    governQueueAddress: HardhatDeployement[4].rinkeby.contracts.GovernQueue.address,
    celesteAddress: HardhatDeployement[4].rinkeby.contracts.Celeste.address,
    rpcUri: 'https://rinkeby.infura.io/v3',
    rpcKeyEnvName: 'INFURA_API_KEY',
    isTestNetwork: true,
    stableTokens: StableTokens.rinkeby,
    nativeToken: TOKENS.rinkeby.native,
  },
  rinkebyStaging: {
    stagingOf: 'rinkeby',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph-staging',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-rinkeby-staging',
  } as StagingNetworkModel,
  gnosis: {
    networkId: 'xdai',
    chainId: 100,
    name: 'Gnosis',
    explorer: 'blockscout',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph-gnosis',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-xdai',
    tokenPairSubgraph: 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-xdai',
    questFactoryAddress: HardhatDeployement[100]?.xdai.contracts.QuestFactory.address,
    governQueueAddress: HardhatDeployement[100]?.xdai.contracts.GovernQueue.address,
    celesteAddress: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
    rpcUri: 'https://rpc.gnosischain.com/',
    isTestNetwork: false,
    stableTokens: StableTokens.gnosis,
    nativeToken: TOKENS.xdai.native,
  } as NetworkModel,
  gnosisStaging: {
    stagingOf: 'gnosis',
  } as StagingNetworkModel,
  local: {
    networkId: 'local',
    chainId: 1337,
    name: 'Localhost',
    questsSubgraph: 'https://localhost:8000/subgraphs/name/corantin/quests-subgraph',
    defaultEthNode: 'http://0.0.0.0:8545/',
    questFactoryAddress: HardhatDeployement[1337]?.localhost.contracts.QuestFactory.address,
    isTestNetwork: true,
  } as unknown as NetworkModel,
} as { [key: string]: NetworkModel | StagingNetworkModel });

function getNetworkInternalName(chainId = getCurrentChain()) {
  return isLocalOrUnknownNetwork(chainId) ? 'local' : getNetworkId(chainId);
}

export function getNetwork(chainId = getCurrentChain()): NetworkModel {
  let network = networks[getNetworkInternalName(chainId)];
  if ('stagingOf' in network) {
    network = { ...networks[network.stagingOf], ...network } as NetworkModel;
  }
  return network;
}
