import ReactDOM from 'react-dom';
import App from './app';
import { SubgraphProvider } from './contexts/subgraph.context';
import { ThemeContextProvider } from './contexts/theme.context';
import './styles/style.scss';

ReactDOM.render(
  <SubgraphProvider>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </SubgraphProvider>,
  document.getElementById('root'),
);
