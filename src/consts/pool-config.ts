import { isProduction } from '../utils/system';
import { chain } from '../wagmi/config';

export const POOL_CONFIG = {
  FEE_TIER: isProduction ? 3000 : 500, // 0.3% fee tier
};

export const JOCX = {
  chainId: chain.id,
  address: import.meta.env.VITE_PUBLIC_JOCX_ETHEREUM_ADDRESS as `0x${string}`,
  name: 'JOCX',
  symbol: 'JOCX',
  decimals: 18,
  logoPath: '/icons/jocx-icon.svg',
};

export const USDT = {
  chainId: chain.id,
  address: import.meta.env.VITE_PUBLIC_USDT_ETHEREUM_ADDRESS as `0x${string}`,
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
