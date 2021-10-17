import {
  Button,
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  RADIUS,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui';
import { useCallback } from 'react';
import { getProviderFromUseWalletId } from '../../../ethereum-providers';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { getNetworkName } from '../../../utils/web3-utils';
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
        padding: ${2 * GU}px;
      `}
    >
      <div
        // @ts-ignore
        css={`
          padding-top: ${2 * GU}px;
        `}
      >
        <h4
          // @ts-ignore
          css={`
            ${textStyle('label2')};
            color: ${theme.contentSecondary};
            margin-bottom: ${2 * GU}px;
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
              margin-right: ${3 * GU}px;
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              // @ts-ignore
              css={`
                width: ${2.5 * GU}px;
                height: ${2.5 * GU}px;
                margin-right: ${0.5 * GU}px;
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
                padding: ${0.5 * GU}px;
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
            padding: ${2 * GU}px 0;
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
                margin-left: ${0.5 * GU}px;
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
          margin-top: ${2 * GU}px;
        `}
        mode="negative"
      >
        Disconnect wallet
      </Button>
    </div>
  );
}

export default AccountScreenConnected;
