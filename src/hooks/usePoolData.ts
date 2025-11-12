import { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS, POOL_CONFIG } from '../config/constants';
import {
  UNISWAP_V3_FACTORY_ABI,
  UNISWAP_V3_POOL_ABI,
  ERC20_ABI,
} from '../config/abis';
import { createPool, calculateTokenPrice } from '../utils/uniswapUtils';

export interface PoolData {
  poolAddress: string | null;
  tvl: number;
  jocxPrice: number;
  liquidity: bigint;
  jocxBalance: number;
  usdtBalance: number;
  isLoading: boolean;
  error: string | null;
  sqrtPriceX96: bigint;
  tick: number;
  feeTier: number;
  jocxDecimals: number;
  usdtDecimals: number;
  lastUpdated: Date | null;
  refetch: () => void;
}

export function usePoolData(): PoolData {
  const [poolAddress, setPoolAddress] = useState<string | null>(null);
  const [tvl, setTvl] = useState<number>(0);
  const [jocxPrice, setJocxPrice] = useState<number>(0);
  const [liquidity, setLiquidity] = useState<bigint>(BigInt(0));
  const [jocxBalance, setJocxBalance] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [sqrtPriceX96, setSqrtPriceX96] = useState<bigint>(BigInt(0));
  const [tick, setTick] = useState<number>(0);
  const [feeTier, setFeeTier] = useState<number>(0);
  const [jocxDecimals, setJocxDecimals] = useState<number>(0);
  const [usdtDecimals, setUsdtDecimals] = useState<number>(0);
  // Get pool address from factory
  const { data: poolAddressData } = useReadContract({
    address: CONTRACTS.UNISWAP_V3_FACTORY as `0x${string}`,
    abi: UNISWAP_V3_FACTORY_ABI,
    functionName: 'getPool',
    args: [
      CONTRACTS.JOCX_TOKEN as `0x${string}`,
      CONTRACTS.USDT_TOKEN as `0x${string}`,
      POOL_CONFIG.JOCX_USDT_FEE,
    ],
  });

  // Update pool address when data is available
  useEffect(() => {
    if (
      poolAddressData &&
      poolAddressData !== '0x0000000000000000000000000000000000000000'
    ) {
      setPoolAddress(poolAddressData);
    }
  }, [poolAddressData]);

  // Pool data contracts
  const {
    data: poolDataResults,
    isLoading: poolDataLoading,
    refetch,
  } = useReadContracts({
    contracts: poolAddress
      ? [
          {
            address: poolAddress as `0x${string}`,
            abi: UNISWAP_V3_POOL_ABI,
            functionName: 'slot0',
          },
          {
            address: poolAddress as `0x${string}`,
            abi: UNISWAP_V3_POOL_ABI,
            functionName: 'liquidity',
          },
          {
            address: CONTRACTS.JOCX_TOKEN as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [poolAddress as `0x${string}`],
          },
          {
            address: CONTRACTS.USDT_TOKEN as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [poolAddress as `0x${string}`],
          },
          {
            address: CONTRACTS.JOCX_TOKEN as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'decimals',
          },
          {
            address: CONTRACTS.USDT_TOKEN as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'decimals',
          },
          {
            address: poolAddress as `0x${string}`,
            abi: UNISWAP_V3_POOL_ABI,
            functionName: 'fee',
          },
        ]
      : [],
    query: {
      enabled: !!poolAddress,
    },
  });

  // Process pool data
  useEffect(() => {
    const fetchPoolData = async () => {
      if (poolDataResults && poolAddress) {
        try {
          const [
            slot0Result,
            liquidityResult,
            jocxBalanceResult,
            usdtBalanceResult,
            jocxDecimalsResult,
            usdtDecimalsResult,
            feeTierResult,
          ] = poolDataResults;

          if (
            slot0Result?.status === 'success' &&
            liquidityResult?.status === 'success' &&
            jocxBalanceResult?.status === 'success' &&
            usdtBalanceResult?.status === 'success' &&
            jocxDecimalsResult?.status === 'success' &&
            usdtDecimalsResult?.status === 'success' &&
            feeTierResult?.status === 'success'
          ) {
            const slot0Data = slot0Result.result;
            const sqrtPriceX96Data = slot0Data[0];
            const tickData = slot0Data[1];
            const liquidityData = liquidityResult.result;
            const jocxBalance = jocxBalanceResult.result;
            const usdtBalance = usdtBalanceResult.result;
            const jocxDecimals = jocxDecimalsResult.result;
            const usdtDecimals = usdtDecimalsResult.result;
            const feeTier = feeTierResult.result;
            // Create pool instance using SDK
            const pool = createPool(sqrtPriceX96Data, liquidityData, tickData);

            // Calculate JOCX price using SDK
            const price = calculateTokenPrice(pool);
            setJocxPrice(price);

            // Calculate TVL
            const jocxBalanceFormatted = parseFloat(
              formatUnits(jocxBalance, jocxDecimals)
            );
            const usdtBalanceFormatted = parseFloat(
              formatUnits(usdtBalance, usdtDecimals)
            );

            const tvlValue =
              jocxBalanceFormatted * price + usdtBalanceFormatted;
            setTvl(tvlValue);

            // Set liquidity and pool data
            setLiquidity(BigInt(pool.liquidity.toString()));
            setSqrtPriceX96(sqrtPriceX96Data);
            setTick(tickData);
            setJocxBalance(jocxBalanceFormatted);
            setUsdtBalance(usdtBalanceFormatted);
            setFeeTier(feeTier);
            setJocxDecimals(jocxDecimals);
            setUsdtDecimals(usdtDecimals);
            setError(null);
          }
        } catch (err) {
          console.error('Error processing pool data:', err);
          setError('Failed to process pool data');
        }
      }
    };
    fetchPoolData();
    // Update pool data every 30 seconds
    const interval = setInterval(fetchPoolData, 30000);

    return () => clearInterval(interval);
  }, [poolDataResults, poolAddress]);

  return {
    poolAddress,
    tvl,
    jocxPrice,
    liquidity,
    jocxBalance,
    usdtBalance,
    isLoading: poolDataLoading,
    error,
    sqrtPriceX96,
    tick,
    feeTier,
    jocxDecimals,
    usdtDecimals,
    lastUpdated: new Date(),
    refetch,
  };
}
