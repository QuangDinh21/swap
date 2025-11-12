import { CONTRACTS, POOL_CONFIG } from '@/config/constants';
import { UNISWAP_V3_ROUTER_ABI } from '@/config/abis';
import { useAccount, useConfig } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { useCallback } from 'react';

export const useUniswapV3Router = () => {
  const { address } = useAccount();
  const wagmiConfig = useConfig();

  const exactInput = useCallback(
    async (args: {
      amountIn: bigint;
      amountOutMinimum: bigint;
      path: string;
      value?: bigint;
    }) => {
      const { amountIn, amountOutMinimum, path, value } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_ROUTER as `0x${string}`,
        abi: UNISWAP_V3_ROUTER_ABI,
        functionName: 'exactInput',
        args: [
          {
            path: path as `0x${string}`,
            recipient: address as `0x${string}`,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
          },
        ],
        ...(value ? { value: value } : {}),
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig, address]
  );

  const exactInputSingle = useCallback(
    async (args: {
      tokenIn: string;
      tokenOut: string;
      amountIn: bigint;
      amountOutMinimum: bigint;
    }) => {
      const { tokenIn, tokenOut, amountIn, amountOutMinimum } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_ROUTER as `0x${string}`,
        abi: UNISWAP_V3_ROUTER_ABI,
        functionName: 'exactInputSingle',
        args: [
          {
            tokenIn: tokenIn as `0x${string}`,
            tokenOut: tokenOut as `0x${string}`,
            fee: POOL_CONFIG.JOCX_USDT_FEE,
            recipient: address as `0x${string}`,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: BigInt(0),
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

  return { exactInput, exactInputSingle };
};
