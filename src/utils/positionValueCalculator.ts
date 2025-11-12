/**
 * Utility for calculating accurate Uniswap V3 position values
 * Handles concentrated liquidity positions with custom tick ranges
 */

import { createPool, createPosition, calculatePositionValue } from './uniswapUtils';

export interface PositionData {
    tokenId: string;
    token0: string;
    token1: string;
    fee: number;
    tickLower: number;
    tickUpper: number;
    liquidity: bigint;
}

export interface PoolState {
    sqrtPriceX96: bigint;
    liquidity: bigint;
    tick: number;
    tvl: number;
    jocxPrice: number;
}

/**
 * Calculate accurate USD value for a Uniswap V3 position
 * Uses the Uniswap V3 SDK to properly handle concentrated liquidity
 * 
 * @param position - Position data including tick ranges
 * @param poolState - Current pool state
 * @returns USD value of the position
 */
export function calculateAccuratePositionValue(
    position: PositionData,
    poolState: PoolState
): number {
    try {
        // Create pool instance from current state
        const pool = createPool(
            poolState.sqrtPriceX96,
            poolState.liquidity,
            poolState.tick
        );

        // Create position instance with tick ranges
        const sdkPosition = createPosition(
            pool,
            position.tickLower,
            position.tickUpper,
            position.liquidity
        );

        if (!sdkPosition) {
            console.warn(`Failed to create SDK position for tokenId ${position.tokenId}`);
            return 0;
        }

        // Calculate accurate USD value using SDK
        return calculatePositionValue(sdkPosition, poolState.jocxPrice);
    } catch (error) {
        // console.error(`Error calculating value for position ${position.tokenId}:`, error);
        return 0;
    }
}

/**
 * Calculate total USD value for multiple positions
 * 
 * @param positions - Array of position data
 * @param poolState - Current pool state
 * @returns Total USD value of all positions
 */
export function calculateTotalPositionsValue(
    positions: PositionData[],
    poolState: PoolState
): number {
    return positions.reduce((total, position) => {
        return total + calculateAccuratePositionValue(position, poolState);
    }, 0);
}

/**
 * Fallback calculation for when position details are not available
 * This assumes full-range liquidity (like Uniswap V2) and is less accurate
 * 
 * @deprecated Use calculateAccuratePositionValue when possible
 */
export function calculateFallbackPositionValue(
    liquidity: bigint,
    poolState: PoolState
): number {
    if (poolState.liquidity === BigInt(0)) return 0;

    // Simple proportion: position_value = tvl * (position_liquidity / total_liquidity)
    // This is only accurate for full-range positions
    return (poolState.tvl * Number(liquidity)) / Number(poolState.liquidity);
}