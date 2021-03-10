import React from 'react'
import {
  createClient,
  Provider as UrqlProvider,
  cacheExchange,
  debugExchange,
  fetchExchange,
} from 'urql'
import { getNetwork } from '../networks'

import { devtoolsExchange } from '@urql/devtools'

const SubgraphContext = React.createContext({ resetSubgraphClient: null })

const newClient = () =>
  createClient({
    url: getNetwork().subgraph,
    exchanges: [debugExchange, devtoolsExchange, cacheExchange, fetchExchange],
  })

function SubgraphProvider({ children }) {
  const [client, setClient] = React.useState(newClient())

  return (
    <SubgraphContext.Provider
      value={{
        resetSubgraphClient: () => setClient(newClient()),
      }}
    >
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </SubgraphContext.Provider>
  )
}

const useSubgraph = () => React.useContext(SubgraphContext)

export { SubgraphProvider, useSubgraph }
