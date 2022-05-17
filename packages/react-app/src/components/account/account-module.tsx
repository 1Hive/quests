/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable no-shadow */
import { Button, GU, IconConnect, springs } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animated, Transition } from 'react-spring/renderprops';
import { getProviderFromUseWalletId } from 'src/ethereum-providers';
import { Logger } from 'src/utils/logger';
import styled from 'styled-components';
import { useWallet } from '../../contexts/wallet.context';
import { getUseWalletProviders, isConnected } from '../../utils/web3.utils';
import HeaderPopover from '../header/header-popover';
import AccountButton from './account-button';
import AccountScreenConnected from './screen-connected';
import AccountModuleConnectingScreen from './screen-connecting';
import AccountModuleErrorScreen from './screen-error';
import ScreenProviders from './screen-providers';

const AccountWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  outline: 0;
`;

const AnimatedDivStyled = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const SCREENS = [
  {
    id: 'providers',
    height:
      66 + // header
      104 * getUseWalletProviders().length + // buttons
      40, // footer
  },
  {
    id: 'connecting',
    height: 38 * GU,
  },
  {
    id: 'connected',
    height: 28 * GU,
  },
  {
    id: 'error',
    height: 50 * GU,
  },
];

type Props = {
  compact: boolean;
};

function AccountModule({ compact = false }: Props) {
  const buttonRef = useRef<any>();
  const wallet = useWallet();
  const { walletAddress, activating, deactivateWallet, activateWallet } = wallet;
  const [opened, setOpened] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [activatingDelayed, setActivatingDelayed] = useState<boolean | undefined>(false);
  const [activationError, setActivationError] =
    useState<{ name: string; label: string; detail: string }>();
  const popoverFocusElement = useRef<any>();
  const [buttonLabel, setButtonLabel] = useState<string>();

  const clearError = useCallback(() => setActivationError(undefined), []);

  const toggle = useCallback(() => setOpened((opened) => !opened), []);

  const handleCancelConnection = useCallback(() => {
    deactivateWallet();
  }, [walletAddress]);

  const activate = useCallback(
    async (id?: string) => {
      try {
        if (id || (await isConnected())) {
          if (!id) id = getProviderFromUseWalletId()?.id;
          await activateWallet(id);
        }
      } catch (error: any) {
        setActivationError(error);
        Logger.warn(error);
      }
    },
    [walletAddress],
  );

  useEffect(() => {
    activate();
  }, []);

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    if (!opened) {
      return noop;
    }
    setAnimate(false);
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [opened]);

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    if (activationError) {
      setActivatingDelayed(undefined);
    }

    if (activating) {
      setActivatingDelayed(activating);
      return noop;
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(undefined);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [activating, activationError]);

  const previousScreenIndex = useRef(-1);

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activationError) {
        setButtonLabel(
          activationError.name === 'UnsupportedChainError' ? 'Wrong network' : 'Failed to enable',
        );
        return 'error';
      }
      if (activatingDelayed) {
        setButtonLabel('Connecting...');
        return 'connecting';
      }
      if (walletAddress) return 'connected';

      setButtonLabel('Connect wallet');
      return 'providers';
    })();

    const screenIndex = SCREENS.findIndex((screen) => screen.id === screenId);
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1;

    previousScreenIndex.current = screenIndex;

    return { direction, screenIndex };
  }, [walletAddress, activationError, activatingDelayed]);

  const screen = SCREENS[screenIndex];
  const screenId = screen.id;

  const handlePopoverClose = useCallback(() => {
    if (screenId === 'connecting' || screenId === 'error') {
      // reject closing the popover
      return false;
    }
    setOpened(false);
    setActivationError(undefined);
    return true;
  }, [screenId]);

  // Prevents to lose the focus on the popover when a screen leaves while an
  // element inside is focused (e.g. when clicking on the “disconnect” button).
  useEffect(() => {
    if (popoverFocusElement?.current) {
      (popoverFocusElement.current as any)?.focus();
    }
  }, [screenId]);

  return (
    <AccountWrapperStyled ref={buttonRef}>
      {screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button
          mode="strong"
          icon={<IconConnect />}
          label={buttonLabel}
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
        />
      )}

      <HeaderPopover
        animateHeight={animate}
        // heading={screen.title}
        height={screen.height}
        width={41 * GU}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        visible={opened}
      >
        {/* @ts-ignore */}
        <div ref={popoverFocusElement} tabIndex="0" css="outline: 0">
          <Transition
            native
            immediate={!animate}
            config={springs.smooth}
            items={{
              screen,
              activating: screen.id === 'error' ? null : activatingDelayed,
              wallet,
            }}
            keys={({ screen }) => screen.id + activatingDelayed}
            from={{
              opacity: 0,
              transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
            }}
            enter={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
            leave={{
              opacity: 0,
              transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
            }}
          >
            {({ screen, activating, wallet }) =>
              ({ opacity, transform }: any) =>
                (
                  <AnimatedDivStyled style={{ opacity, transform }}>
                    {(() => {
                      if (screen.id === 'connecting') {
                        return (
                          <AccountModuleConnectingScreen
                            providerId={activating as any}
                            onCancel={handleCancelConnection}
                          />
                        );
                      }
                      if (screen.id === 'connected') {
                        return <AccountScreenConnected wallet={wallet} />;
                      }
                      if (screen.id === 'error') {
                        return (
                          <AccountModuleErrorScreen error={activationError} onBack={clearError} />
                        );
                      }
                      return <ScreenProviders onActivate={activate} />;
                    })()}
                  </AnimatedDivStyled>
                )}
          </Transition>
        </div>
      </HeaderPopover>
    </AccountWrapperStyled>
  );
}

export default AccountModule;
