import { providers as EthersProviders } from 'ethers';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getProviderFromUseWalletId } from 'src/ethereum-providers';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { getNetwork } from '../networks';
import { getUseWalletConnectors } from '../utils/web3.utils';

export type WalletContextModel = {
  walletAddress: string;
  deactivateWallet: Function;
  activateWallet: Function;
  activated: string;
  activating: string;
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
  const [activating, setActivating] = useState<string>();

  useEffect(() => {
    const lastWalletConnected = localStorage.getItem('LAST_WALLET_CONNECTOR');
    if (lastWalletConnected) {
      handleConnect(lastWalletConnected);
    }
  }, []);

  const ethers = useMemo(() => {
    const { chainId, networkId, name } = getNetwork();

    if (ethereum) {
      window.ethereum = ethereum;
      ethereum?.on('chainChanged', (_chainId: string) => window.location.reload());
    }

    setActivating(undefined);

    if (ethereum && +ethereum.chainId !== chainId) {
      const connectorInfo = getProviderFromUseWalletId(wallet.connector);
      setActivationError({
        name: 'Wrong Network',
        message: `Please select the ${name} network in your wallet (${connectorInfo?.name}) and try again.`,
      });
      return null;
    }

    setActivationError(undefined);

    if (!ethereum) {
      return new EthersProviders.JsonRpcProvider(undefined, chainId);
    }

    const ensRegistry = undefined; // network?.ensRegistry;
    return new EthersProviders.Web3Provider(ethereum, {
      name: networkId,
      chainId,
      ensAddress: ensRegistry,
    });
  }, [ethereum]);

  const handleConnect = async (id: string) => {
    setActivating(id);
    await wallet.connect(id);
  };

  const contextValue = useMemo(
    () => ({
      ...wallet,
      ethers,
      activationError,
      walletAddress: wallet.account,
      activateWallet: handleConnect,
      deactivateWallet: () => {
        wallet.reset();
        localStorage.removeItem('LAST_WALLET_CONNECTOR');
      },
      activated: wallet.connector,
      activating,
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
