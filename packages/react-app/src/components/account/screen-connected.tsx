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
import { GUpx } from 'src/utils/css.util';
import { getProviderFromUseWalletId } from '../../ethereum-providers';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard.hook';
import { getNetworkName } from '../../utils/web3.utils';
import IdentityBadge from '../identity-badge';

type Props = {
  wallet: {
    account: string;
    activated: string;
    deactivate: Function;
  };
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

  const handleCopyAddress = useCallback(() => copy(wallet.account), [copy, wallet]);

  const handleDeactivate = useCallback(() => wallet.deactivate(), [wallet]);

  return (
    <div
      // @ts-ignore
      css={`
        padding: ${GUpx(2)};
      `}
    >
      <div
        // @ts-ignore
        css={`
          padding-top: ${GUpx(2)};
        `}
      >
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
                // @ts-ignore
                entity={wallet.account}
                compact
                badgeOnly
                // @ts-ignore
                css="cursor: pointer"
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