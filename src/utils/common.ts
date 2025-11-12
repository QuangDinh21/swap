import { IncentiveKey } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { decodeAbiParameters, encodeAbiParameters, formatEther } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, isUsd: string = '$', toFixed: number = 1) => {
  if (value >= 1000000000) {
    return `${isUsd}${(value / 1000000000).toFixed(toFixed)}B`;
  } else if (value >= 1000000) {
    return `${isUsd}${(value / 1000000).toFixed(toFixed)}M`;
  } else if (value >= 1000) {
    return `${isUsd}${(value / 1000).toFixed(toFixed)}K`;
  } else {
    return `${isUsd}${value.toFixed(toFixed)}`;
  }
};


export const formatDate = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};

export const getIncentiveKey = (incentive: IncentiveKey | undefined): `0x${string}` => {
  if (!incentive)
    return '0x';
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          { name: 'rewardToken', type: 'address' },
          { name: 'pool', type: 'address' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'refundee', type: 'address' },
        ],
      },
    ],
    [
      {
        rewardToken: incentive?.rewardToken as `0x${string}`,
        pool: incentive?.pool as `0x${string}`,
        startTime: incentive?.startTime || BigInt(0),
        endTime: incentive?.endTime || BigInt(0),
        refundee: incentive?.refundee as `0x${string}`,
      },
    ]
  );
}
export interface SwapAmounts {
  amount: bigint; // Output token amount (negative value)
}
export function parseSwapResult(swapResult: any): SwapAmounts | null {
  try {
    if (!swapResult?.logs) {
      return null;
    }

    const swapLog = swapResult.logs[swapResult.logs.length - 1];
    if (!swapLog?.data) {
      return null;
    }

    // Decode the data (excluding indexed parameters: sender and recipient)
    const decoded = decodeAbiParameters(
      [
        { name: 'amount0', type: 'int256' },
        { name: 'amount1', type: 'int256' },
        { name: 'sqrtPriceX96', type: 'uint160' },
        { name: 'liquidity', type: 'uint128' },
        { name: 'tick', type: 'int24' }
      ],
      swapLog.data as `0x${string}`
    );

    const amount0 = decoded[0] as bigint;
    const amount1 = decoded[1] as bigint;

    // In Uniswap V3 swaps:
    // - The input token amount is positive (tokens sent to the pool)
    // - The output token amount is negative (tokens received from the pool)
    // We return the negative amount (output token)

    // Determine which amount is negative (the output)
    if (amount0 < BigInt(0)) {
      return { amount: -amount0 };
    } else if (amount1 < BigInt(0)) {
      return { amount: -amount1 };
    } else {
      // This shouldn't happen in a normal swap, but handle it gracefully
      console.warn('No negative amount found in swap result, using amount1 as fallback');
      return { amount: amount1 };
    }
  } catch (error) {
    console.error('Failed to parse swap result:', error);
    return null;
  }
}

export function parsePMResult(pmResult: any): string | null {
  try {
    if (!pmResult?.logs) {
      return null;
    }

    // The IncreaseLiquidity event is typically in logs[4]
    const increaseLiquidityLog = pmResult.logs[pmResult.logs.length - 1];
    if (!increaseLiquidityLog?.topics || increaseLiquidityLog.topics.length < 2) {
      return null;
    }

    // tokenId is the first indexed parameter (topics[1])
    // It's a uint256, so we need to convert the hex string to a decimal string
    const tokenIdHex = increaseLiquidityLog.topics[1] as `0x${string}`;
    const tokenId = BigInt(tokenIdHex);

    return tokenId.toString();
  } catch (error) {
    console.error('Failed to parse PM result:', error);
    return null;
  }
}

export const calculateIncentiveAPR = (
  rewardAmount: bigint,
  jocxPrice: number,
  totalStakedValue: number,
  startTime: bigint,
  endTime: bigint
): number => {
  if (totalStakedValue === 0) return 0;

  const Ty = 365 * 24 * 3600;
  const userYield = Number(formatEther(rewardAmount)) * jocxPrice / totalStakedValue;
  const apr = userYield * Ty / Number(endTime - startTime) * 100;

  return apr;
}