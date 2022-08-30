import ReactDOM from 'react-dom';
import App from './app';
import { ThemeContextProvider } from './contexts/theme.context';
import './styles/style.scss';

ReactDOM.render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>,
  document.getElementById('root'),
);
