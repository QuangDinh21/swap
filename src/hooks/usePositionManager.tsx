import { UNISWAP_V3_POSITION_MANAGER_ABI } from '@/config/abis';
import { useCallback } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { CONTRACTS, JOCX, POOL_CONFIG, USDT } from '@/config/constants';
import {
  calculateSlippageAmounts,
  getToken0,
  getToken1,
} from '@/utils/uniswapUtils';

export const usePositionManager = () => {
  const { address } = useAccount();
  const wagmiConfig = useConfig();

  const mint = useCallback(
    async (args: {
      token0: string;
      token1: string;
      fee: number;
      tickLower: number;
      tickUpper: number;
      amount0Desired: bigint;
      amount1Desired: bigint;
      amount0Min: bigint;
      amount1Min: bigint;
      recipient?: string;
      deadline: bigint;
    }) => {
      const {
        token0,
        token1,
        fee,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        recipient,
        deadline,
      } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
        abi: UNISWAP_V3_POSITION_MANAGER_ABI,
        functionName: 'mint',
        args: [
          {
            token0: token0 as `0x${string}`,
            token1: token1 as `0x${string}`,
            fee: fee,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired,
            amount1Desired,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            recipient: recipient
              ? (recipient as `0x${string}`)
              : (address as `0x${string}`),
            deadline: deadline,
          },
        ],
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig, address]
  );

  const increaseLiquidity = useCallback(
    async (args: {
      tokenId: bigint;
      amount0Desired: bigint;
      amount1Desired: bigint;
      amount0Min: bigint;
      amount1Min: bigint;
      deadline: bigint;
    }) => {
      const {
        tokenId,
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        deadline,
      } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
        abi: UNISWAP_V3_POSITION_MANAGER_ABI,
        functionName: 'increaseLiquidity',
        args: [
          {
            tokenId: tokenId,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            deadline: deadline,
          },
        ],
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig]
  );

  const mintUsdtJocxPool = useCallback(
    async (args: {
      amount0Desired: bigint;
      amount1Desired: bigint;
      recipient?: string;
    }) => {
      const token0 = getToken0(USDT.address, JOCX.address);
      const token1 = getToken1(USDT.address, JOCX.address);
      const { amount0Desired, amount1Desired, recipient } = args;
      const amount0 = token0 === USDT.address ? amount0Desired : amount1Desired;
      const amount1 = token1 === USDT.address ? amount0Desired : amount1Desired;
      return mint({
        token0: token0,
        token1: token1,
        fee: POOL_CONFIG.JOCX_USDT_FEE,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: calculateSlippageAmounts(amount0).min,
        amount1Min: calculateSlippageAmounts(amount1).min,
        recipient: recipient
          ? (recipient as `0x${string}`)
          : (address as `0x${string}`),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 1200),
      });
    },
    [mint, address]
  );

  const increaseUsdtJocxPool = useCallback(
    async (args: {
      tokenId: bigint;
      amount0Desired: bigint;
      amount1Desired: bigint;
    }) => {
      const token0 = getToken0(USDT.address, JOCX.address);
      const token1 = getToken1(USDT.address, JOCX.address);
      const { tokenId, amount0Desired, amount1Desired } = args;
      const amount0 = token0 === USDT.address ? amount0Desired : amount1Desired;
      const amount1 = token1 === USDT.address ? amount0Desired : amount1Desired;
      return increaseLiquidity({
        tokenId,
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: calculateSlippageAmounts(amount0).min,
        amount1Min: calculateSlippageAmounts(amount1).min,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 1200),
      });
    },
    [increaseLiquidity]
  );

  const safeTransferFrom = useCallback(
    async (args: { to: string; tokenId: bigint; data: string }) => {
      const { tokenId, to, data } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
        abi: UNISWAP_V3_POSITION_MANAGER_ABI,
        functionName: 'safeTransferFrom',
        args: [
          address as `0x${string}`,
          to as `0x${string}`,
          tokenId,
          data as `0x${string}`,
        ],
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig, address]
  );

  const safeTransferToStake = useCallback(
    async (args: { tokenId: bigint; data: string }) => {
      const { tokenId, data } = args;
      return safeTransferFrom({
        to: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
        tokenId,
        data,
      });
    },
    [safeTransferFrom]
  );

  return {
    mint,
    mintUsdtJocxPool,
    increaseLiquidity,
    increaseUsdtJocxPool,
    safeTransferFrom,
    safeTransferToStake,
  };
};
