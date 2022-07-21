import { Button, IconConnect } from '@1hive/1hive-ui';
import { useWallet } from 'src/contexts/wallet.context';

export function ActionsPlaceholder() {
  const { openWalletConnect, walletConnected, isWrongNetwork, walletAddress, changeNetwork } =
    useWallet();

  const handleConnect = () => {
    if (isWrongNetwork && walletAddress) {
      changeNetwork();
    } else {
      openWalletConnect(true);
    }
  };

  return (
    <>
      {!walletConnected && (
        <Button icon={<IconConnect />} label="Connect to interact" onClick={handleConnect} />
      )}
    </>
  );
}
