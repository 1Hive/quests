import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { SubgraphProvider } from './providers/Subgraph'

ReactDOM.render(
  <SubgraphProvider>
    <App />
  </SubgraphProvider>,
  document.getElementById('root')
)
