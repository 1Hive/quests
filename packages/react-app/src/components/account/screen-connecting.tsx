import { Button, GU, textStyle, useTheme } from '@1hive/1hive-ui';
import React from 'react';
import { keyframes } from 'styled-components';
import { getProviderFromUseWalletId, getProviderString } from '../../ethereum-providers';
import loadingRing from './assets/loading-ring.svg';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

type Props = {
  onCancel: Function;
  providerId: string;
};

const AccountModuleConnectingScreen = React.memo(({ onCancel, providerId }: Props) => {
  const theme = useTheme();
  const provider = getProviderFromUseWalletId(providerId) ?? {
    name: 'Unknown',
    image: undefined,
    id: undefined,
  };
  return (
    <section
      // @ts-ignore
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
            width: ${10.5 * GU}px;
            height: ${10.5 * GU}px;
          `}
        >
          <div
            // @ts-ignore
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url(${loadingRing}) no-repeat 0 0;
              animation-duration: 1s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
              animation-name: ${spin};
              // prevents flickering on Firefox
              backface-visibility: hidden;
            `}
          />
          <div
            // @ts-ignore
            css={`
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 50% 50% / auto ${5 * GU}px no-repeat url(${provider.image});
            `}
          />
        </div>
        <h1
          // @ts-ignore
          css={`
            padding-top: ${2 * GU}px;
            ${textStyle('body1')};
            font-weight: 600;
          `}
        >
          Connecting to {provider.name}
        </h1>
        <p
          // @ts-ignore
          css={`
            width: ${36 * GU}px;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Log into {getProviderString('your Ethereum provider', provider.id)}. You may be
          temporarily redirected to a new screen.
        </p>
      </div>
      <div
        // @ts-ignore
        css={`
          flex-grow: 0;
        `}
      >
        <Button mode="negative" onClick={onCancel} label="cancel" />
      </div>
    </section>
  );
});

export default AccountModuleConnectingScreen;
