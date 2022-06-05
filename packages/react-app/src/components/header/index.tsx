import { BackButton, GU, useTheme, useViewport, DropDown } from '@1hive/1hive-ui';
import { useHistory } from 'react-router-dom';
import { ENUM_PAGES } from 'src/constants';
import { usePageContext } from 'src/contexts/page.context';
import { GUpx, isDarkTheme } from 'src/utils/style.util';
import styled from 'styled-components';
import React, { useMemo } from 'react';
import { useNetworkContext } from 'src/contexts/network.context';
import AccountModule from '../account/account-module';
import HeaderMenu from './header-menu';
import HeaderTitle from './header-title';
import { networks } from '../../networks';

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

const HeaderRightPanelStyled = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${6 * GU}px;
`;

const BackButtonStyled = styled(BackButton)`
  padding-right: 16px;
  border-radius: 0;
  background: none;
`;

const BackButtonSpacerStyled = styled.span`
  width: 69px;
`;

const HeaderContentStyled = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  margin-left: ${GUpx(2)};
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
  const { name, changeNetwork } = useNetworkContext();

  const networkNames = useMemo(
    () =>
      Object.values(networks)
        .filter((network) => !(network as any).stagingOf && network.networkId !== 'local')
        .map((network) => network.name), // Skip staging networks
    [networks],
  );

  return (
    <HeaderWraperStyled theme={theme}>
      <HeaderLayoutContentStyled>
        <HeaderLayoutContentFlexStyled>
          {page !== ENUM_PAGES.List ? (
            <BackButtonStyled onClick={() => history.push(ENUM_PAGES.List)} label="" />
          ) : (
            <BackButtonSpacerStyled />
          )}
          <HeaderTitle />
        </HeaderLayoutContentFlexStyled>
        <HeaderContentStyled>{children}</HeaderContentStyled>
        <HeaderRightPanelStyled>
          <HeaderMenu below={below} />
          <AccountModule compact={layoutSmall} />
          <DropDown
            items={networkNames}
            selected={networkNames.indexOf(name)}
            onChange={(i: number) => {
              changeNetwork(
                Object.values(networks).find((network) => network.name === networkNames[i])!
                  .chainId!,
              );
              window.location.reload();
            }}
          />
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
