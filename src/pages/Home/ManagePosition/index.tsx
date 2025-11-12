import { useAccount, useConfig } from 'wagmi';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  LoadingState,
  EmptyState,
  Badge,
} from '@/components/ui';
import {
  CoinIcon,
  WalletIcon,
  InfoIcon,
  ExternalLinkIcon,
} from '@/components/ui/Icons';
import {
  formatDate,
  calculateIncentiveAPR,
  getIncentiveKey,
} from '@/utils/common';
import { useStakingData } from '@/hooks/useStakingData';
import { usePositionManagement } from '@/hooks/usePositionManagement';
import { useIncentiveStakingData } from '@/hooks/useIncentiveStakingData';
import { keccak256 } from 'ethers';
import { useDataRefetch } from '@/contexts/DataRefetchContext';
import { useStaker } from '@/hooks/useStaker';
import { usePositionManager } from '@/hooks/usePositionManager';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { switchChain } from 'wagmi/actions';
import { chain } from '@/config/wagmi';
import { useIncentiveAPR } from '@/hooks/useIncentiveApr';
import { IncentiveKey } from '@/types';

function IncentiveCard({
  incentive,
  poolData,
  isSelected,
  onSelect,
}: {
  incentive: any;
  poolData: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const reward = Number(incentive.reward) / 1e18;

  // Get staking data for this incentive to calculate correct APR
  const { totalStakedValue } = useIncentiveStakingData(
    keccak256(getIncentiveKey(incentive))
  );

  const apr = useIncentiveAPR(keccak256(getIncentiveKey(incentive)));

  return (
    <Card
      variant="compact"
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-300 bg-blue-50/80 shadow-md'
          : 'hover:border-slate-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 ">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="text-lg font-bold text-slate-900">
              {reward.toFixed(2)} JOCX
            </div>
            {Math.floor(new Date().getTime() / 1000) <= incentive.endTime ? (
              <Badge variant="info" className="text-xs">
                Live
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs">
                Ended
              </Badge>
            )}
          </div>
          <div className="text-sm text-slate-600 mb-2">
            APR: <span className="font-semibold text-green-600">{apr}%</span>
          </div>
          <div className="text-xs text-slate-500">
            {formatDate(incentive.startTime)} → {formatDate(incentive.endTime)}
          </div>
        </div>
      </div>
    </Card>
  );
}

function PositionCard({
  position,
  onSelect,
  isSelected,
  isStaked,
  onStake,
  isStaking = false,
}: {
  position: any;
  isStaked: boolean;
  onSelect: () => void;
  isSelected: boolean;
  showStakeButton?: boolean;
  onStake: () => void;
  isStaking: boolean;
}) {
  // Determine the correct Uniswap URL based on environment
  const isTestnet = process.env.REACT_APP_IS_TESTNET;
  const uniswapBaseUrl = 'https://app.uniswap.org/pools';
  const positionUrl = `${uniswapBaseUrl}/${position.value}`;

  return (
    <Card
      variant="compact"
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-300 bg-blue-50/80 shadow-md'
          : 'hover:border-slate-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className="text-sm font-semibold text-slate-900">
              Position #{position.value}
            </div>
            {!isTestnet && (
              <a
                href={positionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="View on Uniswap"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            )}

            <div
              className={`w-2 h-2 rounded-full ${
                isStaked ? 'bg-green-500' : 'bg-orange-500'
              }`}
            />
          </div>
          <div className="text-xs text-slate-600 mb-2">
            {position.description}
          </div>
          <Badge variant={isStaked ? 'success' : 'warning'} className="text-xs">
            {isStaked ? 'Earning Rewards' : 'Ready to Stake'}
          </Badge>
        </div>
        {!isStaked && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onStake?.();
            }}
            disabled={isStaking}
            loading={isStaking}
            className="ml-2"
          >
            Stake
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function ManagePosition() {
  const { address, chainId } = useAccount();
  const wagmiConfig = useConfig();
  const { triggerRefetchStakingData } = useDataRefetch();

  const [selectedIncentive, setSelectedIncentive] = useState<IncentiveKey>();
  // Use custom hooks for data and transaction management
  const {
    poolData,
    rewards,
    positions,
    stakedPositions,
    createdIncentives,
    loadingUserPositions,
    loadingStakeInfos,
    loadingIncentives,
    loadingUnstakedRewards,
    fetchUserPositions,
    fetchStakeInfos,
    fetchIncentives,
    fetchUnstakedRewards,
  } = useStakingData();

  const {
    selectedUserTokenId,
    stakedTokenId,
    setSelectedUserTokenId,
    setStakedTokenId,
    positionOptions,
    stakedPositionOptions,
    isSelectedPositionStaked,
    loadingStakedRewards,
    rewardInfo,
    fetchStakedRewards,
  } = usePositionManagement({
    positions,
    stakedPositions,
    selectedIncentive,
    poolData,
  });

  const handleTransactionSuccess = async (
    fetchStakeInfo?: boolean,
    fetchRewards?: boolean,
    fetchUserPosition?: boolean
  ) => {
    if (fetchStakeInfo) {
      await fetchStakeInfos(selectedIncentive);
    }
    if (fetchRewards) {
      await fetchUnstakedRewards();
      await fetchStakedRewards();
    }
    if (fetchUserPosition) {
      await fetchUserPositions();
    }
    triggerRefetchStakingData();
  };

  useEffect(() => {
    if (!poolData.poolAddress) {
      return;
    }
    const fetch = async () => {
      await fetchIncentives();
      await fetchStakeInfos(selectedIncentive);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolData.poolAddress]);

  const handleIncentiveSelected = async (incentive: IncentiveKey) => {
    setSelectedIncentive(incentive);
    await fetchStakeInfos(incentive);
  };

  const handleStakerPositionSelected = async (
    tokenId: string,
    isStaked: boolean
  ) => {
    setStakedTokenId(tokenId);
    if (isStaked) {
      await fetchStakedRewards();
    }
  };

  const handleUserPositionSelected = async (tokenId: string) => {
    setSelectedUserTokenId(tokenId);
  };

  const [isStaking, setIsStaking] = useState(false);
  const [isTransferStaking, setIsTransferStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { stakeToken, unstakeToken, claimReward, withdrawToken } = useStaker();
  const { safeTransferToStake } = usePositionManager();

  const checkChainId = async () => {
    if (chainId !== chain.id) {
      await switchChain(wagmiConfig, { chainId: chain.id });
    }
  };

  const handleTransferStake = async (tokenId: string) => {
    await checkChainId();

    if (!selectedIncentive) return;
    setSelectedUserTokenId(tokenId);

    setIsTransferStaking(true);
    try {
      await safeTransferToStake({
        tokenId: BigInt(tokenId!),
        data: getIncentiveKey(selectedIncentive),
      });
      toast.info('Position is staked successfully!');
      await handleTransactionSuccess(true, true, true);
    } catch (error: any) {
      toast.error(error.shortMessage || 'Failed to stake. Please try again.');
    } finally {
      setIsTransferStaking(false);
    }
  };

  const handleStake = async (tokenId: string) => {
    await checkChainId();

    if (!selectedIncentive) return;
    setStakedTokenId(tokenId);

    setIsStaking(true);
    try {
      await stakeToken({
        key: selectedIncentive,
        tokenId: BigInt(tokenId),
      });
      toast.info('Position is staked successfully!');
      await handleTransactionSuccess(true, true, false);
    } catch (error: any) {
      toast.error(error.shortMessage || 'Failed to stake. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async (tokenId: string) => {
    await checkChainId();

    if (!selectedIncentive) return;
    setSelectedUserTokenId(tokenId);

    setIsUnstaking(true);
    try {
      await unstakeToken({
        key: selectedIncentive,
        tokenId: BigInt(tokenId),
      });
      toast.info('Position is unstaked successfully!');
      await handleTransactionSuccess(true, true, false);
    } catch (error: any) {
      toast.error(error.shortMessage || 'Failed to unstake. Please try again.');
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    await checkChainId();

    setIsClaiming(true);
    try {
      await claimReward();
      toast.info('Rewards are claimed successfully!');
      await handleTransactionSuccess(false, true, false);
    } catch (error: any) {
      toast.error(error.shortMessage || 'Failed to claim. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleWithdraw = async (tokenId: string) => {
    await checkChainId();

    setIsWithdrawing(true);
    try {
      await withdrawToken({
        tokenId: BigInt(tokenId),
      });
      toast.info('Position is withdrawn successfully!');
      await handleTransactionSuccess(true, true, true);
    } catch (error: any) {
      toast.error(
        error.shortMessage || 'Failed to withdraw. Please try again.'
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Incentive Selection */}
        <Card glow>
          <CardHeader
            icon={<CoinIcon className="w-5 h-5 text-white" />}
            title="Select Incentive"
            subtitle={`${createdIncentives.length} incentive${
              createdIncentives.length !== 1 ? 's' : ''
            } available`}
          />
          <CardContent>
            {createdIncentives.length === 0 ? (
              <EmptyState
                icon={<InfoIcon className="w-8 h-8 text-gray-400" />}
                title="No Incentive Programs"
                subtitle={
                  'There are currently no active incentive programs available'
                }
              />
            ) : (
              <div className="space-y-3">
                {loadingIncentives ? (
                  <LoadingState
                    title="Loading Incentives..."
                    subtitle="Fetching incentives"
                  />
                ) : (
                  createdIncentives.map((incentive, idx) => (
                    <IncentiveCard
                      key={incentive.id || idx}
                      incentive={incentive}
                      poolData={poolData}
                      isSelected={selectedIncentive?.id === incentive.id}
                      onSelect={() => handleIncentiveSelected(incentive)}
                    />
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stake Positions */}
        {selectedIncentive && (
          <Card glow>
            <CardHeader
              icon={<WalletIcon className="w-5 h-5 text-white" />}
              title="Liquidity Position"
              subtitle="Select positions to stake and earn rewards"
            />
            <CardContent>
              {loadingUserPositions ? (
                <LoadingState
                  title="Loading Positions..."
                  subtitle="Fetching your liquidity positions"
                />
              ) : positions.length === 0 ? (
                <EmptyState
                  title="No Liquidity Positions"
                  subtitle="Add liquidity first to start earning staking rewards"
                  action={
                    <Badge variant="info" className="inline-flex items-center">
                      <InfoIcon className="w-4 h-4 mr-2" />
                      Switch to "Add Liquidity" tab
                    </Badge>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {positionOptions.map((position) => {
                    const positionId = position.value;

                    return (
                      <PositionCard
                        key={position.value}
                        position={position}
                        isStaked={false}
                        isSelected={selectedUserTokenId === position.value}
                        onSelect={() =>
                          handleUserPositionSelected(position.value)
                        }
                        onStake={() => handleTransferStake(positionId)}
                        isStaking={
                          isTransferStaking &&
                          selectedUserTokenId === positionId
                        }
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {/* Auto-display staked positions */}
        <Card glow>
          <CardHeader
            icon={<CoinIcon className="w-5 h-5 text-white" />}
            title="Deposited Positions"
            subtitle="Manage your staked positions and claim rewards"
          />
          <CardContent>
            {loadingStakeInfos ? (
              <LoadingState
                title="Loading positions..."
                subtitle="Fetching positions"
              />
            ) : stakedPositionOptions.length === 0 ? (
              <EmptyState
                icon={<InfoIcon className="w-8 h-8 text-gray-400" />}
                title="No Deposited Positions"
                subtitle="Stake some positions to start earning rewards"
              />
            ) : (
              <div className="space-y-4">
                {/* Deposited Positions List */}
                <div className="space-y-3">
                  {stakedPositionOptions.map((position) => {
                    const isStaked = position.label.includes('Staked');
                    const positionId = position.value;

                    return (
                      <PositionCard
                        key={position.value}
                        position={position}
                        isStaked={isStaked}
                        isSelected={stakedTokenId === position.value}
                        onSelect={() =>
                          handleStakerPositionSelected(position.value, isStaked)
                        }
                        onStake={() => handleStake(positionId)}
                        isStaking={isStaking && stakedTokenId === positionId}
                      />
                    );
                  })}
                </div>

                {/* Position Actions */}
                {stakedTokenId && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    {/* Rewards Display */}
                    <Card
                      variant="stat"
                      className="bg-gradient-to-br from-amber-50/80 to-amber-50/80 border-amber-200/50"
                    >
                      <div className="text-center">
                        <p className="text-sm text-amber-600 font-medium mb-1">
                          {isSelectedPositionStaked
                            ? 'Claimable Rewards'
                            : 'Total Rewards'}
                        </p>
                        <p className="text-2xl font-bold text-amber-700">
                          {loadingStakedRewards || loadingUnstakedRewards
                            ? 'Loading...'
                            : (stakedTokenId &&
                              isSelectedPositionStaked &&
                              rewardInfo
                                ? (Number(rewardInfo[0]) / 1e18).toFixed(6)
                                : parseFloat(rewards).toFixed(6)) + ' JOCX'}
                        </p>
                        {stakedTokenId && !isSelectedPositionStaked && (
                          <p className="text-xs text-amber-600 mt-1">
                            Position must be unstaked to claim rewards
                          </p>
                        )}
                      </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => handleUnstake(stakedTokenId)}
                        disabled={
                          !address ||
                          !stakedTokenId ||
                          isUnstaking ||
                          !isSelectedPositionStaked
                        }
                        loading={isUnstaking}
                        className="w-full py-3"
                      >
                        {isUnstaking ? 'Unstaking...' : 'Unstake Position'}
                      </Button>

                      <Button
                        onClick={handleClaimRewards}
                        disabled={
                          !address ||
                          !stakedTokenId ||
                          isSelectedPositionStaked ||
                          Number(rewardInfo) === 0 ||
                          parseFloat(rewards) === 0 ||
                          isClaiming ||
                          isWithdrawing
                        }
                        loading={isClaiming}
                        className="w-full py-3"
                      >
                        {isClaiming ? 'Claiming...' : 'Claim JOCX Rewards'}
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => handleWithdraw(stakedTokenId)}
                        disabled={
                          !address ||
                          !stakedTokenId ||
                          isWithdrawing ||
                          isUnstaking ||
                          isSelectedPositionStaked
                        }
                        loading={isWithdrawing}
                        className="w-full py-3"
                      >
                        {isWithdrawing ? 'Withdrawing...' : 'Withdraw NFT'}
                      </Button>
                    </div>

                    {/* Flow Information */}
                    <Card
                      variant="compact"
                      className="bg-blue-50/80 border-blue-200/50"
                    >
                      <div className="flex items-start space-x-3">
                        <InfoIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-2">
                            Staking Flow Guide
                          </p>
                          <div className="text-xs text-blue-700 space-y-1">
                            <p>
                              <strong>Staked:</strong> Earning rewards → Unstake
                              first
                            </p>
                            <p>
                              <strong>Unstaked:</strong> Claim rewards →
                              Withdraw NFT
                            </p>
                            <p className="mt-2 text-blue-600">
                              <strong>Flow:</strong> Stake → Unstake → Claim →
                              Withdraw
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
