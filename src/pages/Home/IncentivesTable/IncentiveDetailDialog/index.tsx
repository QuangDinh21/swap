import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gu-corp/gu-ui';
import { renderBalance } from '../../../../utils/render';
import type { IncentiveKey } from '../../../../types';
import { formatDate } from '../../../../utils/common';
import { useTranslation } from 'react-i18next';

interface Props {
  incentive: IncentiveKey;
  open: boolean;
  onClose: () => void;
}

const IncentiveDetailDialog = ({ incentive, open, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[423px] rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="font-geist text-left font-bold text-[18px] leading-[100%] tracking-[-0.03em] text-[#0A0A0A]">
            {t('incentives.incentiveDetail.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className="text-slate-600">
                {t('incentives.incentiveDetail.rewardAmount')}:
              </span>
              <p className="font-semibold text-slate-900">
                {renderBalance(incentive.reward, { decimals: 18 })} JOCX
              </p>
            </div>
            <div>
              <span className="text-slate-600">{t('incentives.incentiveDetail.duration')}:</span>
              <p className="font-semibold text-slate-900">
                {formatDate(incentive.startTime)} - {formatDate(incentive.endTime)}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <h5 className="font-semibold text-slate-900 mb-2">
                {t('incentives.incentiveDetail.incentiveKeyForStaking')}:
              </h5>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-600">
                    {t('incentives.incentiveDetail.rewardToken')}:
                  </span>
                  <p className="font-mono text-slate-900 break-all">{incentive.rewardToken}</p>
                </div>
                <div>
                  <span className="text-slate-600">{t('incentives.incentiveDetail.pool')}:</span>
                  <p className="font-mono text-slate-900 break-all">{incentive.pool}</p>
                </div>
                <div>
                  <span className="text-slate-600">
                    {t('incentives.incentiveDetail.startTime')}:
                  </span>
                  <p className="font-mono text-slate-900">{incentive.startTime.toString()}</p>
                </div>
                <div>
                  <span className="text-slate-600">{t('incentives.incentiveDetail.endTime')}:</span>
                  <p className="font-mono text-slate-900">{incentive.endTime.toString()}</p>
                </div>
                <div>
                  <span className="text-slate-600">
                    {t('incentives.incentiveDetail.refundee')}:
                  </span>
                  <p className="font-mono text-slate-900 break-all">{incentive.refundee}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t('common.close')}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncentiveDetailDialog;
