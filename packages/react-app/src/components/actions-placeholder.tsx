import { Button, IconConnect } from '@1hive/1hive-ui';
import { useWallet } from 'src/contexts/wallet.context';

export function ActionsPlaceholder() {
  const { openWalletConnect, walletConnected } = useWallet();

  const handleConnect = () => {
    openWalletConnect(true);
  };

  return (
    <>
      {!walletConnected && (
        <Button icon={<IconConnect />} label="Connect to interact" onClick={handleConnect} />
      )}
    </>
  );
}
