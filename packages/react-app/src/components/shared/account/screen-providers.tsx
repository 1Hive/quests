import { ButtonBase, GU, Link, RADIUS, textStyle, useTheme } from '@1hive/1hive-ui';
import { useCallback } from 'react';
import { getProviderFromUseWalletId } from '../../../ethereum-providers';
import { getUseWalletProviders } from '../../../utils/web3.utils';

const PROVIDERS_INFO = getUseWalletProviders().map((provider) => [
  provider.id,
  getProviderFromUseWalletId(provider.id),
]);

type ScreenProvidersProps = {
  onActivate: Function;
};

function ScreenProviders({ onActivate }: ScreenProvidersProps) {
  const theme = useTheme();

  return (
    <div>
      <h4
        // @ts-ignore
        css={`
          padding-top: ${2 * GU}px;
          padding-left: ${2 * GU}px;
          ${textStyle('label2')};
          color: ${theme.contentSecondary};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Ethereum providers
      </h4>
      <div
        // @ts-ignore
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          padding: ${2 * GU}px ${2 * GU}px 0;
        `}
      >
        <div
          // @ts-ignore
          css={`
            display: grid;
            grid-gap: ${1.5 * GU}px;
            grid-auto-flow: row;
          `}
        >
          {PROVIDERS_INFO.map(([id, provider]) => (
            // @ts-ignore
            <ProviderButton key={id} id={id} provider={provider} onActivate={onActivate} />
          ))}
        </div>
        <div
          // @ts-ignore
          css={`
            display: flex;
            justify-content: center;
            margin-top: ${2 * GU}px;
          `}
        >
          <Link href="https://ethereum.org/wallets/" css="text-decoration: none">
            What is an Ethereum provider?
          </Link>
        </div>
      </div>
    </div>
  );
}

type ProviderButtonProps = {
  id: string;
  provider: any;
  onActivate: Function;
};

function ProviderButton({ id, provider, onActivate }: ProviderButtonProps) {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    const chrome = navigator.userAgent.search('Chrome');
    const firefox = navigator.userAgent.search('Firefox');
    const edge8 = navigator.userAgent.search('MSIE 8.0');
    const edge9 = navigator.userAgent.search('MSIE 9.0');

    if (provider.id === 'unknown') {
      if (chrome > -1) {
        window.open(provider.link.chrome);
      } else if (firefox > -1) {
        window.open(provider.link.firefox);
      } else if (edge8 > -1 || edge9 > -1) {
        window.open(provider.link.edge);
      } else {
        window.open(provider.link.default);
      }
    } else {
      onActivate(id);
    }
  }, [onActivate, id]);

  return (
    <ButtonBase
      key={id}
      onClick={handleClick}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: ${12 * GU}px;
        background: ${theme.surface};
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: ${RADIUS}px;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <img src={provider.image} alt="" height={5.25 * GU} />
      <div
        // @ts-ignore
        css={`
          margin-top: ${1 * GU}px;
          ${textStyle('body1')};
        `}
      >
        {provider.name}
      </div>
    </ButtonBase>
  );
}

export default ScreenProviders;
