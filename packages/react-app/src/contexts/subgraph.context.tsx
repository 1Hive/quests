import { devtoolsExchange } from '@urql/devtools';
import { noop } from 'lodash-es';
import React from 'react';
import {
  cacheExchange,
  createClient,
  debugExchange,
  fetchExchange,
  Provider as UrqlProvider,
} from 'urql';
import { getNetwork } from '../networks';

const SubgraphContext = React.createContext({ resetSubgraphClient: noop });

const newClient = () =>
  createClient({
    url: getNetwork().questsSubgraph,
    exchanges: [debugExchange, devtoolsExchange, cacheExchange, fetchExchange],
  });

type Props = {
  children: React.ReactNode;
};

function SubgraphProvider({ children }: Props) {
  const [client, setClient] = React.useState(newClient());

  return (
    <SubgraphContext.Provider
      value={{
        resetSubgraphClient: () => setClient(newClient()),
      }}
    >
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </SubgraphContext.Provider>
  );
}

const useSubgraph = () => React.useContext(SubgraphContext)!;

export { SubgraphProvider, useSubgraph };
