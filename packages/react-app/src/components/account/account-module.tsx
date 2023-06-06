/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { Button, GU, IconConnect, springs } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animated, Transition } from 'react-spring/renderprops';
import styled from 'styled-components';
import { useWallet } from '../../contexts/wallet.context';
import { getUseWalletProviders, isConnected } from '../../utils/web3.utils';
import HeaderPopover from '../header/header-popover';
import AccountButton from './account-button';
import AccountScreenConnected from './screen-connected';
import AccountModuleConnectingScreen from './screen-connecting';
import ScreenProviders from './screen-providers';
import { getNetwork } from '../../networks';

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
  const { name } = getNetwork();
  const [opened, setOpened] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [activatingDelayed, setActivatingDelayed] = useState<boolean | undefined>(false);
  const popoverFocusElement = useRef<any>();
  const [buttonLabel, setButtonLabel] = useState<string>();

  useEffect(() => {
    setOpened(wallet.walletConnectOpened ?? false);
  }, [wallet.walletConnectOpened]);

  const toggle = useCallback(() => setOpened((opened) => !opened), []);

  const handleCancelConnection = useCallback(() => {
    wallet.deactivateWallet();
  }, [wallet.walletAddress]);

  const activate = useCallback(
    async (id?: string) => {
      if (id || (await isConnected())) {
        await wallet.activateWallet(id);
      }
    },
    [wallet.walletAddress],
  );

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    if (!opened) {
      wallet.openWalletConnect(false);
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
    if (wallet.isWrongNetwork && activatingDelayed !== undefined) {
      setActivatingDelayed(undefined);
    } else if (wallet.activatingId) {
      setActivatingDelayed(!!wallet.activatingId);
    } else {
      setActivatingDelayed(undefined);
    }
  }, [wallet.activatingId, wallet.isWrongNetwork]);

  const previousScreenIndex = useRef(-1);

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activatingDelayed) {
        setButtonLabel('Connecting...');
        return 'connecting';
      }
      if (wallet.walletAddress) return 'connected';

      setButtonLabel('Connect wallet');
      return 'providers';
    })();

    const screenIndex = SCREENS.findIndex((screen) => screen.id === screenId);
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1;

    previousScreenIndex.current = screenIndex;

    return { direction, screenIndex };
  }, [wallet.walletAddress, activatingDelayed]);

  const screen = SCREENS[screenIndex];
  const screenId = screen.id;

  const handlePopoverClose = useCallback(() => {
    if (screenId === 'connecting' || screenId === 'error') {
      // reject closing the popover
      return false;
    }
    setOpened(false);
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
      {wallet.isWrongNetwork ? (
        <Button
          icon={<IconConnect />}
          label={`Switch wallet to ${name}`}
          onClick={() => wallet.changeNetwork()}
          display={compact ? 'icon' : 'all'}
          mode="strong"
        />
      ) : screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button
          mode="strong"
          icon={<IconConnect />}
          label={buttonLabel}
          id="account-button"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
        />
      )}
      {!wallet.isWrongNetwork && (
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
          <div ref={popoverFocusElement} tabIndex="0" css="outline: 0" id="account-wrapper">
            {/* @ts-ignore */}
            <Transition
              native
              immediate={!animate}
              config={springs.smooth}
              items={{
                screen,
                activatingId: wallet.activatingId,
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
              {({ screen, activatingId, wallet }) =>
                ({ opacity, transform }: any) =>
                  (
                    <AnimatedDivStyled style={{ opacity, transform }}>
                      {(() => {
                        if (screen.id === 'connecting') {
                          return (
                            <AccountModuleConnectingScreen
                              providerId={activatingId}
                              onCancel={handleCancelConnection}
                            />
                          );
                        }
                        if (screen.id === 'connected') {
                          return <AccountScreenConnected wallet={wallet} />;
                        }

                        return <ScreenProviders onActivate={activate} />;
                      })()}
                    </AnimatedDivStyled>
                  )}
            </Transition>
          </div>
        </HeaderPopover>
      )}
    </AccountWrapperStyled>
  );
}

export default AccountModule;
