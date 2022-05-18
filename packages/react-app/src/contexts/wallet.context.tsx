import { providers as EthersProviders } from 'ethers';
import React, { useContext, useMemo } from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { getNetwork } from '../networks';
import { getUseWalletConnectors } from '../utils/web3.utils';

export type WalletContextModel = {
  walletAddress: string;
  activating: any;
  deactivateWallet: Function;
  activateWallet: Function;
  activated: string;
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

  const ethers = useMemo(() => {
    const { chainId, networkId } = getNetwork();
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

  const handleActivateWallet = (id?: string) => {
    if (!id) {
      id = localStorage.getItem('LAST_WALLET_CONNECTOR') ?? undefined;
    }
    if (id) {
      wallet.connect(id);
      localStorage.setItem('LAST_WALLET_CONNECTOR', id);
    }
  };

  const handleDeactivateWallet = () => {
    wallet.reset();
    localStorage.removeItem('LAST_WALLET_CONNECTOR');
  };

  const contextValue = useMemo(
    () => ({
      ...wallet,
      ethers,
      walletAddress: wallet.account,
      activateWallet: handleActivateWallet,
      deactivateWallet: handleDeactivateWallet,
      activated: wallet.connector,
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
  const { chainId } = getNetwork();

  const connectors = getUseWalletConnectors();
  return (
    <UseWalletProvider chainId={chainId} connectors={connectors}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  );
}

export { useWalletAugmented as useWallet, WalletProvider };
