import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import client, { config } from './config/wagmi';

import { ConnectKitProvider } from 'connectkit';
import { Toaster } from 'sonner';
import { ApolloProvider } from '@apollo/client';
import AppRouter from './AppRouter';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              <AppRouter />
              <Toaster position="bottom-right" />
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
