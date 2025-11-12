import { useAccount, useConfig } from 'wagmi';
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from 'wagmi/actions';
import { useCallback } from 'react';
import { ERC20_ABI } from '@/config/abis';
import { USDT } from '@/config/constants';

export const useErc20 = (tokenAddress: string) => {
  const wagmiConfig = useConfig();
  const { address } = useAccount();
  const isUsdt = tokenAddress === USDT.address;

  const allowance = useCallback(
    async (spender: string) =>
      readContract(wagmiConfig, {
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, spender as `0x${string}`],
      }),
    [wagmiConfig, tokenAddress, address]
  );

  const approve = useCallback(
    async (spender: string, amount: bigint) => {
      const hash = await writeContract(wagmiConfig, {
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, amount],
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });
    },
    [wagmiConfig, tokenAddress]
  );

  const approveIfNeeded = useCallback(
    async (spender: string, amount: bigint) => {
      let currentAllowance = await allowance(spender);
      if (
        isUsdt &&
        currentAllowance !== BigInt(0) &&
        currentAllowance < amount
      ) {
        await approve(spender, BigInt(0));
        currentAllowance = await allowance(spender);
      }

      if (currentAllowance < amount) {
        await approve(spender, amount);
      }
    },
    [allowance, approve, isUsdt]
  );

  return { allowance, approve, approveIfNeeded };
};
