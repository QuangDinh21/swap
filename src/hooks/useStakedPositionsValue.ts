/**
 * Hook to fetch position details and calculate accurate USD values
 * for all staked positions in a specific incentive
 */

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useReadContracts } from 'wagmi';
import { gql } from '@apollo/client';
import { CONTRACTS } from '../config/constants';
import { UNISWAP_V3_POSITION_MANAGER_ABI } from '../config/abis';
import { usePoolData } from './usePoolData';
import {
    calculateTotalPositionsValue,
    PositionData,
} from '../utils/positionValueCalculator';

interface StakeInfo {
    incentiveId: string;
    tokenId: string;
    liquidity: string;
}

/**
 * Hook to calculate accurate total staked value for an incentive
 * Fetches position details from Position Manager and uses Uniswap V3 SDK
 */
export function useStakedPositionsValue(incentiveId: string) {
    const poolData = usePoolData();

    // Fetch all staked positions for this incentive from subgraph
    const GET_STAKED_POSITIONS = useMemo(() => {
        if (!incentiveId) return null;

        return gql`
      query {
        stakeInfos(where: { 
          incentiveId: "${incentiveId}", 
          staked: true
        }) {
          incentiveId
          tokenId
          liquidity
        }
      }
    `;
    }, [incentiveId]);

    const { data: stakesData, loading: loadingStakes } = useQuery(
        GET_STAKED_POSITIONS || gql`query { __typename }`,
        {
            skip: !GET_STAKED_POSITIONS || !incentiveId,
        }
    );

    // Extract token IDs from stake infos
    const stakedTokenIds = useMemo(() => {
        if (!stakesData?.stakeInfos) return [];
        return stakesData.stakeInfos.map((stake: StakeInfo) => stake.tokenId);
    }, [stakesData]);

    // Create contracts to fetch position details from Position Manager
    const positionContracts = useMemo(() => {
        return stakedTokenIds.map((tokenId: string) => ({
            address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'positions' as const,
            args: [BigInt(tokenId)],
        }));
    }, [stakedTokenIds]);

    // Fetch position details from Position Manager contract
    const { data: positionResults, isLoading: loadingPositions } = useReadContracts({
        contracts: positionContracts,
        query: {
            enabled: stakedTokenIds.length > 0,
        },
    });

    // Parse position data and calculate values
    const { totalStakedValue, positions } = useMemo(() => {
        if (
            poolData.isLoading ||
            !positionResults ||
            !stakesData?.stakeInfos ||
            stakedTokenIds.length === 0
        ) {
            return { totalStakedValue: 0, positions: [] };
        }

        const validPositions: PositionData[] = [];

        positionResults.forEach((result, index) => {
            if (result.status === 'success' && result.result) {
                const tokenId = stakedTokenIds[index];
                const [
                    ,
                    ,
                    token0,
                    token1,
                    fee,
                    tickLower,
                    tickUpper,
                    liquidity,
                    ,
                    ,
                    ,
                    ,
                ] = result.result as any;


                if (BigInt(liquidity) > BigInt(0)) {
                    validPositions.push({
                        tokenId,
                        token0: token0 as string,
                        token1: token1 as string,
                        fee: Number(fee),
                        tickLower: Number(tickLower),
                        tickUpper: Number(tickUpper),
                        liquidity: liquidity,
                    });
                }
            }
        });

        // Calculate total value using accurate SDK-based calculation
        const poolState = {
            sqrtPriceX96: poolData.sqrtPriceX96,
            liquidity: poolData.liquidity,
            tick: poolData.tick,
            tvl: poolData.tvl,
            jocxPrice: poolData.jocxPrice,
        };

        const totalValue = calculateTotalPositionsValue(validPositions, poolState);

        return {
            totalStakedValue: totalValue,
            positions: validPositions,
        };
    }, [poolData, positionResults, stakesData, stakedTokenIds]);

    return {
        totalStakedValue,
        positions,
        isLoading: loadingStakes || loadingPositions || poolData.isLoading,
    };
}

/**
 * Hook to calculate accurate values for multiple incentives at once
 */
export function useMultipleStakedPositionsValue(incentiveIds: string[]) {
    const poolData = usePoolData();

    // Fetch all staked positions for all incentives
    const GET_MULTIPLE_STAKES = useMemo(() => {
        if (incentiveIds.length === 0) return null;

        return gql`
      query {
        stakeInfos(where: { 
          incentiveId_in: [${incentiveIds.map((id) => `"${id}"`).join(', ')}], 
          staked: true
        }) {
          incentiveId
          tokenId
          liquidity
        }
      }
    `;
    }, [incentiveIds]);

    const { data: stakesData, loading: loadingStakes } = useQuery(
        GET_MULTIPLE_STAKES || gql`query { __typename }`,
        {
            skip: !GET_MULTIPLE_STAKES || incentiveIds.length === 0,
        }
    );

    // Extract unique token IDs
    const stakedTokenIds = useMemo(() => {
        if (!stakesData?.stakeInfos) return [];
        const uniqueIds = new Set<string>();
        stakesData.stakeInfos.forEach((stake: StakeInfo) => {
            uniqueIds.add(stake.tokenId);
        });
        return Array.from(uniqueIds);
    }, [stakesData]);

    // Create contracts to fetch position details
    const positionContracts = useMemo(() => {
        return stakedTokenIds.map((tokenId) => ({
            address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'positions' as const,
            args: [BigInt(tokenId)],
        }));
    }, [stakedTokenIds]);

    // Fetch position details
    const { data: positionResults, isLoading: loadingPositions } = useReadContracts({
        contracts: positionContracts,
        query: {
            enabled: stakedTokenIds.length > 0,
        },
    });

    // Calculate values per incentive
    const stakingDataMap = useMemo(() => {
        if (
            poolData.isLoading ||
            !positionResults ||
            !stakesData?.stakeInfos ||
            stakedTokenIds.length === 0
        ) {
            return new Map<string, number>();
        }

        // Build a map of tokenId -> PositionData
        const positionDataMap = new Map<string, PositionData>();

        positionResults.forEach((result, index) => {
            if (result.status === 'success' && result.result) {
                const tokenId = stakedTokenIds[index];
                const [
                    ,
                    ,
                    token0,
                    token1,
                    fee,
                    tickLower,
                    tickUpper,
                    liquidity,
                    ,
                    ,
                    ,
                    ,
                ] = result.result;

                if (BigInt(liquidity) > BigInt(0)) {
                    positionDataMap.set(tokenId, {
                        tokenId,
                        token0: token0 as string,
                        token1: token1 as string,
                        fee: Number(fee),
                        tickLower: Number(tickLower),
                        tickUpper: Number(tickUpper),
                        liquidity: liquidity,
                    });
                }
            }
        });

        // Group stakes by incentive and calculate total value
        const poolState = {
            sqrtPriceX96: poolData.sqrtPriceX96,
            liquidity: poolData.liquidity,
            tick: poolData.tick,
            tvl: poolData.tvl,
            jocxPrice: poolData.jocxPrice,
        };

        const result = new Map<string, number>();

        // Group by incentive
        const incentivePositions = new Map<string, PositionData[]>();
        stakesData.stakeInfos.forEach((stake: StakeInfo) => {
            const positionData = positionDataMap.get(stake.tokenId);
            if (positionData) {
                if (!incentivePositions.has(stake.incentiveId)) {
                    incentivePositions.set(stake.incentiveId, []);
                }
                incentivePositions.get(stake.incentiveId)!.push(positionData);
            }
        });

        // Calculate total value for each incentive
        incentivePositions.forEach((positions, incentiveId) => {
            const totalValue = calculateTotalPositionsValue(positions, poolState);
            result.set(incentiveId, totalValue);
        });

        return result;
    }, [poolData, positionResults, stakesData, stakedTokenIds]);

    return {
        stakingDataMap,
        isLoading: loadingStakes || loadingPositions || poolData.isLoading,
    };
}