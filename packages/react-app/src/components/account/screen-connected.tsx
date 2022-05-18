import {
  Button,
  ButtonBase,
  IconCheck,
  IconCopy,
  RADIUS,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui';
import { useCallback } from 'react';
import { GUpx } from 'src/utils/style.util';
import { getProviderFromUseWalletId } from 'src/ethereum-providers';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard.hook';
import { getNetworkName } from '../../utils/web3.utils';
import IdentityBadge from '../identity-badge';
import { WalletContextModel } from '../../contexts/wallet.context';

type Props = {
  wallet: WalletContextModel;
};

function AccountScreenConnected({ wallet }: Props) {
  const theme = useTheme();
  const copy = useCopyToClipboard();

  const networkName = getNetworkName();
  const providerInfo = getProviderFromUseWalletId(wallet.activated) ?? {
    name: 'Unknown',
    image: undefined,
    id: undefined,
  };

  const handleCopyAddress = useCallback(() => copy(wallet.walletAddress), [copy, wallet]);

  const handleDeactivate = useCallback(() => wallet.deactivateWallet(), [wallet]);

  return (
    <div
      // @ts-ignore
      css={`
        padding: ${GUpx(2)};
      `}
    >
      <div>
        <h4
          // @ts-ignore
          css={`
            ${textStyle('label2')};
            color: ${theme.contentSecondary};
            margin-bottom: ${GUpx(2)};
          `}
        >
          Active Wallet
        </h4>
        <div
          // @ts-ignore
          css={`
            display: flex;
            align-items: center;
            width: 100%;
          `}
        >
          <div
            // @ts-ignore
            css={`
              display: flex;
              align-items: center;
              margin-right: ${GUpx(3)};
              height: ${GUpx(6)};
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              // @ts-ignore
              css={`
                width: ${GUpx(2.5)};
                height: ${GUpx(2.5)};
                margin-right: ${GUpx(0.5)};
                transform: translateY(-2px);
              `}
            />
            <span>{providerInfo.id === 'unknown' ? 'Wallet' : providerInfo.name}</span>
          </div>
          <div
            // @ts-ignore
            css={`
              display: flex;
              align-items: center;
              justify-content: flex-end;
              width: 100%;
            `}
          >
            <ButtonBase
              onClick={handleCopyAddress}
              focusRingRadius={RADIUS}
              css={`
                display: flex;
                align-items: center;
                justify-self: flex-end;
                padding: ${GUpx(0.5)}px;
                &:active {
                  background: ${theme.surfacePressed};
                }
              `}
            >
              <IdentityBadge
                entity={wallet.walletAddress}
                compact
                badgeOnly
                // @ts-ignore
                css={{ cursor: 'pointer', color: theme.badge }} // Little hack, but the whole file will needs to be styled correctly anyway
              />
              <IconCopy
                // @ts-ignore
                css={`
                  color: ${theme.hint};
                `}
              />
            </ButtonBase>
          </div>
        </div>
        <div
          // @ts-ignore
          css={`
            padding: ${GUpx(2)} 0;
          `}
        >
          <div
            // @ts-ignore
            css={`
              display: flex;
              align-items: center;
              color: ${theme.positive};
              ${textStyle('label2')};
            `}
          >
            <IconCheck size="small" />
            <span
              // @ts-ignore
              css={`
                margin-left: ${GUpx(0.5)}px;
              `}
            >
              {`Connected to ${networkName} Network`}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDeactivate}
        wide
        css={`
          margin-top: ${GUpx(2)};
        `}
        mode="negative"
      >
        Disconnect wallet
      </Button>
    </div>
  );
}

export default AccountScreenConnected;
