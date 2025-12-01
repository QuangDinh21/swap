export interface IncentiveKey {
  id?: string;
  rewardToken: string;
  pool: string;
  startTime: bigint;
  endTime: bigint;
  refundee: string | undefined;
  reward: bigint;
  numberOfStakes?: bigint;
  totalRewardUnclaimed?: bigint;
}

export type IncentiveStatus = 'UPCOMING' | 'ACTIVE' | 'READY_TO_END' | 'ENDED';
