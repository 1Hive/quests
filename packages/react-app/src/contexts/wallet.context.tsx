import { providers as EthersProviders } from 'ethers';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { setCurrentChain } from 'src/local-settings';
import { getNetwork } from 'src/networks';
import Web3 from 'web3';
import { Logger } from 'src/utils/logger';
import { getDefaultProvider, getExplorerUrl, getUseWalletConnectors } from '../utils/web3.utils';
import { EXPECTED_CHAIN_ID } from '../constants';

export type WalletContextModel = {
  walletConnected: boolean;
  walletAddress: string;
  deactivateWallet: Function;
  activateWallet: Function;
  activatedId: string;
  activatingId: string;
  isWrongNetwork: boolean;
  changeNetwork: (_chainId?: number) => void;
};

const WalletAugmentedContext = React.createContext<WalletContextModel | undefined>(undefined);

function useWalletAugmented() {
  return useContext<WalletContextModel | undefined>(WalletAugmentedContext)!;
}

type Props = {
  children: React.ReactNode;
};

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }: Props) {
  const wallet = useWallet();
  const { ethereum } = wallet;
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>();
  const [activatingId, setActivating] = useState<string>();
  const [isConnected, setIsConnected] = useState(false);
  const { chainId, networkId } = getNetwork();
  let timeoutInstance: number | undefined;

  useEffect(() => {
    const lastWalletConnected = localStorage.getItem('LAST_WALLET_CONNECTOR');
    if (lastWalletConnected) {
      handleConnect(lastWalletConnected);
    }
  }, []);

  const ethers = useMemo(() => {
    setIsConnected(false);

    if (ethereum) {
      window.ethereum = ethereum;
      ethereum?.on('chainChanged', (newChainId: string) => {
        const chainIdNumber = +newChainId;
        if (
          !document.hidden &&
          EXPECTED_CHAIN_ID.includes(chainIdNumber) &&
          chainIdNumber !== chainId
        ) {
          changeNetwork(chainIdNumber);
        }
        window.location.reload();
      });
    }

    setActivating(undefined);

    if (ethereum && +ethereum.chainId !== chainId) {
      setIsWrongNetwork(true);
      return getDefaultProvider();
    }

    setIsWrongNetwork(false);

    if (!ethereum) {
      return getDefaultProvider();
    }

    setIsConnected(true);

    const ensRegistry = undefined; // network?.ensRegistry;
    return new EthersProviders.Web3Provider(ethereum, {
      name: networkId,
      chainId,
      ensAddress: ensRegistry,
    });
  }, [ethereum, chainId]);

  const handleConnect = async (walletId?: string) => {
    setActivating(walletId ?? activatingId);
    await wallet.connect(walletId ?? activatingId);
    if (!timeoutInstance) {
      timeoutInstance = window.setTimeout(() => {
        if (!isConnected) {
          setActivating(undefined);
          wallet.reset();
          setIsConnected(false);
        }
        timeoutInstance = undefined;
      }, 2000);
    }
  };

  const handleDisconnect = () => {
    setActivating(undefined);
    wallet.reset();
    localStorage.removeItem('LAST_WALLET_CONNECTOR');
    localStorage.removeItem('walletconnect');
    document.cookie = '';
    setIsConnected(false);
  };

  const changeNetwork = async (newChainId?: number) => {
    if (newChainId === chainId) {
      return;
    }

    if (!newChainId) {
      newChainId = chainId;
    }
    if (ethereum && EXPECTED_CHAIN_ID.includes(newChainId) && +ethereum.chainId !== newChainId) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(newChainId) }],
        });
      } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (error.code === 4902) {
          const network = getNetwork();
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: Web3.utils.toHex(newChainId),
                  chainName: network.name,
                  rpcUrls: [network.rpcUri],
                  nativeCurrency: network.nativeToken,
                  blockExplorerUrls: getExplorerUrl(newChainId),
                },
              ],
            });
          } catch (addError) {
            Logger.error(addError);
            window.location.reload();
          }
        }
      }
    }
    setCurrentChain(newChainId);
    window.location.reload();
  };

  const contextValue = useMemo(
    () => ({
      ...wallet,
      ethers,
      isWrongNetwork,
      walletAddress: wallet.account,
      activateWallet: handleConnect,
      deactivateWallet: handleDisconnect,
      activatedId: wallet.connector,
      activatingId,
      walletConnected: isConnected,
      changeNetwork,
    }),
    [wallet, ethers],
  );

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  );
}

function WalletProvider({ children }: Props) {
  const connectors = getUseWalletConnectors();
  return (
    <UseWalletProvider connectors={connectors} autoConnect>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  );
}

export { useWalletAugmented as useWallet, WalletProvider };
