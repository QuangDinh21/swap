import { useState, useCallback } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { parseUnits } from 'viem';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useUserPositions } from '@/hooks/useUserPositions';
import { CONTRACTS, JOCX, POOL_CONFIG, USDT } from '@/config/constants';
import { usePoolData } from '@/hooks/usePoolData';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  TokenInput,
  ToggleGroup,
  Select,
  RealTokenIcon,
  PlusIcon,
  WalletIcon,
} from '@/components/ui';
import { toast } from 'sonner';
import { switchChain } from 'wagmi/actions';
import { chain } from '@/config/wagmi';
import { useErc20 } from '@/hooks/useErc20';
import { Step } from '@/types';
import { usePositionManager } from '@/hooks/usePositionManager';
import SubmitProgress from '../OneClickFlow/SubmitProgress';
import { advancedSteps } from '@/config/steps';
import {
  calculatePositionValue,
  createPool,
  createPosition,
} from '@/utils/uniswapUtils';
import { renderBalance } from '@/utils/render.util';

interface LiquidityProviderProps {
  onLiquidityAdded: () => void;
}

export function LiquidityProvider({
  onLiquidityAdded,
}: LiquidityProviderProps) {
  const { address, chainId } = useAccount();
  const [jocxAmount, setJocxAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [liquidityMode, setLiquidityMode] = useState<'new' | 'existing'>('new');
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [loading, setLoading] = useState(false);
  const wagmiConfig = useConfig();

  const poolData = usePoolData();
  const { positions } = useUserPositions();

  const { balance: jocxBalance } = useTokenBalance(CONTRACTS.JOCX_TOKEN);
  const { balance: usdtBalance } = useTokenBalance(CONTRACTS.USDT_TOKEN);
  const usdt = useErc20(USDT.address);
  const jocx = useErc20(JOCX.address);
  const positionManager = usePositionManager();
  const processNextStep = useCallback(() => {
    setSteps((prevSteps) => {
      // Create a deep copy of the steps array to avoid mutation
      const newSteps = prevSteps.map((step) => ({ ...step }));

      const currentStepIndex = newSteps.findIndex(
        (step) => step.status === 'in-progress'
      );
      if (currentStepIndex !== -1) {
        newSteps[currentStepIndex].status = 'completed';
      }

      const nextStepIndex = newSteps.findIndex(
        (step) => step.status === 'waiting'
      );
      if (nextStepIndex !== -1) {
        newSteps[nextStepIndex].status = 'in-progress';
      }

      return newSteps; // Return new array reference
    });
  }, []);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    try {
      if (chainId !== chain.id) {
        await switchChain(wagmiConfig, { chainId: chain.id });
      }
      // Approve USDT Position Manager
      setSteps(advancedSteps);
      processNextStep();
      const usdtAmountBig = parseUnits(usdtAmount, USDT.decimals);
      await usdt.approveIfNeeded(
        CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
        usdtAmountBig
      );

      // Approve JOCX Position Manager
      processNextStep();
      const jocxAmountBig = parseUnits(jocxAmount, JOCX.decimals);
      await jocx.approveIfNeeded(
        CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
        jocxAmountBig
      );

      // Add Liquidity
      processNextStep();
      if (liquidityMode === 'new') {
        // Mint new position
        await positionManager.mintUsdtJocxPool({
          amount0Desired: usdtAmountBig,
          amount1Desired: jocxAmountBig,
        });
      } else {
        // Add to existing position
        await positionManager.increaseUsdtJocxPool({
          tokenId: BigInt(selectedPositionId),
          amount0Desired: usdtAmountBig,
          amount1Desired: jocxAmountBig,
        });
      }

      processNextStep();
      toast.info('Liquidity added successfully!');
      onLiquidityAdded?.();
    } catch (error: any) {
      toast.error(error.shortMessage || 'Failed the flow. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    chainId,
    wagmiConfig,
    jocxAmount,
    usdtAmount,
    usdt,
    jocx,
    positionManager,
    selectedPositionId,
    liquidityMode,
    processNextStep,
    onLiquidityAdded,
  ]);

  // Convert positions to select options
  const positionOptions = positions.map((position) => {
    let positionValue = 0;

    try {
      // Only calculate accurately if position matches the configured pool fee tier
      if (
        position.fee === POOL_CONFIG.JOCX_USDT_FEE &&
        poolData.sqrtPriceX96 &&
        poolData.liquidity
      ) {
        const pool = createPool(
          poolData.sqrtPriceX96,
          poolData.liquidity,
          poolData.tick
        );

        const sdkPosition = createPosition(
          pool,
          position.tickLower,
          position.tickUpper,
          position.liquidity
        );

        if (sdkPosition) {
          positionValue = calculatePositionValue(
            sdkPosition,
            poolData.jocxPrice
          );
        } else {
          // Fallback
          positionValue =
            (poolData.tvl * Number(position.liquidity)) /
            Number(poolData.liquidity);
        }
      } else {
        // Fallback for different fee tiers
        positionValue =
          (poolData.tvl * Number(position.liquidity)) /
          Number(poolData.liquidity);
      }
    } catch (error) {
      positionValue =
        (poolData.tvl * Number(position.liquidity)) /
        Number(poolData.liquidity);
    }

    return {
      value: position.tokenId,
      label: `Position #${position.tokenId}`,
      description: `Fee: ${(position.fee / 10000).toFixed(
        2
      )}% • Value: $${positionValue.toFixed(2)}`,
    };
  });

  // Toggle options for liquidity mode
  const liquidityModeOptions = [
    {
      value: 'new',
      label: 'New Position',
      description: 'Create new LP NFT',
      icon: <PlusIcon className="w-4 h-4" />,
    },
    {
      value: 'existing',
      label: 'Add to Existing',
      description: 'Add to existing position',
      icon: <WalletIcon className="w-4 h-4" />,
      disabled: positions.length === 0,
    },
  ];

  const handleUsdtAmountChange = useCallback((value: string) => {
    const usdtAmount = value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${USDT.decimals}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal

    setUsdtAmount(usdtAmount);
    if (Number.isNaN(value)) {
      setJocxAmount('0');
      return;
    }
    const amount = (Number(value) / poolData.jocxPrice)
    const amountToBigint = parseUnits(amount.toFixed(JOCX.decimals), JOCX.decimals)
    const toJocxAmount = renderBalance(amountToBigint, { decimals: JOCX.decimals })
    setJocxAmount(toJocxAmount);
  }, [poolData.jocxPrice]);

  const handleJocxAmountChange = useCallback((value: string) => {
    const jocxAmount = value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${JOCX.decimals}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal

    setJocxAmount(jocxAmount);
    const price = poolData?.jocxPrice;
    if (!price) {
      setUsdtAmount('0');
      return;
    }

    const amount = Number(value) * price;
    if (Number.isNaN(amount)) {
      setUsdtAmount('0');
      return;
    }
    setUsdtAmount(renderBalance(parseUnits(amount.toFixed(USDT.decimals), USDT.decimals), { decimals: USDT.decimals }));
  }, [poolData?.jocxPrice]);

  return (
    <Card glow>
      <CardHeader
        icon={<PlusIcon className="w-5 h-5 text-white" />}
        title="Add Liquidity"
        subtitle="Provide liquidity to earn fees and rewards"
      />

      <CardContent>
        <ToggleGroup
          label="Liquidity Mode"
          options={liquidityModeOptions}
          value={liquidityMode}
          onValueChange={(value) => {
            setLiquidityMode(value as 'new' | 'existing');
            if (value === 'new') {
              setSelectedPositionId('');
            }
          }}
        />

        {/* Position Selector for Existing Mode */}
        {liquidityMode === 'existing' && positions.length > 0 && (
          <Select
            label="Select Position"
            options={positionOptions}
            value={selectedPositionId}
            onValueChange={setSelectedPositionId}
            placeholder="Choose a position..."
          />
        )}

        {/* USDT Amount */}
        <TokenInput
          label="USDT Amount"
          tokenSymbol="USDT"
          tokenDecimals={USDT.decimals}
          tokenIcon={
            <RealTokenIcon
              symbol="USDT"
              fallbackGradient="from-green-500 to-green-600"
              className="w-6 h-6"
            />
          }
          value={usdtAmount}
          onChange={(e) => handleUsdtAmountChange(e.target.value)}
          balance={usdtBalance}
          onMaxClick={() => handleUsdtAmountChange(usdtBalance)}
          usdValue={usdtAmount}
        />

        {/* JOCX Amount */}
        <TokenInput
          label="JOCX Amount"
          tokenSymbol="JOCX"
          tokenDecimals={JOCX.decimals}
          tokenIcon={
            <RealTokenIcon
              symbol="JOCX"
              fallbackGradient="from-blue-500 to-blue-600"
              className="w-6 h-6"
            />
          }
          value={jocxAmount}
          onChange={(e) => handleJocxAmountChange(e.target.value)}
          balance={jocxBalance}
          onMaxClick={() => handleJocxAmountChange(jocxBalance)}
          usdValue={usdtAmount}
        />

        <Button
          onClick={onSubmit}
          disabled={
            !address ||
            !jocxAmount || jocxAmount === '0' ||
            !usdtAmount || usdtAmount === '0' ||
            (liquidityMode === 'existing' && !selectedPositionId)
          }
          loading={loading}
          className="w-full text-lg py-4"
        >
          {loading ? 'Processing...' : 'Add Liquidity'}
        </Button>
        {!!steps.length && <SubmitProgress steps={steps} />}
      </CardContent>
    </Card>
  );
}
