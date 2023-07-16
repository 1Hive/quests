import { BackButton, useTheme, useViewport, DropDown } from '@1hive/1hive-ui';
import { useHistory } from 'react-router-dom';
import { usePageContext } from 'src/contexts/page.context';
import { GUpx, isDarkTheme } from 'src/utils/style.util';
import styled from 'styled-components';
import React, { useMemo } from 'react';
import { useWallet } from 'src/contexts/wallet.context';
import { flags } from 'src/services/feature-flag.service';
import { Pages } from 'src/enums/pages.enum';
import AccountModule from '../account/account-module';
import HeaderMenu from './header-menu';
import HeaderTitle from './header-title';
import { getNetwork, networks } from '../../networks';
import env from '../../environment';

// #region StyledComponents
const HeaderWraperStyled = styled.header`
  ${({ theme }: any) => !isDarkTheme(theme) && `background: ${theme.background};`}
  position: relative;
  z-index: 3;
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
  align-items: center;
`;

const HeaderLayoutContentStyled = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLayoutContentFlexStyled = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRightPanelStyled = styled.div<{ compact: boolean }>`
  display: flex;
  align-items: center;
  margin-right: ${GUpx(2)};
  column-gap: ${GUpx(2)};
`;

const BackButtonStyled = styled(BackButton)`
  padding-right: 16px;
  border-radius: 0;
  background: none;
`;

const BackButtonSpacerStyled = styled.span`
  width: 69px;
`;

const NetworkSelectorStyled = styled(DropDown)`
  border-color: ${({ borderColor }: any) => borderColor};
`;

// #endregion

type Props = {
  children?: React.ReactNode;
};

function Header({ children }: Props) {
  const theme = useTheme();
  const history = useHistory();
  const { page } = usePageContext();
  const { below } = useViewport();
  const layoutSmall = below('medium');
  const { name } = getNetwork();
  const { changeNetwork } = useWallet();

  const networkNames = useMemo(
    () =>
      Object.values(networks)
        .filter(
          (network) =>
            !(network as any).stagingOf && network.networkId !== 'local' && !network.isDeprecated, // Skip staging and deprecated networks
        )
        .map((network) => network.name),
    [networks],
  );

  return (
    <HeaderWraperStyled theme={theme}>
      <HeaderLayoutContentStyled>
        <HeaderLayoutContentFlexStyled>
          {page !== Pages.List ? (
            <BackButtonStyled onClick={() => history.push(Pages.List)} label="" />
          ) : (
            <BackButtonSpacerStyled />
          )}
          <HeaderTitle />
        </HeaderLayoutContentFlexStyled>
        <HeaderRightPanelStyled compact={below('medium')}>
          {children}
          <HeaderMenu below={below} />
          <AccountModule compact={layoutSmall} />
          {!below(500) && !env('FORCE_CHAIN_ID') && flags.SWITCH_CHAIN && (
            <NetworkSelectorStyled
              borderColor={theme.border}
              items={networkNames}
              selected={networkNames.indexOf(name)}
              onChange={(i: number) => {
                if (page === Pages.Detail) {
                  window.history.pushState({}, '', Pages.List);
                }
                changeNetwork(
                  Object.values(networks).find((network) => network.name === networkNames[i])!
                    .chainId!,
                );
              }}
            />
          )}
          {
            // TODO : Restore when light theme is implemented
            /* <ThemeButtonStyled
            ref={activityOpener}
            className="ml-8"
            label={isDarkTheme(theme) ? 'Light' : 'Dark'}
            icon={isDarkTheme(theme) ? <FaSun /> : <FaMoon />}
            display="icon"
            onClick={toggleTheme}
          /> */
          }
        </HeaderRightPanelStyled>
      </HeaderLayoutContentStyled>
    </HeaderWraperStyled>
  );
}

export default Header;
