import { Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import About from './pages/About';
import { getWagmiConfig } from './wagmi/config';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <WagmiProvider config={getWagmiConfig()}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
          </Routes>
          <Toaster position="top-center" />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
