import { UNISWAP_V3_STAKER_ABI } from '@/config/abis';
import { useCallback } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { CONTRACTS } from '@/config/constants';
import { IncentiveKey } from '@/types';

export const useStaker = () => {
  const { address } = useAccount();
  const wagmiConfig = useConfig();

  const stakeToken = useCallback(
    async (args: { key: IncentiveKey; tokenId: bigint }) => {
      const { key, tokenId } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
        abi: UNISWAP_V3_STAKER_ABI,
        functionName: 'stakeToken',
        args: [
          {
            rewardToken: key.rewardToken as `0x${string}`,
            pool: key.pool as `0x${string}`,
            startTime: key.startTime,
            endTime: key.endTime,
            refundee: key.refundee as `0x${string}`,
          },
          BigInt(tokenId),
        ],
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig]
  );

  const unstakeToken = useCallback(
    async (args: { key: IncentiveKey; tokenId: bigint }) => {
      const { key, tokenId } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
        abi: UNISWAP_V3_STAKER_ABI,
        functionName: 'unstakeToken',
        args: [
          {
            rewardToken: key.rewardToken as `0x${string}`,
            pool: key.pool as `0x${string}`,
            startTime: key.startTime,
            endTime: key.endTime,
            refundee: key.refundee as `0x${string}`,
          },
          BigInt(tokenId),
        ],
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig]
  );

  const claimReward = useCallback(async () => {
    const hash = await writeContract(wagmiConfig, {
      address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
      abi: UNISWAP_V3_STAKER_ABI,
      functionName: 'claimReward',
      args: [
        CONTRACTS.JOCX_TOKEN as `0x${string}`,
        address as `0x${string}`,
        BigInt(0), // 0 means claim entire reward amount
      ],
    });

    const result = await waitForTransactionReceipt(wagmiConfig, {
      hash,
    });

    return result;
  }, [wagmiConfig, address]);

  const withdrawToken = useCallback(
    async (args: { tokenId: bigint }) => {
      const { tokenId } = args;
      const hash = await writeContract(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
        abi: UNISWAP_V3_STAKER_ABI,
        functionName: 'withdrawToken',
        args: [
          BigInt(tokenId),
          address as `0x${string}`,
          '0x', // empty data
        ],
      });

      const result = await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      return result;
    },
    [wagmiConfig, address]
  );

  return {
    stakeToken,
    unstakeToken,
    claimReward,
    withdrawToken,
  };
};
