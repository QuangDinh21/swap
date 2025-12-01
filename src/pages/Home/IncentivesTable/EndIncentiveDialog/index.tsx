import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gu-corp/gu-ui';
import type { IncentiveKey } from '../../../../types';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useListStakesQuery } from '../../../../graphql/uni-v3-staker-subgraph/types';
import { UnstakeItem } from './UnstakeItem';
import { useCallback, useState } from 'react';
import {
  readUniswapV3StakerIncentives,
  writeUniswapV3StakerEndIncentive,
  writeUniswapV3StakerUnstakeToken,
} from '../../../../wagmi/generated';
import { useAccount, useConfig } from 'wagmi';
import { chain } from '../../../../wagmi/config';
import { switchChain } from 'wagmi/actions';
import { toast } from 'sonner';
import { delay } from '../../../../utils/system';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTRACTS } from '../../../../consts/contracts';

const DEFAULT_PAGE_SIZE = 5;
const REFETCH_INCENTIVE_INFOS_DELAY = 15000;

interface Props {
  incentive: IncentiveKey;
  open: boolean;
  onClose: () => void;
  onUpdateIncentive: (incentive: IncentiveKey) => void;
}

const EndIncentiveDialog: React.FC<Props> = ({ incentive, open, onClose, onUpdateIncentive }) => {
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [selectedStake, setSelectedStake] = useState<any>(null);
  const wagmiConfig = useConfig();
  const { address, chainId } = useAccount();
  const [totalStakes, setTotalStakes] = useState(Number(incentive.numberOfStakes ?? 0n));
  const { t } = useTranslation();
  const {
    data: listStakesData,
    loading: isListStakesLoading,
    error: listStakesError,
    fetchMore,
    refetch: refetchListStakes,
  } = useListStakesQuery({
    variables: {
      incentiveId: incentive.id,
      skip: 0,
      first: DEFAULT_PAGE_SIZE,
    },
    fetchPolicy: 'network-only',
  });

  const refetchIncentiveNumberOfStakes = useCallback(async () => {
    const [, , numberOfStakes] = await readUniswapV3StakerIncentives(wagmiConfig, {
      address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
      args: [incentive.id as `0x${string}`],
    });

    setTotalStakes(Number(numberOfStakes));
    const updatedIncentive: IncentiveKey = {
      ...incentive,
      numberOfStakes: numberOfStakes,
    };
    onUpdateIncentive(updatedIncentive);
  }, [incentive, wagmiConfig, onUpdateIncentive]);

  const refetchIncentiveTotalRewardUnclaimed = useCallback(async () => {
    const [totalRewardUnclaimed, ,] = await readUniswapV3StakerIncentives(wagmiConfig, {
      address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
      args: [incentive.id as `0x${string}`],
    });

    const updatedIncentive: IncentiveKey = {
      ...incentive,
      numberOfStakes: BigInt(totalStakes ?? 0),
      totalRewardUnclaimed: totalRewardUnclaimed,
    };
    onUpdateIncentive(updatedIncentive);
  }, [incentive, wagmiConfig, onUpdateIncentive, totalStakes]);

  const totalLoaded = listStakesData?.stakeInfos?.length ?? 0;
  const hasNextPage = totalLoaded < totalStakes;

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: isListStakesLoading,
    hasNextPage,
    onLoadMore: () => {
      fetchMore({
        variables: {
          incentiveId: incentive.id,
          skip: listStakesData?.stakeInfos?.length || 0,
          first: DEFAULT_PAGE_SIZE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          return {
            ...previousResult,
            stakeInfos: [
              ...(previousResult.stakeInfos || []),
              ...(fetchMoreResult.stakeInfos || []),
            ],
          };
        },
      });
    },
    disabled: Boolean(listStakesError),
    rootMargin: '0px 0px 400px 0px',
  });

  const handleEndIncentive = useCallback(async () => {
    if (!address) return;

    setIsEnding(true);
    try {
      if (chainId !== chain.id) {
        await switchChain(wagmiConfig, { chainId: chain.id });
      }

      await writeUniswapV3StakerEndIncentive(wagmiConfig, {
        address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
        args: [
          {
            rewardToken: incentive.rewardToken as `0x${string}`,
            pool: incentive.pool as `0x${string}`,
            startTime: incentive.startTime,
            endTime: incentive.endTime,
            refundee: incentive.refundee as `0x${string}`,
          },
        ],
      });

      await delay(REFETCH_INCENTIVE_INFOS_DELAY);
      toast.success(t('incentives.endIncentive.endedSuccessfully'));
      await refetchIncentiveTotalRewardUnclaimed();
      onClose();
    } catch (error) {
      console.error('End incentive failed:', error);
      toast.error(t('incentives.endIncentive.failedToEndIncentive'));
    } finally {
      setIsEnding(false);
    }
  }, [address, chainId, wagmiConfig, incentive, onClose, refetchIncentiveTotalRewardUnclaimed]);

  const handleUnstake = useCallback(
    async (tokenId: bigint) => {
      try {
        setIsUnstaking(true);
        setSelectedStake(tokenId);

        if (!incentive.id) return;

        await writeUniswapV3StakerUnstakeToken(wagmiConfig, {
          address: CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`,
          args: [
            {
              rewardToken: incentive.rewardToken as `0x${string}`,
              pool: incentive.pool as `0x${string}`,
              startTime: incentive.startTime,
              endTime: incentive.endTime,
              refundee: incentive.refundee as `0x${string}`,
            },
            tokenId,
          ],
        });

        await delay(REFETCH_INCENTIVE_INFOS_DELAY);
        await refetchIncentiveNumberOfStakes();
        toast.success(t('incentives.endIncentive.unstakedSuccessfully'));
        refetchListStakes();
      } catch (error) {
        console.error('Unstake failed:', error);
        toast.error(t('incentives.endIncentive.failedToUnstake'));
      } finally {
        setIsUnstaking(false);
        setSelectedStake(null);
      }
    },
    [incentive, wagmiConfig, refetchListStakes, refetchIncentiveNumberOfStakes],
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[423px] rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="font-geist text-left font-bold text-[18px] leading-[100%] tracking-[-0.03em] text-[#0A0A0A]">
            {t('incentives.endIncentive.title')}
          </DialogTitle>
          {totalStakes > 0 && (
            <DialogDescription className="text-left font-normal text-sm leading-5 tracking-normal text-[#737373]">
              {t('incentives.endIncentive.description', { numberOfStakes: totalStakes })}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="rounded-lg p-2">
          {totalStakes > 0 ? (
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2" ref={rootRef}>
                {(listStakesData?.stakeInfos || []).map((item) => (
                  <UnstakeItem
                    key={item.id}
                    stake={item}
                    onUnstake={handleUnstake}
                    isUnstaking={isUnstaking}
                    isSelected={selectedStake === item.tokenId}
                  />
                ))}

                {hasNextPage && !listStakesError && (
                  <div
                    ref={infiniteRef}
                    className="py-2 text-center text-sm text-gray-500 w-full flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}

                {listStakesError && (
                  <div className="py-2 text-center text-sm text-red-500">
                    {t('incentives.endIncentive.failedToLoadMorePositions')}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => refetchListStakes()}
                    >
                      {t('common.retry')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">
              {t('incentives.endIncentive.noStakes')}
            </div>
          )}
        </div>

        <DialogFooter className="sm:flex-col mt-6">
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t('incentives.endIncentive.cancel')}
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="default"
              onClick={handleEndIncentive}
              disabled={isEnding || isUnstaking || totalStakes > 0}
            >
              {isEnding && <Loader2 size="sm" className="animate-spin" />}
              {t('incentives.endIncentive.end')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndIncentiveDialog;
