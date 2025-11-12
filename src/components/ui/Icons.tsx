import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
}

export function PlusIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}

export function WalletIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}

export function CoinIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  );
}

export function ChartIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

export function DownloadIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export function CheckIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function InfoIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export interface TokenIconProps extends IconProps {
  symbol: string;
  gradient?: string;
}

export function TokenIcon({
  symbol,
  gradient = 'from-blue-500 to-blue-600',
  className = 'w-8 h-8',
}: TokenIconProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center ${className}`}
    >
      <span className="text-white font-bold text-xs">{symbol.charAt(0)}</span>
    </div>
  );
}

export interface RealTokenIconProps extends IconProps {
  symbol: string;
  fallbackGradient?: string;
}

export function ChevronUpIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}

export function ClockIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function ExclamationTriangleIcon({
  className = 'w-5 h-5',
  size,
}: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export function FilterIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
      />
    </svg>
  );
}

export function EyeIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export function EyeSlashIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className = 'w-5 h-5', size }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

export function RealTokenIcon({
  symbol,
  fallbackGradient = 'from-blue-500 to-blue-600',
  className = 'w-8 h-8',
}: RealTokenIconProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Token icon URLs from popular sources
  const getTokenIconUrl = (tokenSymbol: string) => {
    const lowerSymbol = tokenSymbol.toLowerCase();

    // Primary source: CoinGecko API (free tier)
    const coinGeckoUrl = `https://assets.coingecko.com/coins/images/`;

    // Token ID mappings for popular tokens
    const tokenMappings: { [key: string]: string } = {
      usdt: '325/small/Tether.png',
      usdc: '6319/small/USD_Coin_icon.png',
      eth: '279/small/ethereum.png',
      btc: '1/small/bitcoin.png',
      bnb: '825/small/bnb-icon2_2x.png',
      dai: '9956/small/4943.png',
      busd: '9576/small/BUSD.png',
      weth: '2396/small/weth.png',
      wbtc: '7598/small/wrapped_bitcoin_wbtc.png',
    };

    // For JOCX (custom token), we'll use a fallback
    if (lowerSymbol === 'jocx') {
      return null; // Will use fallback
    }

    const tokenPath = tokenMappings[lowerSymbol];
    if (tokenPath) {
      return `${coinGeckoUrl}${tokenPath}`;
    }

    // Fallback to TrustWallet assets
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x${lowerSymbol}/logo.png`;
  };

  const iconUrl = getTokenIconUrl(symbol);

  // If no URL or image failed to load, show fallback
  if (!iconUrl || imageError || !imageLoaded) {
    return (
      <div
        className={`bg-gradient-to-br ${fallbackGradient} rounded-full flex items-center justify-center ${className} ring-2 ring-white/20`}
      >
        <span className="text-white font-bold text-xs">{symbol.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden ${className} ring-2 ring-white/20`}
    >
      <img
        src={iconUrl}
        alt={`${symbol} token`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      {!imageLoaded && (
        <div
          className={`bg-gradient-to-br ${fallbackGradient} rounded-full flex items-center justify-center w-full h-full`}
        >
          <span className="text-white font-bold text-xs">
            {symbol.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}
