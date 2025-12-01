import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { IncentiveKey, IncentiveStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, isUsd: string = '$') => {
  if (value >= 1000000000) {
    return `${isUsd}${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${isUsd}${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${isUsd}${(value / 1000).toFixed(1)}K`;
  } else {
    return `${isUsd}${value.toFixed(0)}`;
  }
};

export const formatDate = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};

export const formatDateToMMDDYYYY = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatLongAddress = (
  address: string,
  headCharactersVisible = 10,
  leadCharactersVisible = 10,
) => {
  return `${address.substring(0, headCharactersVisible)}...${address.substring(
    address.length - leadCharactersVisible,
  )}`;
};

export function getIncentiveStatus(incentive: IncentiveKey): IncentiveStatus {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const startTime = incentive.startTime;
  const endTime = incentive.endTime;
  const numberOfStakes = incentive.numberOfStakes ?? 0n;
  const totalRewardUnclaimed = incentive.totalRewardUnclaimed ?? 0n;

  if (now < startTime) return 'UPCOMING';

  if (now >= startTime && now < endTime) return 'ACTIVE';

  const rewardLeft = (totalRewardUnclaimed ?? 0n) > 0n;

  if (now > endTime && numberOfStakes !== 0n) return 'READY_TO_END';

  if (now > endTime && numberOfStakes === 0n && !rewardLeft) return 'ENDED';

  return 'READY_TO_END';
}
