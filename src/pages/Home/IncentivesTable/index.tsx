import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useDataTable,
} from '@gu-corp/gu-ui';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarX, Info, Loader2, MoreVertical, Plus } from 'lucide-react';
import type { IncentiveKey } from '../../../types';
import {
  formatDate,
  formatDateToMMDDYYYY,
  formatLongAddress,
  getIncentiveStatus,
} from '../../../utils/common';
import { useReadContracts } from 'wagmi';
import {
  CHAIN_ID_TO_NETWORK_ICON,
  POOL_CONFIG,
  SUPPORTED_PAIRS,
} from '../../../consts/pool-config';
import IncentiveStatusBadge from './IncentiveStatusBadge';
import { PoolPairIcon } from './PoolPairIcon';
import {
  IncentiveInfo_OrderBy,
  OrderDirection,
  useListIncentivesQuery,
} from '../../../graphql/uni-v3-staker-subgraph/types';
import EndIncentiveDialog from './EndIncentiveDialog';
import { useReadUniswapV3FactoryGetPool, uniswapV3StakerAbi } from '../../../wagmi/generated';
import IncentiveDetailDialog from './IncentiveDetailDialog';
import AddIncentiveDialog from './AddIncentiveDialog';
import { useTranslation } from 'react-i18next';
import { renderBalance } from '../../../utils/render';

const DEFAULT_PAGE_SIZE = 10;

const IncentivesTable = () => {
  const { t } = useTranslation();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [incentives, setIncentives] = useState<IncentiveKey[]>([]);
  const [selectedItem, setSelectedItem] = useState<IncentiveKey | null>(null);
  const [openIncentiveDetailDialog, setOpenIncentiveDetailDialog] = useState(false);
  const [openEndIncentiveDialog, setOpenEndIncentiveDialog] = useState(false);
  const [openAddIncentiveDialog, setOpenAddIncentiveDialog] = useState(false);
  const selectedPair = SUPPORTED_PAIRS[0];

  const onOpenIncentiveDetailDialog = useCallback(
    (incentive: IncentiveKey) => {
      setOpenIncentiveDetailDialog(true);
      setSelectedItem(incentive);
    },
    [setSelectedItem],
  );

  const onCloseIncentiveDetailDialog = useCallback(() => {
    setOpenIncentiveDetailDialog(false);
    setSelectedItem(null);
  }, []);

  const onOpenEndIncentiveDialog = useCallback((incentive: IncentiveKey) => {
    setOpenEndIncentiveDialog(true);
    setSelectedItem(incentive);
  }, []);

  const onCloseEndIncentiveDialog = useCallback(() => {
    setOpenEndIncentiveDialog(false);
    setSelectedItem(null);
  }, []);

  const onOpenAddIncentiveDialog = useCallback(() => {
    setOpenAddIncentiveDialog(true);
  }, []);

  const onCloseAddIncentiveDialog = useCallback(() => {
    setOpenAddIncentiveDialog(false);
  }, []);

  const columns: ColumnDef<IncentiveKey>[] = useMemo(
    () => [
      {
        header: () => (
          <div className="font-medium text-sm leading-[24px] tracking-normal text-muted-foreground">
            {t('incentives.id')}
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="max-w-25">
              <Tooltip>
                <TooltipTrigger asChild className="">
                  <div className="font-normal text-sm leading-5 tracking-normal text-[#0A0A0A] overflow-hidden text-ellipsis whitespace-nowrap">
                    {formatLongAddress(item?.id || '', 5, 5)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{item?.id}</TooltipContent>
              </Tooltip>
            </div>
          );
        },
        accessorKey: 'incentiveId',
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: () => (
          <div className="font-medium text-sm leading-[24px] tracking-normal text-muted-foreground">
            {t('incentives.pool')}
          </div>
        ),
        accessorKey: 'pool',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="max-w-30">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <PoolPairIcon
                      tokenA={selectedPair.tokenA.logoPath}
                      tokenB={selectedPair.tokenB.logoPath}
                      size="sm"
                      scaleA={1.25}
                      scaleB={1}
                      badgeIcon={CHAIN_ID_TO_NETWORK_ICON[selectedPair.tokenA.chainId]}
                    />

                    <div className="font-normal text-sm leading-5 tracking-normal text-[#0A0A0A] overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedPair.tokenA.name}/{selectedPair.tokenB.name}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{item.pool}</TooltipContent>
              </Tooltip>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: () => (
          <div className="font-medium text-sm leading-[24px] tracking-normal text-muted-foreground">
            {t('incentives.status')}
          </div>
        ),
        accessorKey: 'status',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="max-w-25">
              <div className="flex items-center gap-2">
                <div className="font-normal text-sm leading-5 tracking-normal text-[#0A0A0A] overflow-hidden text-ellipsis whitespace-nowrap">
                  <IncentiveStatusBadge incentive={item} />
                </div>
              </div>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: () => (
          <div className="font-medium text-sm leading-[24px] tracking-normal text-muted-foreground">
            {t('incentives.reward')}
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="max-w-50">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <div className="font-normal text-sm leading-5 tracking-normal text-[#0A0A0A] overflow-hidden text-ellipsis whitespace-nowrap">
                      {renderBalance(item.reward, { decimals: selectedPair.tokenA.decimals })}{' '}
                      {selectedPair.tokenA.symbol}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {renderBalance(item.reward, { decimals: selectedPair.tokenA.decimals })}{' '}
                  {selectedPair.tokenA.symbol}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
        accessorKey: 'amount',
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: () => (
          <div className="font-medium text-sm leading-[24px] tracking-normal text-muted-foreground">
            {t('incentives.refundeeAddress')}
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="max-w-25">
              <Tooltip>
                <TooltipTrigger asChild className="">
                  <div className="font-normal text-sm leading-5 tracking-normal text-[#0A0A0A] overflow-hidden text-ellipsis whitespace-nowrap">
                    {formatLongAddress(item?.refundee || '', 5, 5)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{item?.refundee}</TooltipContent>
              </Tooltip>
            </div>
          );
        },
        accessorKey: 'refundeeAddress',
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'duration',
        header: () => (
          <div className="w-full flex justify-end text-muted-foreground">
            {<span>{t('incentives.duration')}</span>}
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-between items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="font-normal text-sm leading-5 tracking-normal text-foreground max-w-100 overflow-hidden text-ellipsis whitespace-nowrap">
                    {`${formatDateToMMDDYYYY(item.startTime)} - ${formatDateToMMDDYYYY(item.endTime)}`}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{`${formatDate(item.startTime)} - ${formatDate(item.endTime)}`}</TooltipContent>
              </Tooltip>
              <div className="max-w-[68px]! text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onOpenIncentiveDetailDialog(item)}
                    >
                      <Info className="h-4 w-4" />
                      <span className="font-[400] text-sm leading-5 tracking-normal">
                        {t('incentives.detail')}
                      </span>
                    </DropdownMenuItem>
                    {getIncentiveStatus(item) === 'READY_TO_END' && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onOpenEndIncentiveDialog(item)}
                      >
                        <CalendarX className="h-4 w-4" />
                        <span className="font-[400] text-sm leading-5 tracking-normal">
                          {t('incentives.endIncentive.title')}
                        </span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: false,
      },
    ],
    [onOpenIncentiveDetailDialog, onOpenEndIncentiveDialog, t, selectedPair],
  );

  const { table } = useDataTable({
    data: incentives,
    columns,
    pageCount: -1,
    initialState: {
      sorting: [],
      pagination: {
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
    state: {
      hasNextPage: hasNextPage,
    },
    enableRowSelection: false,
    enableExpanding: false,
  });

  const state = table.getState();

  const { data: poolAddress, isLoading: loadingPoolAddress } = useReadUniswapV3FactoryGetPool({
    address: import.meta.env.VITE_PUBLIC_UNISWAP_V3_FACTORY_ADDRESS as `0x${string}`,
    args: [
      selectedPair.tokenA.address as `0x${string}`,
      selectedPair.tokenB.address as `0x${string}`,
      POOL_CONFIG.FEE_TIER,
    ],
  });

  const {
    data: incentivesData,
    loading: loadingIncentives,
    refetch: refetchIncentives,
  } = useListIncentivesQuery({
    variables: {
      pool: poolAddress as `0x${string}`,
      skip: state.pagination.pageIndex * state.pagination.pageSize,
      first: state.pagination.pageSize,
      orderBy: state.sorting.length > 0 ? IncentiveInfo_OrderBy.EndTime : undefined,
      orderDirection:
        state.sorting.length > 0
          ? state.sorting[0].desc
            ? OrderDirection.Desc
            : OrderDirection.Asc
          : undefined,
    },
    skip: !poolAddress,
    fetchPolicy: 'network-only',
  });

  const onFinish = useCallback(async () => {
    table.setPageIndex(0);
    table.setSorting([{ id: 'duration', desc: true }]);
    refetchIncentives();
  }, [refetchIncentives, table]);

  const onUpdateIncentive = useCallback(
    (incentive: IncentiveKey) => {
      console.log('onUpdateIncentive', incentive);
      setIncentives((prevIncentives) =>
        prevIncentives.map((i) => (i.id === incentive.id ? incentive : i)),
      );
    },
    [setIncentives],
  );

  const stakerContracts =
    incentivesData?.incentiveInfos?.map((incentive: any) => ({
      address: import.meta.env.VITE_PUBLIC_UNISWAP_V3_STAKER_ADDRESS as `0x${string}`,
      abi: uniswapV3StakerAbi,
      functionName: 'incentives' as const,
      args: [incentive.id as `0x${string}`],
    })) || [];

  const { data: incentivesInfoData, isPending: isLoadingIncentivesInfo } = useReadContracts({
    contracts: stakerContracts,
    query: {
      enabled: stakerContracts.length > 0,
    },
  });

  useEffect(() => {
    if (
      loadingIncentives ||
      isLoadingIncentivesInfo ||
      incentivesData?.incentiveInfos === undefined ||
      !incentivesInfoData
    ) {
      return;
    }

    if (incentivesData?.incentiveInfos.length === 0 && state.pagination.pageIndex > 0) {
      table.setPageIndex((page) => page - 1);
      setHasNextPage(false);
      return;
    }

    // Check if list have item remain to disable button next page
    if (incentivesData?.incentiveInfos.length < state.pagination.pageSize) {
      setHasNextPage(false);
    } else {
      setHasNextPage(true);
    }

    const tempIncentives: IncentiveKey[] = incentivesData?.incentiveInfos.map(
      (i: any, index: number) => {
        const [totalRewardUnclaimed, , numberOfStakes] = incentivesInfoData[index].result as any;
        return {
          id: i.id,
          rewardToken: i.rewardToken,
          pool: i.pool,
          startTime: BigInt(i.startTime),
          endTime: BigInt(i.endTime),
          refundee: i.refundee,
          reward: BigInt(i.reward),
          numberOfStakes: numberOfStakes,
          totalRewardUnclaimed: totalRewardUnclaimed,
        };
      },
    );

    setIncentives(tempIncentives);
  }, [
    state.pagination.pageIndex,
    state.pagination.pageSize,
    table,
    incentivesData?.incentiveInfos,
    incentivesInfoData,
    loadingIncentives,
    isLoadingIncentivesInfo,
  ]);

  // Reset maxPage when change filter
  useEffect(() => {
    table.setPageIndex(0);
  }, [table]);

  if (incentivesData?.incentiveInfos.length === 0) {
    return (
      <div className="mt-6 text-center py-8 border border-gray-200 rounded-md">
        {t('incentives.noIncentivesFound')}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('incentives.title')}</h2>
          <Button size="sm" onClick={onOpenAddIncentiveDialog} disabled={loadingPoolAddress}>
            {loadingPoolAddress ? <Loader2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{t('incentives.addIncentive.title')}</span>
          </Button>
        </div>
        <DataTable
          className="mt-6"
          table={table}
          loading={loadingIncentives || isLoadingIncentivesInfo}
          loadingCellSkeletonHeight={32}
        />
      </div>
      {selectedItem && (
        <IncentiveDetailDialog
          incentive={selectedItem}
          open={openIncentiveDetailDialog}
          onClose={onCloseIncentiveDetailDialog}
        />
      )}
      {selectedItem && (
        <EndIncentiveDialog
          incentive={selectedItem}
          open={openEndIncentiveDialog}
          onClose={onCloseEndIncentiveDialog}
          onUpdateIncentive={onUpdateIncentive}
        />
      )}
      {poolAddress && (
        <AddIncentiveDialog
          poolAddress={poolAddress}
          pair={selectedPair}
          open={openAddIncentiveDialog}
          onClose={onCloseAddIncentiveDialog}
          onFinish={onFinish}
        />
      )}
    </>
  );
};

export default IncentivesTable;
