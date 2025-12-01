import React from 'react';

type Size = 'sm' | 'md' | 'lg';

type PoolPairIconProps = {
  tokenA: string; // src for token A
  tokenB: string; // src for token B
  badgeIcon?: string; // optional badge src
  size?: Size;
  className?: string;
  scaleA?: number; // optional extra scale for tokenA (default 1)
  scaleB?: number; // optional extra scale for tokenB (default 1)
};

const sizeMap: Record<Size, string> = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const badgeSizeMap: Record<Size, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5.5 h-5.5',
  lg: 'w-7.5 h-7.5',
};

export const PoolPairIcon: React.FC<PoolPairIconProps> = ({
  tokenA,
  tokenB,
  badgeIcon,
  size = 'md',
  className = '',
  scaleA = 1,
  scaleB = 1,
}) => {
  const sizeClasses = sizeMap[size];
  const badgeSizeClasses = badgeSizeMap[size];

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses} ${className}
      `}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden bg-transparent">
        <div className="absolute inset-0 [clip-path:inset(0_50%_0_0)]">
          <div className="relative w-full h-full">
            <img
              src={tokenA}
              alt="Token A"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: `scale(${scaleA})`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
          <div className="relative w-full h-full">
            <img
              src={tokenB}
              alt="Token B"
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${scaleB})`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>
      </div>

      {badgeIcon && (
        <img
          className={`
            absolute -bottom-1 -right-1
            ${badgeSizeClasses}
            rounded-lg overflow-hidden
            flex items-center justify-center
          `}
          src={badgeIcon}
          sizes="w-full h-full object-contain"
          alt="Badge"
        />
      )}
    </div>
  );
};
