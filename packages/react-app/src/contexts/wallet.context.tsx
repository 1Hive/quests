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
  ethereum: any;
  changeNetwork: (_chainId?: number, _forceSwitch?: boolean) => void;
  openWalletConnect: React.Dispatch<React.SetStateAction<boolean>>;
  walletConnectOpened: boolean;
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
  const ethereum = wallet?.ethereum;
  const isWrongChainError = (window as any).globalError?.name === 'ChainUnknownError';
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(isWrongChainError);
  const [activatingId, setActivating] = useState<string>();
  const [isConnected, setIsConnected] = useState(false);
  const [walletConnectOpened, openWalletConnect] = useState<boolean>(false);
  const { chainId, networkId } = getNetwork();
  let timeoutInstance: number | undefined;

  useEffect(() => {
    console.log('#### useEffect', (window as any).globalError);
    if (!isWrongChainError) {
      const lastWalletConnected = localStorage.getItem('LAST_WALLET_CONNECTOR');
      if (lastWalletConnected) {
        handleConnect(lastWalletConnected);
      }
    }

    const handleErr = (ev: ErrorEvent) => {
      if (ev.error.name === 'ChainUnknownError') {
        (window as any).globalError = ev.error;
      }
      console.log('#### handleErr', { globalError: (window as any).globalError, ev });
    };
    window.addEventListener('error', handleErr);

    return () => {
      window.removeEventListener('error', handleErr);
    };
  }, []);

  const ethers = useMemo(() => {
    setIsConnected(false);

    if (ethereum) {
      (window as any).eth = ethereum;
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

    if (
      (ethereum && +ethereum.chainId !== chainId) ||
      (window as any).globalError?.name === 'ChainUnknownError'
    ) {
      setIsWrongNetwork(true);
      return getDefaultProvider();
    }

    if (!ethereum) {
      return getDefaultProvider();
    }

    setIsConnected(true);
    setIsWrongNetwork(false);
    (window as any).globalError = undefined;

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

  function handleDisconnect() {
    setActivating(undefined);
    wallet.reset();
    localStorage.removeItem('LAST_WALLET_CONNECTOR');
    localStorage.removeItem('walletconnect');
    document.cookie = '';
    setIsConnected(false);
  }

  const changeNetwork = async (newChainId?: number, forceSwitch: boolean = true) => {
    if (newChainId === chainId) {
      return;
    }

    if (!newChainId) {
      newChainId = chainId;
    }

    const ethConnection = ethereum ?? (window as any).ethereum;

    if (
      ethConnection &&
      EXPECTED_CHAIN_ID.includes(newChainId) &&
      +ethConnection.chainId !== newChainId
    ) {
      try {
        await ethConnection.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(newChainId) }],
        });
      } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (error.code === 4902) {
          const network = getNetwork();
          try {
            await ethConnection.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: Web3.utils.toHex(newChainId),
                  chainName: network.name,
                  rpcUrls: [network.rpcUri],
                  blockExplorerUrls: getExplorerUrl(newChainId),
                },
              ],
            });
          } catch (addError) {
            Logger.error(addError);
            window.location.reload();
            return;
          }
        } else if (error.code === 4001 && !forceSwitch) {
          // EIP-1193 userRejectedRequest error
          return;
        }
      }
    }
    setCurrentChain(newChainId);
    window.location.reload();
  };

  const contextValue = useMemo(
    () => ({
      ...wallet,
      ethereum,
      ethers,
      isWrongNetwork,
      walletAddress: wallet.account,
      activateWallet: handleConnect,
      deactivateWallet: handleDisconnect,
      activatedId: wallet.connector,
      activatingId,
      walletConnected: !!wallet.account && +ethereum.chainId === chainId,
      changeNetwork,
      walletConnectOpened,
      openWalletConnect,
    }),
    [wallet, ethers, walletConnectOpened],
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
