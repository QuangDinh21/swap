import React, { useCallback, useEffect, useState } from 'react';
import { keccak256, parseUnits } from 'ethers';
import { useAccount, useConfig } from 'wagmi';
import { switchChain } from 'wagmi/actions';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { ChevronDownIcon, InfoIcon } from '@/components/ui/Icons';
import {
  USDT,
  Token,
  CONTRACTS,
  USDC,
  ETH,
  JOCX,
  POOL_CONFIG,
} from '@/config/constants';
import { chain } from '@/config/wagmi';
import { ethSteps, usdcSteps, usdtSteps } from '@/config/steps';
import { useFlowBalances } from '@/hooks/useFlowBalances';
import { useFlowIncentives } from '@/hooks/useFlowIncentives';
import { useErc20 } from '@/hooks/useErc20';
import { useUniswapV3Router } from '@/hooks/useUniswapV3Router';
import { usePositionManager } from '@/hooks/usePositionManager';
import { calculateSlippageAmounts, encodePath } from '@/utils/uniswapUtils';
import { parsePMResult, parseSwapResult } from '@/utils/common';
import { getIncentiveKey } from '@/utils/common';
import TokenSelector from './TokenSelector';
import SubmitProgress from './SubmitProgress';
import IncentiveSelector from './IncentiveSelector';
import { IncentiveKey, Step } from '@/types';
import { useIncentiveAPR } from '@/hooks/useIncentiveApr';
import { renderBalance } from '@/utils/render.util';

interface OneClickFlowProps {
  onCompleted?: () => void;
  onIncentiveChange?: (incentive: IncentiveKey | undefined) => void;
}

export default function OneClickFlow({
  onCompleted,
  onIncentiveChange,
}: OneClickFlowProps) {
  const [selectedToken, setSelectedToken] = useState<Token>(USDT);
  const [amount, setAmount] = useState<string>('100');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
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
  const { address, chainId } = useAccount();
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const toggleTokenSelector = useCallback(() => {
    setShowTokenSelector(!showTokenSelector);
  }, [showTokenSelector]);
  const balances = useFlowBalances();
  const incentives = useFlowIncentives();
  const wagmiConfig = useConfig();

  const { jocxPrice } = incentives.poolData;
  const { usdtBalance, usdcBalance, ethBalance } = balances;
  const currentBalance =
    selectedToken.symbol === 'USDT'
      ? usdtBalance
      : selectedToken.symbol === 'USDC'
      ? usdcBalance
      : ethBalance;
  const { hasEnoughUsdt, hasEnoughUsdc, hasEnoughEth } = balances;

  // Check if primary button should be disabled
  const primaryDisabled =
    !address ||
    !incentives.selectedIncentive ||
    !amount ||
    Number(amount) <= 0 ||
    (selectedToken.symbol === 'USDT' && !hasEnoughUsdt(amount)) ||
    (selectedToken.symbol === 'USDC' && !hasEnoughUsdc(amount)) ||
    (selectedToken.symbol === 'ETH' && !hasEnoughEth(amount));

  // Notify parent component when incentive changes
  useEffect(() => {
    if (onIncentiveChange) {
      onIncentiveChange(incentives.selectedIncentive);
    }
  }, [incentives.selectedIncentive, onIncentiveChange]);

  const getPlanText = () => {
    const halfAmount = Math.max(0, Number(amount || '0') / 2);
    const estimatedJocx = halfAmount / jocxPrice;
    if (selectedToken.symbol === 'USDT') {
      return `Swap ${halfAmount.toFixed(2)} USDT → ${estimatedJocx.toFixed(
        4
      )} JOCX`;
    } else if (selectedToken.symbol === 'USDC') {
      return `Swap ${halfAmount.toFixed(
        2
      )} USDC → USDT + ${estimatedJocx.toFixed(4)} JOCX`;
    } else {
      return `Swap ${halfAmount.toFixed(6)} ETH → USDT + JOCX`;
    }
  };

  const onSelectToken = (token: Token) => {
    setAmount((prev) => {
      if(isNaN(Number(prev))) {
        return '';
      }
      if(selectedToken.decimals > token.decimals) {
        return Number(prev).toFixed(token.decimals);
      }
      return prev;
    });
    setSelectedToken(token);
    setShowTokenSelector(false);
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${selectedToken.decimals}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
    setAmount(amount);
  };

  const onMaxClick = () => {
    if (currentBalance) {
      setAmount(currentBalance);
    }
  };

  const usdt = useErc20(USDT.address);
  const usdc = useErc20(USDC.address);
  const jocx = useErc20(JOCX.address);
  const uniswapV3Router = useUniswapV3Router();
  const positionManager = usePositionManager();

  const onSubmit = useCallback(async () => {
    setLoading(true);
    try {
      if (chainId !== chain.id) {
        await switchChain(wagmiConfig, { chainId: chain.id });
      }

      if (selectedToken.symbol === ETH.symbol) {
        const halfAmount = Math.max(0, Number(amount || '0') / 2);
        const halfEthBig = parseUnits(
          halfAmount.toFixed(ETH.decimals),
          ETH.decimals
        );

        // Swap half of the amount to USDT
        setSteps(ethSteps);
        processNextStep();
        const pathEthToUsdt = encodePath(
          [CONTRACTS.WETH, CONTRACTS.USDT_TOKEN],
          [POOL_CONFIG.WETH_USDT_FEE]
        );
        const usdtSwapResult = await uniswapV3Router.exactInput({
          amountIn: halfEthBig,
          amountOutMinimum: BigInt(0),
          path: pathEthToUsdt,
          value: halfEthBig,
        });

        const usdtReceivedAmount = parseSwapResult(usdtSwapResult)!.amount;
        const pathEthToJocx = encodePath(
          [CONTRACTS.WETH, CONTRACTS.USDT_TOKEN, CONTRACTS.JOCX_TOKEN],
          [POOL_CONFIG.WETH_USDT_FEE, POOL_CONFIG.JOCX_USDT_FEE]
        );
        const jocxSwapResult = await uniswapV3Router.exactInput({
          amountIn: halfEthBig,
          amountOutMinimum: BigInt(0),
          path: pathEthToJocx,
          value: halfEthBig,
        });
        const jocxReceivedAmount = parseSwapResult(jocxSwapResult)!.amount;

        // Approve USDT & JOCX to Position Manager
        processNextStep();
        await usdt.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
          usdtReceivedAmount
        );
        await jocx.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
          jocxReceivedAmount
        );

        // Add Liquidity
        processNextStep();
        const addLiquidityResult = await positionManager.mintUsdtJocxPool({
          amount0Desired: usdtReceivedAmount,
          amount1Desired: jocxReceivedAmount,
        });
        const mintedTokenId = parsePMResult(addLiquidityResult);

        // Stake NFT
        processNextStep();
        await positionManager.safeTransferToStake({
          tokenId: BigInt(mintedTokenId!),
          data: getIncentiveKey(incentives.selectedIncentive),
        });
      } else if (selectedToken.symbol === USDT.symbol) {
        // Approve USDT to Router - Initialize steps with first one in progress
        setSteps(usdtSteps);
        processNextStep();

        const halfAmount = Math.max(0, Number(amount || '0') / 2);
        const halfUsdtBig = parseUnits(
          halfAmount.toFixed(USDT.decimals),
          USDT.decimals
        );
        await usdt.approveIfNeeded(CONTRACTS.UNISWAP_V3_ROUTER, halfUsdtBig);

        // Swap half of the amount to JOCX
        processNextStep();
        const estJocxOut =
          jocxPrice > 0
            ? parseUnits(
                (halfAmount / jocxPrice).toFixed(JOCX.decimals),
                JOCX.decimals
              )
            : BigInt(0);
        const minOut = calculateSlippageAmounts(estJocxOut, 20).min;
        const swapResult = await uniswapV3Router.exactInputSingle({
          amountIn: halfUsdtBig,
          amountOutMinimum: minOut,
          tokenIn: CONTRACTS.USDT_TOKEN,
          tokenOut: CONTRACTS.JOCX_TOKEN,
        });
        const jocxReceivedAmount = parseSwapResult(swapResult)!.amount;

        // Approve USDT & JOCX to Position Manager
        processNextStep();
        await usdt.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
          halfUsdtBig
        );
        await jocx.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
          jocxReceivedAmount
        );

        // Add Liquidity
        processNextStep();
        const addLiquidityResult = await positionManager.mintUsdtJocxPool({
          amount0Desired: halfUsdtBig,
          amount1Desired: jocxReceivedAmount,
        });
        const mintedTokenId = parsePMResult(addLiquidityResult);

        // Stake NFT
        processNextStep();
        await positionManager.safeTransferToStake({
          tokenId: BigInt(mintedTokenId!),
          data: getIncentiveKey(incentives.selectedIncentive),
        });
      } else if (selectedToken.symbol === USDC.symbol) {
        // Approve USDC to Router - Initialize steps with first one in progress
        setSteps(usdcSteps);
        processNextStep();

        const halfAmount = Math.max(0, Number(amount || '0') / 2);
        const halfUsdcBig = parseUnits(
          halfAmount.toFixed(USDC.decimals),
          USDC.decimals
        );
        await usdc.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_ROUTER,
          parseUnits(amount, USDC.decimals)
        );

        // Swap half of the amount to USDT
        processNextStep();
        const minUsdtOut = calculateSlippageAmounts(halfUsdcBig, 5).min;
        const pathUsdcToUsdt = encodePath(
          [CONTRACTS.USDC_TOKEN, CONTRACTS.USDT_TOKEN],
          [POOL_CONFIG.USDC_USDT_FEE]
        );
        const usdtSwapResult = await uniswapV3Router.exactInput({
          amountIn: halfUsdcBig,
          amountOutMinimum: minUsdtOut,
          path: pathUsdcToUsdt,
        });
        const usdtReceivedAmount = parseSwapResult(usdtSwapResult)!.amount;

        const estJocxOut =
          jocxPrice > 0
            ? parseUnits(
                (halfAmount / jocxPrice).toFixed(JOCX.decimals),
                JOCX.decimals
              )
            : BigInt(0);
        const minJocxOut = calculateSlippageAmounts(estJocxOut, 20).min;
        const pathUsdcToJocx = encodePath(
          [CONTRACTS.USDC_TOKEN, CONTRACTS.USDT_TOKEN, CONTRACTS.JOCX_TOKEN],
          [POOL_CONFIG.USDC_USDT_FEE, POOL_CONFIG.JOCX_USDT_FEE]
        );
        const jocxSwapResult = await uniswapV3Router.exactInput({
          amountIn: halfUsdcBig,
          amountOutMinimum: minJocxOut,
          path: pathUsdcToJocx,
        });
        const jocxReceivedAmount = parseSwapResult(jocxSwapResult)!.amount;

        // Approve USDT & JOCX to Position Manager
        processNextStep();
        await usdt.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
          usdtReceivedAmount
        );
        await jocx.approveIfNeeded(
          CONTRACTS.UNISWAP_V3_POSITION_MANAGER,
          jocxReceivedAmount
        );

        // Add Liquidity
        processNextStep();
        const addLiquidityResult = await positionManager.mintUsdtJocxPool({
          amount0Desired: usdtReceivedAmount,
          amount1Desired: jocxReceivedAmount,
        });
        const mintedTokenId = parsePMResult(addLiquidityResult);

        // Stake NFT
        processNextStep();
        await positionManager.safeTransferToStake({
          tokenId: BigInt(mintedTokenId!),
          data: getIncentiveKey(incentives.selectedIncentive),
        });
      }

      processNextStep();
      toast.info('Flow executed successfully!');
      onCompleted?.();
    } catch (error: any) {
      toast.error(error.shortMessage || 'Failed the flow. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    chainId,
    wagmiConfig,
    selectedToken,
    amount,
    usdt,
    usdc,
    jocx,
    uniswapV3Router,
    positionManager,
    incentives.selectedIncentive,
    jocxPrice,
    processNextStep,
    onCompleted,
  ]);

  return (
    <Card glow className="z-10">
      <CardHeader
        title="One-Click Flow"
        subtitle="Swap, add liquidity, and stake in a guided sequence"
        icon={<span className="text-xl">⚡</span>}
      />
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Merged Token Selection and Amount Input */}
            <Card variant="compact" className="p-4">
              <div className="space-y-4">
                {/* Token Selector Button */}
                <button
                  onClick={toggleTokenSelector}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200 border border-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedToken.logo}
                      alt={selectedToken.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">
                        {selectedToken.symbol}
                      </div>
                      <div className="text-sm text-slate-600">
                        {selectedToken.description}
                      </div>
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      showTokenSelector ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Token Options - Collapsible */}
                {showTokenSelector && (
                  <TokenSelector
                    selectedToken={selectedToken}
                    onSelect={onSelectToken}
                  />
                )}

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Total Amount ({selectedToken.symbol})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount || ''}
                      onChange={onAmountChange}
                      placeholder={`0.00 ${selectedToken.symbol}`}
                      className="w-full px-4 py-3 pr-16 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-lg font-medium"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onMaxClick}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1"
                    >
                      MAX
                    </Button>
                  </div>

                  {/* Balance Display */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">
                      Balance:{' '}
                      {renderBalance(parseUnits((currentBalance || '0'), selectedToken.decimals), { decimals: selectedToken.decimals })}{' '}
                      {selectedToken.symbol}
                    </span>
                    {selectedToken.symbol !== 'ETH' && amount && (
                      <span className="text-slate-600">
                        ≈ ${renderBalance(parseUnits(amount, selectedToken.decimals), { decimals: selectedToken.decimals })} USD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Plan Preview - Mobile Optimized */}
            {amount && (
              <Card
                variant="compact"
                className="p-4 bg-blue-50/80 border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <InfoIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-800 mb-1">
                      Transaction Plan
                    </div>
                    <div className="text-sm text-blue-700">{getPlanText()}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {/* JOCX Price: ${jocxPriceUi.toFixed(4)} */}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <IncentiveSelector
            incentives={incentives.createdIncentives}
            selectedIncentive={incentives.selectedIncentive}
            onIncentiveChange={incentives.setSelectedIncentive}
            poolData={incentives.poolData}
          />

          <div className="flex items-center justify-between text-sm"></div>

          <Button
            className="w-full text-lg py-4"
            onClick={onSubmit}
            disabled={primaryDisabled}
            loading={loading}
          >
            {loading ? 'Processing...' : 'Do it (Swap + LP + Stake)'}
          </Button>

          {!!steps.length && <SubmitProgress steps={steps} />}
        </div>
      </CardContent>
    </Card>
  );
}
