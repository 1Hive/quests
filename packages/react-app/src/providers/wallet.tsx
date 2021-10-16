import { providers as EthersProviders } from 'ethers';
import React, { useContext, useMemo } from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { getDefaultChain } from '../local-settings';
import { getNetwork } from '../networks';
import { getUseWalletConnectors } from '../utils/web3-utils';

const WalletAugmentedContext = React.createContext<any>(undefined);

function useWalletAugmented() {
  return useContext<any>(WalletAugmentedContext);
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

    const ensRegistry = network?.ensRegistry;
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: getDefaultChain(),
      ensAddress: ensRegistry,
    });
  }, [ethereum]);

  const contextValue = useMemo(() => ({ ...wallet, ethers }), [wallet, ethers]);

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
