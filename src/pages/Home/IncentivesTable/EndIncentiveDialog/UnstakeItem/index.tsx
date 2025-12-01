import { Button, Card } from '@gu-corp/gu-ui';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UnstakeItemProps {
  stake: any;
  onUnstake: (tokenId: bigint) => void;
  isUnstaking: boolean;
  isSelected: boolean;
}

export const UnstakeItem: React.FC<UnstakeItemProps> = ({
  stake,
  onUnstake,
  isUnstaking,
  isSelected,
}) => {
  const { t } = useTranslation();
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${'hover:border-slate-300 hover:shadow-sm p-4'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className="text-sm font-semibold text-slate-900">ID #{stake.tokenId}</div>
            <div className={`w-2 h-2 rounded-full bg-green-500`} />
          </div>
          <div className="text-xs text-slate-600 mb-2">
            {' '}
            {t('incentives.endIncentive.liquidity')}: {stake.liquidity}
          </div>
        </div>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onUnstake?.(stake.tokenId);
          }}
          disabled={isUnstaking}
          className="ml-2"
        >
          {isUnstaking && isSelected && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{t('incentives.endIncentive.unstake')}</span>
        </Button>
      </div>
    </Card>
  );
};
