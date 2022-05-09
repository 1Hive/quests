import { providers as EthersProviders } from 'ethers';
import React, { useContext, useMemo } from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { getDefaultChain } from '../local-settings';
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
    const network = getNetwork();
    if (!ethereum) {
      return new EthersProviders.JsonRpcProvider(undefined, network.chainId);
    }

    const ensRegistry = undefined; // network?.ensRegistry;
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: getDefaultChain(),
      ensAddress: ensRegistry,
    });
  }, [ethereum]);

  const contextValue = useMemo(
    () => ({
      ...wallet,
      ethers,
      walletAddress: wallet.account,
      activateWallet: wallet.activate,
      deactivateWallet: wallet.deactivate,
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
  const chainId = getDefaultChain();

  const connectors = getUseWalletConnectors();
  return (
    <UseWalletProvider chainId={chainId} connectors={connectors}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  );
}

export { useWalletAugmented as useWallet, WalletProvider };
