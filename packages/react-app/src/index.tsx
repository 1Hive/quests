import ReactDOM from 'react-dom';
import App from './app';
import { SubgraphProvider } from './contexts/subgraph.context';
import './styles/style.scss';

ReactDOM.render(
  <SubgraphProvider>
    <App />
  </SubgraphProvider>,
  document.getElementById('root'),
);
