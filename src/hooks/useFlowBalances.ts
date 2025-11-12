import { useMemo } from 'react';
import { useTokenBalance } from './useTokenBalance';
import { useNativeBalance } from './useNativeBalance';
import { CONTRACTS } from '../config/constants';

export function useFlowBalances() {
    // Token balances
    const { balance: usdtBalance, refetch: refetchUsdt } = useTokenBalance(
        CONTRACTS.USDT_TOKEN
    );
    const { balance: usdcBalance, refetch: refetchUsdc } = useTokenBalance(
        CONTRACTS.USDC_TOKEN
    );
    const { balance: jocxBalance, refetch: refetchJocx } = useTokenBalance(
        CONTRACTS.JOCX_TOKEN
    );
    const { balance: ethBalance } = useNativeBalance();

    // Balance checks
    const hasEnoughUsdt = useMemo(
        () => (totalUsdt: string) => Number(usdtBalance || '0') >= Number(totalUsdt || '0'),
        [usdtBalance]
    );

    const hasEnoughUsdc = useMemo(
        () => (totalUsdc: string) => Number(usdcBalance || '0') >= Number(totalUsdc || '0'),
        [usdcBalance]
    );

    const hasEnoughEth = useMemo(
        () => (totalEth: string) => Number(ethBalance || '0') >= Number(totalEth || '0'),
        [ethBalance]
    );

    // Refetch all balances
    const refetchAllBalances = async () => {
        await Promise.all([
            refetchUsdt(),
            refetchUsdc(),
            refetchJocx(),
        ]);
    };

    return {
        // Balances
        usdtBalance,
        usdcBalance,
        jocxBalance,
        ethBalance,

        // Balance checks
        hasEnoughUsdt,
        hasEnoughUsdc,
        hasEnoughEth,

        // Refetch functions
        refetchUsdt,
        refetchUsdc,
        refetchJocx,
        refetchAllBalances,
    };
}