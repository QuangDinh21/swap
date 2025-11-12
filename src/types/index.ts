export interface IncentiveKey {
    id?: string;
    rewardToken: string;
    pool: string;
    startTime: bigint;
    endTime: bigint;
    refundee: string | undefined;
    reward: bigint;
}

export type Step = {
    label: string;
    description: string;
    status: 'waiting' | 'in-progress' | 'completed' | 'failed';
};