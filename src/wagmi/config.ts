import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { isProduction } from '../utils/system';

const walletConnectProjectId = import.meta.env.VITE_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
const ethereumRpcUrl = import.meta.env.VITE_PUBLIC_ETHEREUM_RPC_URL || '';

export const chain = isProduction ? mainnet : sepolia;

export function getWagmiConfig() {
  return createConfig(
    getDefaultConfig({
      appName: 'JOCX Liquidity Staking',
      appDescription: 'JOCX Liquidity Staking Platform',
      walletConnectProjectId: walletConnectProjectId,
      chains: [chain],
      transports: {
        [chain.id]: ethereumRpcUrl ? http(ethereumRpcUrl) : http(),
      },
      enableFamily: false,
    }),
  );
}
