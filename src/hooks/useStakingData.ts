import { useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { useApolloClient } from '@apollo/client';
import { useUserPositions, Position } from './useUserPositions';
import { usePoolData } from './usePoolData';
import { CONTRACTS } from '../config/constants';
import { UNISWAP_V3_POSITION_MANAGER_ABI, UNISWAP_V3_STAKER_ABI } from '../config/abis';
import {
  GET_INCENTIVES,
  GET_DEPOSIT_INFOS,
  GET_STAKE_INFOS,
} from '../config/queries';
import { formatUnits, keccak256 } from 'ethers';
import { getIncentiveKey } from '../utils/common';
import { readContract, readContracts } from 'wagmi/actions';

interface IncentiveKey {
  id?: string;
  rewardToken: string;
  pool: string;
  startTime: bigint;
  endTime: bigint;
  refundee: string | undefined;
  reward: bigint;
}

export function useStakingData() {
  const wagmiConfig = useConfig();
  const client = useApolloClient();
  const { address } = useAccount();
  const [createdIncentives, setCreatedIncentives] = useState<IncentiveKey[]>(
    []
  );
  const [stakedPositions, setStakedPositions] = useState<Position[]>([]);
  const [stakeInfos, setStakeInfos] = useState<any>([]);
  const [rewards, setRewards] = useState<string>('');
  const [loadingUnstakedRewards, setLoadingUnstakedRewards] = useState<boolean>(false);
  const [loadingIncentives, setLoadingIncentives] = useState<boolean>(false);
  const [loadingStakeInfos, setLoadingStakeInfos] = useState<boolean>(false);

  const {
    positions,
    isLoading: loadingUserPositions,
    refetch: fetchUserPositions,
  } = useUserPositions();

  const poolData = usePoolData();

  const fetchUnstakedRewards = async () => {
    if (!address) return;
    setLoadingUnstakedRewards(true);

    const rewardsData = await readContract(wagmiConfig, {
      address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
      abi: UNISWAP_V3_STAKER_ABI,
      functionName: 'rewards',
      args: [CONTRACTS.JOCX_TOKEN as `0x${string}`, address]
    })

    const formattedRewards = formatUnits(rewardsData, 18); // Assuming 18 decimals for JOCX
    setRewards(formattedRewards);

    setLoadingUnstakedRewards(false);
  }

  const fetchIncentives = async () => {
    setLoadingIncentives(true);

    const { data: incentives } = await client.query({ query: GET_INCENTIVES(poolData.poolAddress as string) });
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
    setLoadingIncentives(false);
  };

  const fetchStakeInfos = async (incentive?: IncentiveKey) => {
    setLoadingStakeInfos(true);

    const { data: depositInfos } = await client.query({ query: GET_DEPOSIT_INFOS(address as string), fetchPolicy: 'network-only' });
    const tempIds = depositInfos.depositInfos.map(
      (depositInfo: any) => depositInfo.tokenId
    );

    const { data } = await client.query({ query: GET_STAKE_INFOS(tempIds, keccak256(getIncentiveKey(incentive))), fetchPolicy: 'network-only' });

    setStakeInfos(data);
    const stakedInfos = data.stakeInfos;

    const stakedPositionContracts = stakedInfos.map((stakedInfo: any) => ({
      address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
      abi: UNISWAP_V3_POSITION_MANAGER_ABI,
      functionName: 'positions' as const,
      args: [BigInt(stakedInfo.tokenId)],
    }));


    // Fetch all staked position details at once
    const stakedPositionResults = await readContracts(wagmiConfig, {
      contracts: stakedPositionContracts
    });

    if (stakedPositionResults && stakedInfos.length > 0) {
      const validStakedPositions: Position[] = [];

      stakedPositionResults.forEach((result, index) => {
        if (result.status === 'success' && result.result) {
          const tokenId = stakedInfos[index].tokenId;
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
            tokensOwed0,
            tokensOwed1,
          ] = result.result as any;

          // Filter for JOCX/USDT positions only
          const isJocxUsdtPosition =
            (token0.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase() &&
              token1.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase()) ||
            (token0.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase() &&
              token1.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase());

          if (isJocxUsdtPosition && BigInt(liquidity) > BigInt(0)) {
            validStakedPositions.push({
              tokenId,
              token0: token0 as string,
              token1: token1 as string,
              fee: Number(fee),
              tickLower: Number(tickLower),
              tickUpper: Number(tickUpper),
              liquidity: liquidity,
              tokensOwed0: tokensOwed0.toString(),
              tokensOwed1: tokensOwed1.toString(),
              staked: stakedInfos[index].staked
            });
          }
        }
      });

      setStakedPositions(validStakedPositions);
    } else {
      setStakedPositions([]);
    }

    setLoadingStakeInfos(false);
  };

  return {
    // Data
    rewards,
    positions,
    stakedPositions,
    createdIncentives,
    stakeInfos,
    poolData,

    // Loading states
    loadingUserPositions,
    loadingStakeInfos,
    loadingIncentives,
    loadingUnstakedRewards,

    // Refetch functions (for external use)
    fetchUserPositions,
    fetchStakeInfos,
    fetchIncentives,
    fetchUnstakedRewards
  };
}
