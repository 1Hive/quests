import ReactDOM from 'react-dom';
import App from './app';
import { SubgraphProvider } from './providers/subgraph-context';
import './style.scss';

ReactDOM.render(
  <SubgraphProvider>
    <App />
  </SubgraphProvider>,
  document.getElementById('root'),
);
