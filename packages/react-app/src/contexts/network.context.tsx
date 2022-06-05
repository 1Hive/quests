import React, { createContext, useContext, useState } from 'react';
import { setCurrentChain } from 'src/local-settings';
import { NetworkModel } from 'src/models/network.model';
import { getNetwork } from 'src/networks';

export type NetworkContextModel = NetworkModel & { changeNetwork: (_chainId: number) => void };

const NetworkContext = createContext<NetworkContextModel | undefined>(undefined);
export const useNetworkContext = () => useContext(NetworkContext)!;

type Props = {
  children: React.ReactNode;
};
export const NetworkContextProvider = ({ children }: Props) => {
  const [network, setNetwork] = useState<NetworkModel>(getNetwork());

  const changeNetwork = (chainId: number) => {
    setCurrentChain(chainId);
    setNetwork(getNetwork(chainId));
  };

  return (
    <NetworkContext.Provider value={{ ...network, changeNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};
