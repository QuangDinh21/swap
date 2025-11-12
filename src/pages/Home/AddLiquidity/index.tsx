import { useState, useEffect } from 'react';
import { LiquidityProvider } from './LiquidityProvider';
import { useUserPositions } from '@/hooks/useUserPositions';
import { ToggleGroup } from '@/components/ui';
import { IncentiveKey } from '@/types';
import DataDashboard from './DataDashboard';
import OneClickFlow from './OneClickFlow';
import { usePoolData } from '@/hooks/usePoolData';
import { useIncentiveStakingData } from '@/hooks/useIncentiveStakingData';
import { keccak256 } from 'ethers';
import { getIncentiveKey } from '@/utils/common';
import { useDataRefetch } from '@/contexts/DataRefetchContext';

export default function AddLiquidity() {
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [selectedIncentive, setSelectedIncentive] = useState<
    IncentiveKey | undefined
  >();

  // Fetch real data
  const { refetch: refetchPositions } = useUserPositions();
  const { refetch: refetchPoolData } = usePoolData();
  const { refetch: refetchStakingData } = useIncentiveStakingData(
    keccak256(getIncentiveKey(selectedIncentive))
  );

  // Register refetchStakingData with context
  const { registerRefetchStakingData } = useDataRefetch();

  useEffect(() => {
    registerRefetchStakingData(refetchStakingData);
  }, [refetchStakingData, registerRefetchStakingData]);

  const handleLiquidityAdded = () => {
    // Refetch positions to get the latest data from blockchain
    refetchPositions();
    refetchPoolData();
  };

  const handleFlowCompleted = () => {
    // Refetch positions after beginner flow completion
    refetchPositions();
    refetchPoolData();
    refetchStakingData();
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex-1">
        <ToggleGroup
          options={[
            {
              value: 'beginner',
              label: 'Beginner Mode',
              description: 'One-click flow',
            },
            {
              value: 'advanced',
              label: 'Advanced Mode',
              description: 'Manual control',
            },
          ]}
          value={mode}
          onValueChange={(v) => setMode(v as 'beginner' | 'advanced')}
        />
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {mode === 'beginner' ? (
            <OneClickFlow
              onCompleted={handleFlowCompleted}
              onIncentiveChange={setSelectedIncentive}
            />
          ) : (
            <LiquidityProvider onLiquidityAdded={handleLiquidityAdded} />
          )}
        </div>

        {/* Side Panel - Mobile-optimized collapsible data dashboard */}
        <div className="xl:col-span-1">
          <DataDashboard
            selectedIncentive={selectedIncentive}
            showStakingInfo={mode === 'beginner'}
          />
        </div>
      </div>
    </div>
  );
}
