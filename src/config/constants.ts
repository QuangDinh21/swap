// Contract addresses - Replace with actual addresses
export const MAINNET_CONTRACTS = {
  // Token Contract Address
  JOCX_TOKEN: '0xbb1E1399EEE1f577F1B4359224155f5Db39CA084',
  USDT_TOKEN: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC_TOKEN: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',

  // Uniswap v3 Core Contracts
  UNISWAP_V3_STAKER: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  UNISWAP_V3_FACTORY: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  UNISWAP_V3_ROUTER: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  UNISWAP_V3_POSITION_MANAGER: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const TESTNET_CONTRACTS = {
  // USDT Token Contract Address
  JOCX_TOKEN: '0xB1660F8CDbf2102Ac74C6CD6d7CD6A65E481e5fe',
  USDT_TOKEN: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
  USDC_TOKEN: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',

  // Uniswap v3 Core Contracts
  UNISWAP_V3_STAKER: '0xFfb833EfA0D411f7182E1f362C81c670FbF4F868',
  UNISWAP_V3_FACTORY: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
  UNISWAP_V3_ROUTER: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
  UNISWAP_V3_POSITION_MANAGER: '0x1238536071E1c677A632429e3655c799b22cDA52',
};

export const CONTRACTS = process.env.REACT_APP_IS_TESTNET
  ? TESTNET_CONTRACTS
  : MAINNET_CONTRACTS;

export const TOKEN_LOGOS: Record<string, string> = {
  USDT: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  JOCX: 'https://assets.coingecko.com/coins/images/67263/standard/TokenSymbol.png?1752235823',
  USDC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
};

// Supported base tokens for Beginner Mode select box
export const SUPPORTED_BASE_TOKENS = ['USDT', 'USDC', 'ETH'] as const;
export type BaseToken = (typeof SUPPORTED_BASE_TOKENS)[number];

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  type: 'erc20' | 'native';
  address: string;
  description: string;
  logo: string;
};

export const USDT: Token = {
  symbol: 'USDT',
  name: 'Tether',
  decimals: 6,
  type: 'erc20',
  address: CONTRACTS.USDT_TOKEN,
  description: 'Swap half to JOCX',
  logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
};

export const USDC: Token = {
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  type: 'erc20',
  address: CONTRACTS.USDC_TOKEN,
  description: 'Half to USDT and half to JOCX',
  logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};

export const JOCX: Token = {
  symbol: 'JOCX',
  name: 'JOCX',
  decimals: 18,
  type: 'erc20',
  address: CONTRACTS.JOCX_TOKEN,
  description: 'Swap half to JOCX',
  logo: 'https://assets.coingecko.com/coins/images/67263/standard/TokenSymbol.png?1752235823',
};

export const ETH: Token = {
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  type: 'native',
  address: CONTRACTS.WETH,
  description: 'Half to USDT and half to JOCX',
  logo: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
};

// Pool configuration with fee tiers for different pairs
export const POOL_CONFIG = {
  // JOCX/USDT pool fee tier
  JOCX_USDT_FEE: process.env.REACT_APP_IS_TESTNET ? 500 : 3000,
  // USDC/USDT pool fee tier (use 500 for lower fees on mainnet)
  USDC_USDT_FEE: process.env.REACT_APP_IS_TESTNET ? 3000 : 500,
  // WETH/USDT pool fee tier (use 500 for lower fees on mainnet)
  WETH_USDT_FEE: process.env.REACT_APP_IS_TESTNET ? 3000 : 500,
};

// UI Configuration
export const UI_CONFIG = {
  APP_NAME: 'Liquidity Staker',
  APP_DESCRIPTION: 'Earn by providing liquidity to JOCX/USDT pool',
  BRAND_COLOR: '#3b82f6',
};

export const isTestnet = process.env.REACT_APP_IS_TESTNET;
