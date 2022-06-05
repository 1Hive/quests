import { providers as EthersProviders } from 'ethers';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getProviderFromUseWalletId } from 'src/ethereum-providers';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { useNetworkContext } from 'src/contexts/network.context';
import { setCurrentChain } from 'src/local-settings';
import { getDefaultProvider, getUseWalletConnectors } from '../utils/web3.utils';
import { EXPECTED_CHAIN_ID } from '../constants';

export type WalletContextModel = {
  walletConnected: boolean;
  walletAddress: string;
  deactivateWallet: Function;
  activateWallet: Function;
  activatedId: string;
  activatingId: string;
  activationError: { name: string; message: string };
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
  const [activationError, setActivationError] = useState<{ name: string; message: string }>();
  const [activatingId, setActivating] = useState<string>();
  const [isConnected, setIsConnected] = useState(false);
  const { chainId, networkId, name, changeNetwork } = useNetworkContext();

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
      ethereum?.on('chainChanged', (_chainId: string) => {
        if (EXPECTED_CHAIN_ID.includes(+_chainId)) {
          changeNetwork(+_chainId);
        }
        window.location.reload();
      });
    }

    setActivating(undefined);

    if (ethereum && +ethereum.chainId !== chainId) {
      const connectorInfo = getProviderFromUseWalletId(wallet.connector);
      setActivationError({
        name: 'Wrong Network',
        message: `Please select the ${name} network in your wallet (${connectorInfo?.name}) and try again.`,
      });
      return getDefaultProvider();
    }

    setActivationError(undefined);

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

  const handleConnect = async (id: string) => {
    setActivating(id);
    await wallet.connect(id);
  };

  const handleDisconnect = () => {
    setActivating(undefined);
    wallet.reset();
    localStorage.removeItem('LAST_WALLET_CONNECTOR');
    setIsConnected(false);
  };
  const contextValue = useMemo(
    () => ({
      ...wallet,
      ethers,
      activationError,
      walletAddress: wallet.account,
      activateWallet: handleConnect,
      deactivateWallet: handleDisconnect,
      activatedId: wallet.connector,
      activatingId,
      walletConnected: isConnected,
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
