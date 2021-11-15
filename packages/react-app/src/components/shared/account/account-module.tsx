/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable no-shadow */
import { Button, GU, IconConnect, springs } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animated, Transition } from 'react-spring/renderprops';
import styled from 'styled-components';
import { useWallet } from '../../../providers/wallet.context';
import { getUseWalletProviders } from '../../../utils/web3.utils';
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
      6 * GU + // header
      (12 + 1.5) * GU * Math.ceil(getUseWalletProviders().length / 2) + // buttons
      7 * GU, // footer
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
  const buttonRef = useRef();
  const wallet = useWallet();
  const [opened, setOpened] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [activatingDelayed, setActivatingDelayed] = useState<boolean | undefined>(false);
  const [activationError, setActivationError] = useState();
  const popoverFocusElement = useRef<any>();

  const { account, activating } = wallet;

  const clearError = useCallback(() => setActivationError(undefined), []);

  const toggle = useCallback(() => setOpened((opened) => !opened), []);

  const handleCancelConnection = useCallback(() => {
    wallet.deactivate();
  }, [wallet]);

  const activate = useCallback(
    async (providerId) => {
      try {
        await wallet.activate(providerId);
      } catch (error: any) {
        setActivationError(error);
      }
    },
    [wallet],
  );

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
      if (activationError) return 'error';
      if (activatingDelayed) return 'connecting';
      if (account) return 'connected';
      return 'providers';
    })();

    const screenIndex = SCREENS.findIndex((screen) => screen.id === screenId);
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1;

    previousScreenIndex.current = screenIndex;

    return { direction, screenIndex };
  }, [account, activationError, activatingDelayed]);

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
    <AccountWrapperStyled ref={buttonRef} tabIndex="0">
      {screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
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
              // This is needed because use-wallet throws an error when the
              // activation fails before React updates the state of `activating`.
              // A future version of use-wallet might return an
              // `activationError` object instead, making this unnecessary.
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
