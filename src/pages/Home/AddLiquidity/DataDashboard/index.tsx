import { usePoolData } from '@/hooks/usePoolData';
import { useIncentiveStakingData } from '@/hooks/useIncentiveStakingData';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import {
  calculateIncentiveAPR,
  formatCurrency,
  getIncentiveKey,
} from '@/utils/common';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  ChartIcon,
} from '@/components/ui';
import { formatEther, keccak256 } from 'ethers';
import { useMemo } from 'react';
import { useIncentiveAPR } from '@/hooks/useIncentiveApr';

interface IncentiveKey {
  id?: string;
  rewardToken: string;
  pool: string;
  startTime: bigint;
  endTime: bigint;
  refundee: string | undefined;
  reward: bigint;
}

interface DataDashboardProps {
  selectedIncentive?: IncentiveKey;
  showStakingInfo: boolean;
}

export default function DataDashboard({
  selectedIncentive,
  showStakingInfo,
}: DataDashboardProps) {
  const poolData = usePoolData();
  const {
    totalStakedValue,
    userStakedValue,
    isLoading: isLoadingStaking,
  } = useIncentiveStakingData(keccak256(getIncentiveKey(selectedIncentive)));

  const apr = useIncentiveAPR(keccak256(getIncentiveKey(selectedIncentive)));

  return (
    <Card glow>
      <CardHeader
        icon={<ChartIcon className="w-5 h-5 text-white" />}
        title="Live Protocol Data"
      />

      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Pool Information */}
          <Card variant="compact">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">
              Pool Information
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Pool:</span>
                <span className="text-slate-900 font-mono text-sm">
                  {poolData.isLoading ? (
                    <LoadingSkeleton className="w-32 h-4" />
                  ) : poolData.poolAddress ? (
                    `${poolData.poolAddress.slice(
                      0,
                      6
                    )}...${poolData.poolAddress.slice(-4)}`
                  ) : (
                    'Not found'
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">TVL:</span>
                <span className="text-slate-900 font-semibold">
                  {poolData.isLoading ? (
                    <LoadingSkeleton className="w-16 h-4" />
                  ) : (
                    formatCurrency(poolData.tvl)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">JOCX Balance:</span>
                <span className="text-slate-900 font-semibold">
                  {poolData.isLoading ? (
                    <LoadingSkeleton className="w-16 h-4" />
                  ) : (
                    formatCurrency(poolData.jocxBalance, '')
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">USDT Balance:</span>
                <span className="text-slate-900 font-semibold">
                  {poolData.isLoading ? (
                    <LoadingSkeleton className="w-16 h-4" />
                  ) : (
                    formatCurrency(poolData.usdtBalance)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">JOCX Price:</span>
                <span className="text-slate-900 font-semibold">
                  {poolData.isLoading ? (
                    <LoadingSkeleton className="w-16 h-4" />
                  ) : (
                    `${poolData.jocxPrice.toFixed(6)} $`
                  )}
                </span>
              </div>
            </div>
          </Card>

          {/* Staking Information */}
          {showStakingInfo && (
            <Card variant="compact">
              <h4 className="text-lg font-semibold text-slate-800 mb-3">
                Staking Information
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Reward:</span>
                  <span className="text-slate-900 font-semibold">
                    {!selectedIncentive ? (
                      <LoadingSkeleton className="w-16 h-4" />
                    ) : (
                      formatEther(selectedIncentive.reward) + ' JOCX'
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Total Staked:</span>
                  <span className="text-slate-900 font-semibold">
                    {!selectedIncentive || isLoadingStaking ? (
                      <LoadingSkeleton className="w-16 h-4" />
                    ) : (
                      '$' + totalStakedValue.toFixed(2)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">You Staked:</span>
                  <span className="text-slate-900 font-semibold">
                    {!selectedIncentive || isLoadingStaking ? (
                      <LoadingSkeleton className="w-16 h-4" />
                    ) : (
                      '$' + userStakedValue.toFixed(2)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">APR:</span>
                  <span className="text-slate-900 font-semibold">
                    {!selectedIncentive || isLoadingStaking ? (
                      <LoadingSkeleton className="w-16 h-4" />
                    ) : (
                      apr + '%'
                    )}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-between text-sm text-slate-500 w-full">
          <span>Last updated:</span>
          <span>
            {poolData.lastUpdated
              ? poolData.lastUpdated.toLocaleTimeString()
              : 'Loading...'}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
