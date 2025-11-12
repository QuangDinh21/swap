import { gql, useQuery } from '@apollo/client';
import {
  convertBasedOnEfficiency,
  getAmountsCurrentTickUSD,
} from '../utils/tvl';
import { usePoolData } from '@/hooks/usePoolData';
import { isTestnet } from '@/config/constants';

export const MAX_RANGE = 2 ** 256;
export const YEAR = 31536000;

export const USDT_PRICE = 1;

export const formatBigInt = (
  value: BigInt,
  { decimals = 18, precision = 2 } = {}
) => {
  return (Number(value) / 10 ** decimals).toFixed(precision);
};

const GET_INCENTIVE = (id: string) => gql`
  query {
    incentiveInfo(id: "${id}") {
      id
      rewardToken
      pool
      startTime
      endTime
      refundee
      reward
      refundAmount
    }
  }
`;

export function useIncentiveAPR(id: string) {
  const { data: incentiveData } = useQuery(GET_INCENTIVE(id));
  const poolData = usePoolData();

  if (!incentiveData?.incentiveInfo) return 0;
  if (!poolData) return 0;

  /**
   * In testnet the token0 of JOCX/USDT pool is USDT and token1 is JOCX.
   * Otherwise in the mainnet the token0 of JOCX/USDT pool is JOCX and token1 is USDT.
   * So we need to set the price of the token0 and token1 accordingly.
   */
  const poolToken0PriceUSD = isTestnet ? USDT_PRICE : poolData.jocxPrice;
  const poolToken1PriceUSD = isTestnet ? poolData.jocxPrice : USDT_PRICE;

  /**
   * In testnet the token0 of JOCX/USDT pool is USDT and token1 is JOCX.
   * Otherwise in the mainnet the token0 of JOCX/USDT pool is JOCX and token1 is USDT.
   * So we need to set the price of the token0 and token1 accordingly.
   */
  const decimals0 = isTestnet ? poolData.usdtDecimals : poolData.jocxDecimals;
  const decimals1 = isTestnet ? poolData.jocxDecimals : poolData.usdtDecimals;

  /**
   * the USD value of liquidity that’s effectively active right around the current price (current tick) in a Uniswap v3 pool.
   */
  const activeTickLiqudityUSD = getAmountsCurrentTickUSD(
    Number(poolData.sqrtPriceX96),
    poolData.tick,
    Number(poolData.liquidity),
    poolData.feeTier,
    decimals0,
    decimals1,
    poolToken0PriceUSD,
    poolToken1PriceUSD
  );

  /**
   * Your pool’s active liquidity (USD) converted to a full-range equivalent so APRs are comparable across pools/ranges.
   */
  const fullRangeLiquidityUSD = convertBasedOnEfficiency(
    activeTickLiqudityUSD,
    poolData.feeTier,
    MAX_RANGE
  );

  const rewardTokenPriceUSD = poolData.jocxPrice;

  return (
    (
      ((Number(formatBigInt(incentiveData?.incentiveInfo?.reward)) *
        rewardTokenPriceUSD) /
        fullRangeLiquidityUSD) *
      (YEAR /
        Number(
          incentiveData?.incentiveInfo?.endTime -
            incentiveData?.incentiveInfo?.startTime
        )) *
      100
    ).toFixed(2) || 0
  );
}
