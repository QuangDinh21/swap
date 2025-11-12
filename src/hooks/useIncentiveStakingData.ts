import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAccount, useReadContracts } from 'wagmi';
import { GET_ALL_STAKE_INFOS, GET_DEPOSIT_INFOS, GET_STAKE_INFOS } from '@/config/queries';
import { usePoolData } from './usePoolData';
import { CONTRACTS } from '../config/constants';
import { UNISWAP_V3_POSITION_MANAGER_ABI } from '../config/abis';
import {
    calculateAccuratePositionValue,
    PositionData,
} from '../utils/positionValueCalculator';

interface StakeInfo {
    incentiveId: string;
    tokenId: string;
    liquidity: string;
    staked?: string;
}

interface DepositInfo {
    tokenId: string;
}

/**
 * Hook to fetch staking data for a specific incentive
 * Returns total staked value in USD and user's staked value in USD
 * Uses accurate position value calculation with Uniswap V3 SDK
 */
export function useIncentiveStakingData(incentiveId: string) {
    const { address } = useAccount();
    const poolData = usePoolData();

    // Fetch all staked positions for this incentive
    const { data: allStakesData, loading: loadingAllStakes, refetch: refetchAllStakeData } = useQuery(
        GET_ALL_STAKE_INFOS(incentiveId),
        {
            skip: !incentiveId,
        }
    );

    // Fetch user's deposited token IDs
    const { data: depositData, loading: loadingDeposits, refetch: refetchDepositData } = useQuery(
        GET_DEPOSIT_INFOS(address as string),
        {
            skip: !address,
        }
    );

    // Get user's token IDs
    const userTokenIds = depositData?.depositInfos?.map((d: DepositInfo) => d.tokenId) || [];

    // Fetch user's stake info for this incentive
    const { data: userStakesData, loading: loadingUserStakes, refetch: refetchUserData } = useQuery(
        GET_STAKE_INFOS(userTokenIds, incentiveId),
        {
            skip: !address || !incentiveId || userTokenIds.length === 0,
        }
    );

    // Get all unique token IDs that are staked
    const allStakedTokenIds = useMemo(() => {
        if (!allStakesData?.stakeInfos) return [];
        return allStakesData.stakeInfos.map((stake: StakeInfo) => stake.tokenId);
    }, [allStakesData]);

    // Fetch position details from Position Manager for all staked positions
    const allPositionContracts = useMemo(() => {
        return allStakedTokenIds.map((tokenId: string) => ({
            address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'positions' as const,
            args: [BigInt(tokenId)],
        }));
    }, [allStakedTokenIds]);

    const { data: allPositionResults, isLoading: loadingAllPositions } = useReadContracts({
        contracts: allPositionContracts,
        query: {
            enabled: allStakedTokenIds.length > 0,
        },
    });

    // Get user's staked token IDs
    const userStakedTokenIds = useMemo(() => {
        if (!userStakesData?.stakeInfos) return [];
        return userStakesData.stakeInfos
            .filter((stake: StakeInfo) => stake.staked)
            .map((stake: StakeInfo) => stake.tokenId);
    }, [userStakesData]);

    // Fetch position details for user's staked positions
    const userPositionContracts = useMemo(() => {
        return userStakedTokenIds.map((tokenId: string) => ({
            address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'positions' as const,
            args: [BigInt(tokenId)],
        }));
    }, [userStakedTokenIds]);

    const { data: userPositionResults, isLoading: loadingUserPositions } = useReadContracts({
        contracts: userPositionContracts,
        query: {
            enabled: userStakedTokenIds.length > 0,
        },
    });

    // Calculate total staked value in USD using accurate position values
    const totalStakedValue = useMemo(() => {
        if (poolData.isLoading || !allPositionResults || allStakedTokenIds.length === 0) {
            return 0;
        }

        const poolState = {
            sqrtPriceX96: poolData.sqrtPriceX96,
            liquidity: poolData.liquidity,
            tick: poolData.tick,
            tvl: poolData.tvl,
            jocxPrice: poolData.jocxPrice,
        };

        let totalValue = 0;

        allPositionResults.forEach((result, index) => {
            if (result.status === 'success' && result.result) {
                const tokenId = allStakedTokenIds[index];
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

                const isJocxUsdtPosition =
                    (token0.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase() &&
                        token1.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase()) ||
                    (token0.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase() &&
                        token1.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase());

                if (isJocxUsdtPosition && BigInt(liquidity) > BigInt(0)) {
                    const positionData: PositionData = {
                        tokenId,
                        token0: token0 as string,
                        token1: token1 as string,
                        fee: Number(fee),
                        tickLower: Number(tickLower),
                        tickUpper: Number(tickUpper),
                        liquidity: liquidity,
                    };

                    try {

                        totalValue += calculateAccuratePositionValue(positionData, poolState);
                    } catch (e) {

                    }
                }
            }
        });

        return totalValue;
    }, [poolData, allPositionResults, allStakedTokenIds]);

    // Calculate user's staked value in USD using accurate position values
    const userStakedValue = useMemo(() => {
        if (poolData.isLoading || !userPositionResults || userStakedTokenIds.length === 0) {
            return 0;
        }

        const poolState = {
            sqrtPriceX96: poolData.sqrtPriceX96,
            liquidity: poolData.liquidity,
            tick: poolData.tick,
            tvl: poolData.tvl,
            jocxPrice: poolData.jocxPrice,
        };

        let totalValue = 0;

        userPositionResults.forEach((result, index) => {
            if (result.status === 'success' && result.result) {
                const tokenId = userStakedTokenIds[index];
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

                const isJocxUsdtPosition =
                    (token0.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase() &&
                        token1.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase()) ||
                    (token0.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase() &&
                        token1.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase());

                if (isJocxUsdtPosition && BigInt(liquidity) > BigInt(0)) {
                    const positionData: PositionData = {
                        tokenId,
                        token0: token0 as string,
                        token1: token1 as string,
                        fee: Number(fee),
                        tickLower: Number(tickLower),
                        tickUpper: Number(tickUpper),
                        liquidity: liquidity,
                    };

                    try {
                        totalValue += calculateAccuratePositionValue(positionData, poolState);
                    } catch (e) {

                    }
                }
            }
        });

        return totalValue;
    }, [poolData, userPositionResults, userStakedTokenIds]);

    const refetch = () => {
        refetchDepositData();
        refetchAllStakeData();
        refetchUserData();
    }
    return {
        totalStakedValue,
        userStakedValue,
        isLoading:
            loadingAllStakes ||
            loadingDeposits ||
            loadingUserStakes ||
            loadingAllPositions ||
            loadingUserPositions ||
            poolData.isLoading,
        refetch
    };
}