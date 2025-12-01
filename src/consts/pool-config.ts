import { chain } from '../wagmi/config';
import { CONTRACTS } from './contracts';

export const POOL_CONFIG = {
  FEE_TIER: import.meta.env.VITE_PUBLIC_IS_TESTNET ? 500 : 3000, // 0.3% fee tier
};

export const JOCX = {
  chainId: chain.id,
  address: CONTRACTS.JOCX_TOKEN as `0x${string}`,
  name: 'JOCX',
  symbol: 'JOCX',
  decimals: 18,
  logoPath: '/icons/jocx-icon.svg',
};

export const USDT = {
  chainId: chain.id,
  address: CONTRACTS.USDT_TOKEN as `0x${string}`,
  name: 'USDT',
  symbol: 'USDT',
  decimals: 6,
  logoPath: '/icons/usdt.svg',
};

export const SUPPORTED_PAIRS = [
  {
    tokenA: JOCX,
    tokenB: USDT,
  },
];

export const CHAIN_ID_TO_NETWORK_ICON = {
  [chain.id]: '/icons/eth.svg',
};
