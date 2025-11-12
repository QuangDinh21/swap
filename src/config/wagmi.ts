import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { walletConnect } from 'wagmi/connectors';

const ethereumRpcUrl = process.env.REACT_APP_ETHEREUM_RPC_URL || '';
const subgraphUrl = process.env.REACT_APP_SUBGRAPH_URL || '';
const subgraphApiKey = process.env.REACT_APP_SUBGRAPH_API_KEY || '';

export const chain = process.env.REACT_APP_IS_TESTNET ? sepolia : mainnet;

export const config = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: ethereumRpcUrl ? http(ethereumRpcUrl) : http(),
  } as any,
  connectors: [
    walletConnect({
      showQrModal: false,
      projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID!,
    }),
  ],
});

const apolloLink = new HttpLink({
  uri: subgraphUrl,
  headers: { Authorization: `Bearer ${subgraphApiKey}` },
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: apolloLink,
});

export default client;
