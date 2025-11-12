import { Select } from '@/components/ui';
import { useMultipleStakedPositionsValue } from '@/hooks/useStakedPositionsValue';
import { IncentiveKey } from '@/types';
import {
  calculateIncentiveAPR,
  formatDate,
  getIncentiveKey,
} from '@/utils/common';
import { useIncentiveAPR } from '@/hooks/useIncentiveApr';
import { keccak256 } from 'ethers';
import { useMemo } from 'react';

interface IncentiveSelectorProps {
  incentives: IncentiveKey[];
  selectedIncentive?: IncentiveKey;
  onIncentiveChange: (incentive: IncentiveKey | undefined) => void;
  poolData: {
    jocxPrice: number;
    tvl: number;
  };
}

export default function IncentiveSelector({
  incentives,
  selectedIncentive,
  onIncentiveChange,
  poolData,
}: IncentiveSelectorProps) {
  return (
    <div className="space-y-3">
      <Select
        label="Select Incentives"
        placeholder="Select an incentive"
        options={incentives.map((i, idx) => ({
          value: i.id || String(idx),
          label: <IncentiveCard incentive={i} />,
          description: `${formatDate(i.startTime)} → ${formatDate(i.endTime)}`,
        }))}
        value={selectedIncentive?.id}
        onValueChange={(id) => {
          onIncentiveChange(
            incentives.find((incentive) => id === incentive.id)
          );
        }}
      />
    </div>
  );
}

const IncentiveCard = ({ incentive }: { incentive: IncentiveKey }) => {
  const apr = useIncentiveAPR(keccak256(getIncentiveKey(incentive)));
  return (
    <div>
      {`Reward: ${(Number(incentive.reward) / 1e18).toFixed(
        2
      )} JOCX → APR: ${apr}%`}
    </div>
  );
};
