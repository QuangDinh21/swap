import { ConnectKitButton } from 'connectkit';
import { Button, WalletIcon } from '../components/ui';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'ethers';

export function WalletConnection() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className="flex justify-end">
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName, chain }) => {
          if (!isConnected) {
            return (
              <Button onClick={show} icon={<WalletIcon className="w-4 h-4" />}>
                Connect Wallet
              </Button>
            );
          }

          if (chain?.unsupported) {
            return (
              <Button onClick={show} variant="danger">
                Wrong network
              </Button>
            );
          }

          return (
            <div className="flex gap-2">
              <Button onClick={show}>
                {ensName || truncatedAddress}
                {balance
                  ? ` (${Number(formatEther(balance.value)).toFixed(4)} ${
                      balance.symbol
                    })`
                  : ''}
              </Button>
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
}
