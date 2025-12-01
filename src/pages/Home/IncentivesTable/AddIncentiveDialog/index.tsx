import { useCallback, useState, useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gu-corp/gu-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAccount, useBalance, useConfig } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { switchChain, waitForTransactionReceipt } from 'wagmi/actions';
import { chain } from '../../../../wagmi/config';
import {
  readErc20Allowance,
  writeErc20Approve,
  writeUniswapV3StakerCreateIncentive,
} from '../../../../wagmi/generated';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { renderBalance } from '../../../../utils/render';
import { useTranslation } from 'react-i18next';
import { delay } from '../../../../utils/system';
import { CONTRACTS } from '../../../../consts/contracts';

const REFETCH_INCENTIVES_DELAY = 15000;

interface Props {
  poolAddress: string;
  pair: any;
  open: boolean;
  onClose: () => void;
  onFinish: () => void;
}

const STAKER_ADDRESS = CONTRACTS.UNISWAP_V3_STAKER as `0x${string}`;

const AddIncentiveDialog = ({ poolAddress, open, onClose, onFinish, pair }: Props) => {
  const { t } = useTranslation();
  const { address, chainId } = useAccount();
  const wagmiConfig = useConfig();
  const [currentStep, setCurrentStep] = useState<'approve' | 'create'>('approve');
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const { tokenA } = pair;

  const addIncentiveSchema = yup.object({
    amount: yup
      .string()
      .required(t('incentives.addIncentive.notEmpty'))
      .test('positive', t('incentives.addIncentive.invalidAmount'), (value) => {
        if (!value) return false;
        const num = parseFloat(value);
        return num > 0;
      }),
    startTime: yup
      .string()
      .required(t('incentives.addIncentive.notEmpty'))
      .test('after-now', t('incentives.addIncentive.startTimeMustBeInTheFuture'), function (value) {
        if (!value) return true;
        return new Date(value).getTime() > Date.now();
      }),
    endTime: yup
      .string()
      .required(t('incentives.addIncentive.notEmpty'))
      .test(
        'after-start',
        t('incentives.addIncentive.endTimeMustBeAfterStartTime'),
        function (value) {
          const { startTime } = this.parent;
          if (!value || !startTime) return true;
          return new Date(value) > new Date(startTime);
        },
      ),
    refundee: yup
      .string()
      .optional()
      .test('valid-address', t('incentives.addIncentive.invalidAddress'), (value) => {
        if (!value || value === '') return true;
        return isAddress(value);
      }),
  }) as yup.ObjectSchema<{
    amount: string;
    startTime: string;
    endTime: string;
    refundee?: string;
  }>;

  type AddIncentiveFormValues = {
    amount: string;
    startTime: string;
    endTime: string;
    refundee?: string;
  };

  const form = useForm<AddIncentiveFormValues>({
    resolver: yupResolver(addIncentiveSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      amount: '',
      startTime: '',
      endTime: '',
      refundee: address || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const amount = form.watch('amount');
  const startTime = form.watch('startTime');
  const endTime = form.watch('endTime');
  const refundee = form.watch('refundee');

  const { data: tokenAData, refetch: refetchTokenAData } = useBalance({
    address,
    token: tokenA.address,
    chainId: tokenA.chainId,
  });

  const tokenABalance = tokenAData?.value || 0n;

  useEffect(() => {
    const fetchTokenAAllowance = async () => {
      const tokenAAllowance = await readErc20Allowance(wagmiConfig, {
        address: tokenA.address as `0x${string}`,
        args: [address as `0x${string}`, STAKER_ADDRESS as `0x${string}`],
      });
      setAllowance(tokenAAllowance);
    };
    fetchTokenAAllowance();
  }, [address, tokenA.address, wagmiConfig]);

  const needsApproval = Boolean(
    amount &&
      parseFloat(amount) > 0 &&
      allowance !== undefined &&
      allowance < parseUnits(amount, tokenA.decimals),
  );

  const handleRefundeeChange = useCallback(
    (value: string) => {
      form.setValue('refundee', value || undefined);
    },
    [form],
  );

  const handleCreateIncentive = useCallback(async () => {
    if (!address || !amount || !startTime || !endTime) return;

    setCurrentStep('approve');
    setLoading(true);

    const startTimestamp = BigInt(Math.floor(new Date(startTime).getTime() / 1000));
    const endTimestamp = BigInt(Math.floor(new Date(endTime).getTime() / 1000));
    const rewardAmountParsed = parseUnits(amount, 18);

    try {
      if (chainId !== chain.id) {
        await switchChain(wagmiConfig, { chainId: chain.id });
      }

      if (needsApproval) {
        setCurrentStep('approve');
        const allowanceAmount = parseUnits(amount, tokenA.decimals);
        await writeErc20Approve(wagmiConfig, {
          address: tokenA.address as `0x${string}`,
          args: [STAKER_ADDRESS as `0x${string}`, allowanceAmount],
        });
        setAllowance(allowanceAmount);
        toast.success(t('incentives.addIncentive.tokenApprovalInitiated'));
      }

      setCurrentStep('create');

      const hash = await writeUniswapV3StakerCreateIncentive(wagmiConfig, {
        address: STAKER_ADDRESS,
        args: [
          {
            rewardToken: tokenA.address as `0x${string}`,
            pool: poolAddress as `0x${string}`,
            startTime: startTimestamp,
            endTime: endTimestamp,
            refundee: (refundee && refundee !== '' ? refundee : address) as `0x${string}`,
          },
          rewardAmountParsed,
        ],
      });

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      });

      await delay(REFETCH_INCENTIVES_DELAY);
      toast.success(t('incentives.addIncentive.createdSuccessfully'));
      form.reset({
        amount: '',
        startTime: '',
        endTime: '',
        refundee: address || '',
      });
      refetchTokenAData();
      onFinish();
      onClose();
    } catch (error) {
      console.error('Create incentive failed:', error);
      toast.error(t('incentives.addIncentive.failedToCreateIncentive'));
    } finally {
      setLoading(false);
    }
  }, [
    address,
    amount,
    startTime,
    endTime,
    refundee,
    chainId,
    wagmiConfig,
    poolAddress,
    tokenA,
    form,
    onClose,
    onFinish,
    needsApproval,
    refetchTokenAData,
  ]);

  const getButtonText = () => {
    if (needsApproval) return t('incentives.addIncentive.approve');
    return t('incentives.addIncentive.create');
  };

  const onCloseDialog = useCallback(() => {
    form.reset({
      amount: '',
      startTime: '',
      endTime: '',
      refundee: address || '',
    });
    setCurrentStep('approve');
    onClose();
  }, [form, onClose, address]);

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    handleCreateIncentive();
  };

  const handleAmountChange = useCallback(
    (value: string) => {
      const amount = value
        .replace(/[^0-9.]/g, '') // Removes non-numeric characters or periods
        .replace(/^0+(\d)/, '$1') // Remove leading 0 unless a decimal number
        .replace(/^(\.)/, '0$1') // If it starts with a period, add a leading 0
        .replace(/(\..*?)\./g, '$1') // Only one dot is allowed;
        .replace(new RegExp(`(\\.\\d{${tokenA.decimal}})\\d+`, 'g'), '$1'); // Allow only up to token.decimal
      form.setValue('amount', amount, {
        shouldValidate: true,
      });
    },
    [form],
  );

  return (
    <Dialog open={open} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[430px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-0 w-full">
            <DialogHeader>
              <DialogTitle className="text-left">{t('incentives.addIncentive.title')}</DialogTitle>
              <DialogDescription className="text-left">
                {t('incentives.addIncentive.description')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6 min-w-0 w-full">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('incentives.addIncentive.rewardAmount')}</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.000000000000000001"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="pr-10"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <img src={tokenA.logoPath} alt={tokenA.symbol} className="h-5 w-5" />
                          </div>
                        </div>
                        {tokenABalance > 0n && (
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>
                              {t('incentives.addIncentive.balance')}:{' '}
                              {renderBalance(tokenABalance, { decimals: tokenA.decimals })}{' '}
                              {tokenA.symbol}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (tokenABalance > 0n) {
                                  const formattedBalance = renderBalance(tokenABalance, {
                                    decimals: tokenA.decimals,
                                  });
                                  form.setValue('amount', formattedBalance, {
                                    shouldValidate: true,
                                  });
                                }
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {t('incentives.addIncentive.max')}
                            </button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('incentives.addIncentive.startTime')}</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          min={new Date().toISOString().slice(0, 16)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('incentives.addIncentive.endTime')}</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          min={startTime || new Date().toISOString().slice(0, 16)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="refundee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('incentives.addIncentive.refundeeAddress')}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={address || ''}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          handleRefundeeChange(value);
                        }}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {needsApproval && currentStep === 'approve' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 min-w-0 w-full">
                  <div className="flex items-center min-w-0 w-full">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3 shrink-0"></div>
                    <p className="text-sm text-yellow-800 min-w-0 w-full break-words">
                      {t('incentives.addIncentive.needsApproval', { amount })}
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 'create' && amount && !needsApproval && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 min-w-0 w-full">
                  <div className="flex items-center min-w-0 w-full">
                    <div className="w-4 h-4 bg-green-400 rounded-full mr-3 shrink-0"></div>
                    <p className="text-sm text-green-800 min-w-0 w-full break-words">
                      {t('incentives.addIncentive.approved')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="sm:flex-col mt-6">
              <div className="flex items-center justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCloseDialog}
                    disabled={isSubmitting || loading}
                  >
                    {t('common.cancel')}
                  </Button>
                </DialogClose>

                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={
                    !address ||
                    !amount ||
                    !startTime ||
                    !endTime ||
                    loading ||
                    isSubmitting ||
                    !isValid
                  }
                >
                  {(loading || isSubmitting) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncentiveDialog;
