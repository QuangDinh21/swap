import React, { useMemo } from 'react';
import { Input, InputProps } from './Input';
import { Button } from './Button';
import { cn } from '../../utils/common';
import { TOKEN_LOGOS } from '../../config/constants';

export interface TokenInputProps
  extends Omit<InputProps, 'rightAddon' | 'error'> {
  tokenSymbol: string;
  tokenIcon?: React.ReactNode;
  balance?: string;
  onMaxClick?: () => void;
  usdValue?: string;
  showBalance?: boolean;
  showUsdValue?: boolean;
}

export function TokenInput({
  tokenSymbol,
  tokenIcon,
  balance,
  onMaxClick,
  usdValue,
  showBalance = true,
  showUsdValue = true,
  className,
  value,
  onChange,
  ...props
}: TokenInputProps) {
  // Check if input value exceeds available balance
  const isExceedingBalance = useMemo(() => {
    if (!balance || !value) return false;

    const inputValue = parseFloat(value.toString());
    const balanceValue = parseFloat(balance);

    return (
      !isNaN(inputValue) && !isNaN(balanceValue) && inputValue > balanceValue
    );
  }, [balance, value]);

  const errorMessage = isExceedingBalance
    ? `Insufficient balance. Maximum: ${balance} ${tokenSymbol}`
    : undefined;

  // Handle input change to prevent negative values and format properly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === '') {
      if (onChange) onChange(e);
      return;
    }

    // Parse the value
    const numValue = parseFloat(inputValue);

    // Prevent negative values
    if (numValue < 0) {
      e.preventDefault();
      return;
    }

    // Call the original onChange handler
    if (onChange) onChange(e);
  };

  return (
    <div className="space-y-3">
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        type="number"
        placeholder="0.0"
        className={cn('text-right text-lg font-semibold', className)}
        error={errorMessage}
        rightAddon={
          <div className="flex items-center space-x-2">
            {onMaxClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMaxClick}
                className="text-blue-600 hover:text-blue-700 font-semibold text-xs px-2 py-1"
              >
                MAX
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <img
                src={TOKEN_LOGOS[tokenSymbol]}
                alt={tokenSymbol}
                className="w-7 h-7 rounded-full"
              />
              <span className="text-gray-800 font-medium">{tokenSymbol}</span>
            </div>
          </div>
        }
      />

      {(showBalance || showUsdValue) && (
        <div className="flex justify-between items-center text-xs">
          {showBalance && balance && (
            <span className="text-slate-500">
              Balance: {balance} {tokenSymbol}
            </span>
          )}
          {showUsdValue && usdValue && (
            <span className="text-slate-500">~${usdValue} USD</span>
          )}
        </div>
      )}
    </div>
  );
}
