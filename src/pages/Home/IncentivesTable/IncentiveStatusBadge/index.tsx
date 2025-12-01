import { Badge } from '@gu-corp/gu-ui';
import type { IncentiveKey } from '../../../../types';
import { getIncentiveStatus } from '../../../../utils/common';
import { useTranslation } from 'react-i18next';

interface Props {
  incentive: IncentiveKey;
}

const IncentiveStatusBadge: React.FC<Props> = (props) => {
  const { incentive } = props;
  const { t } = useTranslation();
  const status = getIncentiveStatus(incentive);
  let label = '';
  let className = '';

  switch (status) {
    case 'UPCOMING':
      label = t('incentives.badgeStatus.upcoming');
      className = 'bg-[#F0F8FF] text-[#1E90FF]';
      break;

    case 'ACTIVE':
      label = t('incentives.badgeStatus.active');
      className = 'bg-[#ECFDF2] text-[#008A2E]';
      break;

    case 'READY_TO_END':
      label = t('incentives.badgeStatus.readyToEnd');
      className = 'bg-[#FDF5D3] text-[#DC7609]';
      break;

    case 'ENDED':
      label = t('incentives.badgeStatus.ended');
      className = 'bg-gray-100 text-gray-600';
      break;

    default:
      label = t('incentives.badgeStatus.unknown');
      className = 'bg-[#FFE0E1] text-[#E60000]';
      break;
  }

  return (
    <Badge
      className={`rounded-full ${className}`}
      variant="outline"
      data-testid="incentive-status-badge"
    >
      <span className="text-xs font-semibold">{label}</span>
    </Badge>
  );
};

export default IncentiveStatusBadge;
