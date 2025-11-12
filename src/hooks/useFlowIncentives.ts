import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_INCENTIVES } from '../config/queries';
import { usePoolData } from './usePoolData';
import { IncentiveKey } from '@/types';

export function useFlowIncentives() {
    const poolData = usePoolData();
    const [createdIncentives, setCreatedIncentives] = useState<IncentiveKey[]>([]);
    const [selectedIncentive, setSelectedIncentive] = useState<IncentiveKey>();

    const { data: incentives } = useQuery(
        GET_ACTIVE_INCENTIVES(poolData.poolAddress as string),
        {
            skip: !poolData.poolAddress,
        }
    );

    useEffect(() => {
        if (!incentives) return;

        const tempIncentives: IncentiveKey[] = incentives.incentiveInfos.map(
            (i: any) => ({
                id: i.id,
                rewardToken: i.rewardToken,
                pool: i.pool,
                startTime: BigInt(i.startTime),
                endTime: BigInt(i.endTime),
                refundee: i.refundee,
                reward: BigInt(i.reward),
            })
        );

        setCreatedIncentives(tempIncentives);

        // Auto-select first incentive if none selected
        if (!selectedIncentive && tempIncentives.length > 0) {
            setSelectedIncentive(tempIncentives[0]);
        }
    }, [poolData.poolAddress, incentives, selectedIncentive]);

    return {
        createdIncentives,
        selectedIncentive,
        setSelectedIncentive,
        poolData,
    };
}