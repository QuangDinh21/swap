import { useMemo } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { CONTRACTS } from '../config/constants';
import { UNISWAP_V3_POSITION_MANAGER_ABI } from '../config/abis';

export interface Position {
  tokenId: string;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  tokensOwed0: string;
  tokensOwed1: string;
  staked: boolean;
}

export function useUserPositions() {
  const { address } = useAccount();

  // Get number of positions owned
  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
    abi: UNISWAP_V3_POSITION_MANAGER_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Fetch all tokenIds
  const tokenIdContracts = balance
    ? Array.from({ length: Number(balance) }, (_, i) => ({
      address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
      abi: UNISWAP_V3_POSITION_MANAGER_ABI,
      functionName: 'tokenOfOwnerByIndex' as const,
      args: [address!, BigInt(i)],
    }))
    : [];

  const { data: tokenIdResults, isLoading: isLoadingTokenIds } =
    useReadContracts({
      contracts: tokenIdContracts,
      query: { enabled: !!address && Number(balance ?? 0) > 0 },
    });

  // Extract valid tokenIds
  const tokenIds = useMemo(() => {
    if (!tokenIdResults) return [];
    return tokenIdResults
      .filter(r => r.status === 'success' && r.result)
      .map(r => (r.result as bigint).toString());
  }, [tokenIdResults]);

  // Fetch position details
  const positionContracts = tokenIds.map(tokenId => ({
    address: CONTRACTS.UNISWAP_V3_POSITION_MANAGER as `0x${string}`,
    abi: UNISWAP_V3_POSITION_MANAGER_ABI,
    functionName: 'positions' as const,
    args: [BigInt(tokenId)],
  }));

  const { data: positionResults, isLoading: isLoadingPositionDetails } =
    useReadContracts({
      contracts: positionContracts,
      query: { enabled: tokenIds.length > 0 },
    });

  // Derive positions
  const positions: Position[] = useMemo(() => {
    if (!positionResults || tokenIds.length === 0) return [];

    return positionResults
      .map((result, index) => {
        if (result.status !== 'success' || !result.result) return null;

        const tokenId = tokenIds[index];
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
        ] = result.result;

        const isJocxUsdt =
          (token0.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase() &&
            token1.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase()) ||
          (token0.toLowerCase() === CONTRACTS.USDT_TOKEN.toLowerCase() &&
            token1.toLowerCase() === CONTRACTS.JOCX_TOKEN.toLowerCase());

        if (!isJocxUsdt || BigInt(liquidity) <= 0) return null;

        return {
          tokenId,
          token0: token0 as string,
          token1: token1 as string,
          fee: Number(fee),
          tickLower: Number(tickLower),
          tickUpper: Number(tickUpper),
          liquidity: liquidity,
          tokensOwed0: tokensOwed0.toString(),
          tokensOwed1: tokensOwed1.toString(),
        } as Position;
      })
      .filter(Boolean) as Position[];
  }, [positionResults, tokenIds]);

  // Single loading flag (correctly derived from wagmi only)
  const isLoading =
    isLoadingBalance || isLoadingTokenIds || isLoadingPositionDetails;

  return {
    positions,
    tokenIds: positions.map(p => p.tokenId),
    balance: balance ? Number(balance) : 0,
    isLoading,
    refetch: refetchBalance,
  };
}
