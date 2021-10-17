import { Button, GU, IconRefresh, textStyle, useTheme } from '@1hive/1hive-ui';
import { useMemo, useRef } from 'react';
import { UnsupportedChainError } from 'use-wallet';
import { getNetworkName } from '../../../utils/web3-utils';
import connectionError from './assets/connection-error.png';

type Props = {
  error?: Object;
  onBack: Function;
};

function AccountModuleErrorScreen({ error, onBack }: Props) {
  const theme = useTheme();
  const elementRef = useRef();

  const [title, secondary] = useMemo(() => {
    if (error instanceof UnsupportedChainError) {
      return [
        'Wrong network',
        `Please select the ${getNetworkName()} network in your wallet and try again.`,
      ];
    }
    return ['Failed to enable your account', 'You can try another Ethereum wallet.'];
  }, [error]);

  return (
    <section
      // @ts-ignore
      ref={elementRef}
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${2 * GU}px;
        height: 100%;
      `}
    >
      <div
        // @ts-ignore
        css={`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        `}
      >
        <div
          // @ts-ignore
          css={`
            position: relative;
            width: 281px;
            height: 188px;
            background: 50% 50% / 100% 100% no-repeat url(${connectionError});
          `}
        />
        <h1
          // @ts-ignore
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          {title}
        </h1>
        <p
          // @ts-ignore
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {secondary}
        </p>
      </div>
      <div
        // @ts-ignore
        css={`
          flex-grow: 0;
        `}
      >
        <Button onClick={onBack} icon={<IconRefresh />} label=" OK, try again" />
      </div>
    </section>
  );
}

export default AccountModuleErrorScreen;
