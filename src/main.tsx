import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n/config';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { WithApolloClient } from './graphql/client.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WithApolloClient>
        <App />
      </WithApolloClient>
    </BrowserRouter>
  </StrictMode>,
);
