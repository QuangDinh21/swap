import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

// Simple hook to read native ETH balance (for base token = ETH)
export function useNativeBalance() {
    const { address } = useAccount();
    const [balance, setBalance] = useState<string>('0');

    const { data, refetch, isLoading } = useBalance({
        address,
        query: { enabled: !!address },
    });

    useEffect(() => {
        if (data?.formatted) setBalance(data.formatted);
    }, [data]);

    return { balance, refetch, isLoading };
}