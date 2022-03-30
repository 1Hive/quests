import { BigNumber, Contract, ethers } from 'ethers';
import { TokenModel } from 'src/models/token.model';
import { getDefaultProvider } from 'src/utils/web3.utils';
import { toChecksumAddress, toNumber } from 'web3-utils';
import { ContractInstanceError } from 'src/models/contract-error';
import { Logger, LoggerOnce } from 'src/utils/logger';
import { TokenAmountModel } from 'src/models/token-amount.model';
import ERC20 from '../contracts/ERC20.json';
import GovernQueue from '../contracts/GovernQueue.json';
import contractsJson from '../contracts/hardhat_contracts.json';
import { getNetwork } from '../networks';
import Celeste from '../contracts/Celeste.json';
import PriceOracle from '../contracts/PriceOracle.json';

let contracts: any;

// walletAddress is not optional
export function getSigner(ethersProvider: any, walletAddress: any) {
  ethersProvider.getSigner(walletAddress);
  return ethersProvider.getSigner(walletAddress).connectUnchecked();
}

// walletAddress is optional
export function getProviderOrSigner(ethersProvider: any, walletAddress?: string) {
  return walletAddress ? getSigner(ethersProvider, walletAddress) : ethersProvider;
}

function getContractsJson(network?: any) {
  network = network ?? getNetwork();
  return {
    ...contractsJson[network.chainId][network.name.toLowerCase()].contracts,
    GovernQueue,
    ERC20,
    Celeste,
    PriceOracle,
  };
}

function getContract(
  contractName: string,
  questAddressOverride?: string,
  walletAddress?: string,
): Contract | null {
  try {
    const network = getNetwork();
    if (!contracts) contracts = getContractsJson(network);
    const askedContract = contracts[contractName];
    const contractAddress = questAddressOverride ?? askedContract.address;
    const contractAbi = askedContract.abi ?? askedContract;
    const provider = getDefaultProvider();

    if (!contractAddress) throw new Error(`${contractName} address was not defined`);
    if (!contractAbi) throw new Error(`${contractName} ABI was not defined`);

    // Check if wallet chain is same as app
    const { chainId, name } = getNetwork();
    if (toNumber(provider?.provider?.chainId) !== chainId) {
      LoggerOnce.error(`Wallet not connected to ${name}. Wait for wallet to connect`);
      return null;
    }
    return new Contract(contractAddress, contractAbi, getProviderOrSigner(provider, walletAddress));
  } catch (error) {
    throw new ContractInstanceError(
      contractName,
      `Failed to instanciate contract <${contractName}>`,
      error,
    );
  }
}

// #region Public

export function getQuestFactoryContract(walletAddress: string) {
  return getContract('QuestFactory', undefined, walletAddress);
}

export function getGovernQueueContract(walletAddress: string): Contract | null {
  const { governQueueAddress } = getNetwork();
  return getContract('GovernQueue', governQueueAddress, walletAddress);
}

export function getERC20Contract(
  token: TokenModel | string,
  walletAddress?: string,
): Contract | null {
  const tokenAddress = typeof token === 'string' ? token : token?.token;
  return getContract('ERC20', tokenAddress, walletAddress);
}

export async function getTokenInfo(tokenAddress: string) {
  try {
    const tokenContract = getContract('ERC20', tokenAddress);

    if (tokenContract) {
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      const name = await tokenContract.name();
      return {
        symbol,
        decimals,
        name,
        amount: BigNumber.from(0).toString(),
        token: toChecksumAddress(tokenAddress),
      } as TokenModel;
    }
  } catch (error) {
    Logger.exception(error);
  }
  return tokenAddress;
}

export function getQuestContract(questAddress: string, walletAddress?: string): Contract | null {
  return getContract('Quest', questAddress, walletAddress);
}

export function getCelesteContract() {
  const { celesteAddress } = getNetwork();
  return getContract('Celeste', celesteAddress);
}

export function getQuestContractInterface() {
  return new ethers.utils.Interface(getContractsJson().Quest.abi);
}

export async function getPriceOfToken(
  tokenAddressPrice: string,
  tokenAddressBase: string,
  walletAddress: string,
): Promise<TokenAmountModel> {
  // const tokenA = '0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9'.toLowerCase(); //fallback address on rinkeby
  // const tokenB = '0x531eab8bB6A2359Fe52CA5d308D85776549a0af9'.toLowerCase(); //fallback address on rinkeby
  const tokenA = tokenAddressPrice.toLowerCase();
  const tokenB = tokenAddressBase.toLowerCase();

  const defaultRet = {
    parsedAmount: -1,
    token: { token: tokenA, decimals: 18, symbol: 'USDT', name: 'USDT' },
  } as TokenAmountModel;
  try {
    const { priceOracleAddress } = getNetwork();

    console.log(`PriceOracle contract addresss is ${priceOracleAddress}`);
    // const tokenContract = new Contract(priceOracleAddress, abi, getSigner(provider, walletAddress));
    const tokenContract = getContract('PriceOracle', priceOracleAddress, walletAddress);

    if (tokenContract) {
      const amountIn = BigNumber.from('1000000000000000000');
      const amountOut = await tokenContract.consult(tokenA, amountIn, tokenB);
      const parsedAmount = ethers.utils.formatEther(amountOut);
      console.log(
        `- Oracle Consult ${tokenA} ${ethers.utils.formatEther(amountIn)}-${parsedAmount}`,
      );
      return {
        parsedAmount: amountOut,
        token: { token: tokenA, decimals: 18, symbol: 'USDT', name: 'USDT' },
      } as TokenAmountModel;
    }
  } catch (error) {
    console.log(error);

    Logger.exception(error);
  }
  return defaultRet;
}

// #endregion
