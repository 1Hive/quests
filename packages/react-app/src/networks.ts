import HardhatDeployement from './contracts/hardhat_contracts.json';
import { getCurrentChain } from './local-settings';
import { getNetworkId, isLocalOrUnknownNetwork } from './utils/web3.utils';
import { NetworkModel, StagingNetworkModel } from './models/network.model';
import { StableTokens } from './tokens';

export const networks = Object.freeze({
  goerli: {
    networkId: 'goerli',
    chainId: 5,
    name: 'Goerli tesnet',
    explorer: 'etherscan',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-goerli',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-goerli',
    tokenPairSubgraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    questFactoryAddress: HardhatDeployement[5].goerli.contracts.QuestFactory.address,
    celesteAddress: HardhatDeployement[5].goerli.contracts.Celeste.address,
    managerAddress: '0x7375Ed576952BD6CeD060EeE2Db763130eA13bA0',
    rpcUri: 'https://eth-goerli.g.alchemy.com/v2',
    rpcKeyEnvName: 'ALCHEMY_API_KEY',
    isTestNetwork: true,
    stableTokens: StableTokens.goerli,
    blackListedTokens: ['0xbc74d76abB7FA2311eab46A31273452aAFD98DB1'],
  },
  goerliStaging: {
    stagingOf: 'goerli',
    questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-goerli-staging',
    governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-goerli-staging',
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
    celesteAddress: '0x44E4fCFed14E1285c9e0F6eae77D5fDd0F196f85',
    managerAddress: '0x7375Ed576952BD6CeD060EeE2Db763130eA13bA0',
    rpcUri: 'https://rpc.gnosischain.com/',
    isTestNetwork: false,
    stableTokens: StableTokens.gnosis,
    blackListedTokens: [],
  } as NetworkModel,
  gnosisStaging: {
    //   stagingOf: 'gnosis',
    //   questsSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/quests-subgraph-staging',
    //   governSubgraph: 'https://api.thegraph.com/subgraphs/name/corantin/govern-1hive-gnosis-staging',
  } as StagingNetworkModel,
  local: {
    networkId: 'local',
    chainId: 1337,
    name: 'Localhost',
    questsSubgraph: 'https://localhost:8000/subgraphs/name/corantin/quests-subgraph',
    defaultEthNode: 'http://0.0.0.0:8545/',
    questFactoryAddress: HardhatDeployement[1337]?.localhost.contracts.QuestFactory.address,
    isTestNetwork: true,
    blackListedTokens: [],
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
