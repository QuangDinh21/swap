import { ConnectKitButton } from 'connectkit';
import { WalletIcon } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'ethers';
import { Button } from '@gu-corp/gu-ui';

export function WalletConnection() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className="flex justify-end">
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName, chain }) => {
          if (!isConnected) {
            return (
              <Button onClick={show}>
                <WalletIcon className="w-4 h-4" />
                <span className="hidden sm:block">Connect Wallet</span>
              </Button>
            );
          }

          if (chain?.unsupported) {
            return (
              <Button onClick={show} variant="destructive">
                Wrong network
              </Button>
            );
          }

          return (
            <div className="flex gap-2">
              <Button onClick={show}>
                {ensName || truncatedAddress}
                <div className="hidden sm:block">
                  {balance
                    ? ` (${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol})`
                    : ''}
                </div>
              </Button>
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
