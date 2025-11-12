import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACTS, POOL_CONFIG } from '../config/constants';
import { UNISWAP_V3_STAKER_ABI } from '../config/abis';
import { Position } from './useUserPositions';
import { createPool, createPosition, calculatePositionValue } from '../utils/uniswapUtils';

interface IncentiveKey {
    rewardToken: string;
    pool: string;
    startTime: bigint;
    endTime: bigint;
    refundee: string | undefined;
    reward: bigint;
}

interface UsePositionManagementProps {
    positions: Position[];
    stakedPositions: Position[];
    selectedIncentive?: IncentiveKey;
    poolData: any;
}

/**
 * Calculate position value using Uniswap SDK
 * This properly handles different fee tiers and token amounts
 */
function calculatePositionValueFromData(
    position: Position,
    poolData: any
): number {
    try {
        // Only calculate if position matches the configured pool fee tier
        if (position.fee !== POOL_CONFIG.JOCX_USDT_FEE) {
            // For positions with different fee tiers, use a simplified calculation
            // This is a fallback and may not be 100% accurate
            const positionValue = (
                (poolData.tvl * Number(position.liquidity)) /
                Number(poolData.liquidity)
            );
            return positionValue;
        }

        // Create pool instance from poolData
        const pool = createPool(
            poolData.sqrtPriceX96 || BigInt(0),
            poolData.liquidity || BigInt(0),
            poolData.tick || 0
        );

        // Create position instance
        const sdkPosition = createPosition(
            pool,
            position.tickLower,
            position.tickUpper,
            position.liquidity
        );

        if (!sdkPosition) {
            // Fallback to simple calculation
            return (
                (poolData.tvl * Number(position.liquidity)) /
                Number(poolData.liquidity)
            );
        }

        // Calculate accurate position value
        return calculatePositionValue(sdkPosition, poolData.jocxPrice);
    } catch (error) {
        // Fallback to simple calculation
        return (
            (poolData.tvl * Number(position.liquidity)) /
            Number(poolData.liquidity)
        );
    }
}

export function usePositionManagement({
    positions,
    stakedPositions,
    selectedIncentive,
    poolData
}: UsePositionManagementProps) {
    const [selectedUserTokenId, setSelectedUserTokenId] = useState('');
    const [stakedTokenId, setStakedTokenId] = useState('');

    // Get reward info for selected staked position
    const { data: rewardInfo, refetch: fetchStakedRewards, isLoading: loadingStakedRewards } = useReadContract({
        address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
        abi: UNISWAP_V3_STAKER_ABI,
        functionName: 'getRewardInfo',
        args: stakedTokenId && selectedIncentive
            ? [
                {
                    rewardToken: selectedIncentive.rewardToken as `0x${string}`,
                    pool: selectedIncentive.pool as `0x${string}`,
                    startTime: selectedIncentive.startTime,
                    endTime: selectedIncentive.endTime,
                    refundee: selectedIncentive.refundee as `0x${string}`,
                },
                BigInt(stakedTokenId),
            ]
            : undefined,
        query: {
            enabled: !!stakedTokenId && !!selectedIncentive,
        },
    });

    // Convert positions to select options
    const positionOptions = positions.map((position) => {
        const positionValue = calculatePositionValueFromData(position, poolData);

        return {
            value: position.tokenId,
            label: `Position #${position.tokenId}`,
            description: `Fee: ${(position.fee / 10000).toFixed(2)}% • Value: $${positionValue.toFixed(2)}`,
        };
    });

    // Convert staked positions to select options with status
    const stakedPositionOptions = stakedPositions.map((position) => {
        const positionValue = calculatePositionValueFromData(position, poolData);

        const stakingStatus = position.staked ? 'Staked' : 'Unstaked';

        return {
            value: position.tokenId,
            label: `Position ID #${position.tokenId} (${stakingStatus})`,
            description: `Fee: ${(position.fee / 10000).toFixed(2)}% • Value: $${positionValue.toFixed(2)}`,
        };
    });

    const isSelectedPositionStaked = stakedPositions.find(p => p.tokenId === stakedTokenId)?.staked;

    return {
        // Selections
        selectedUserTokenId,
        stakedTokenId,
        setSelectedUserTokenId,
        setStakedTokenId,

        // Position data
        positionOptions,
        stakedPositionOptions,
        isSelectedPositionStaked,
        rewardInfo,
        loadingStakedRewards,
        fetchStakedRewards
    };
}