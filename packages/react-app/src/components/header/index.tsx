/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import { BackButton, GU, useTheme, useViewport } from '@1hive/1hive-ui';
import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { ENUM_PAGES } from 'src/constants';
import { useModalContext } from 'src/contexts/modal-context';
import { usePageContext } from 'src/contexts/page.context';
import { isDarkTheme } from 'src/utils/style.util';
import styled from 'styled-components';
import AccountModule from '../account/account-module';
import HeaderMenu from './header-menu';
import HeaderTitle from './header-title';

// #region StyledComponents
const HeaderWraperStyled = styled.header`
  ${({ theme }: any) => !isDarkTheme(theme) && `background: ${theme.background};`}
  position: relative;
  z-index: 3;
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
  align-items: center;
  & > div {
    ${({ isModalOpen }: any) => isModalOpen && 'opacity:0.3;'}
  }
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
  display: flex;
  align-items: center;
  justify-content: end;
  flex-grow: 1;
`;

// #endregion

type Props = {
  toggleTheme: Function;
  children: ReactNode;
};

// eslint-disable-next-line no-unused-vars
function Header({ toggleTheme, children }: Props) {
  const theme = useTheme();
  const history = useHistory();
  const { page } = usePageContext();
  const { below } = useViewport();
  const { isOpen } = useModalContext();
  const layoutSmall = below('medium');

  return (
    <HeaderWraperStyled theme={theme} isModalOpen={isOpen}>
      <HeaderLayoutContentStyled>
        <HeaderLayoutContentFlexStyled>
          {page !== ENUM_PAGES.List ? (
            <BackButtonStyled onClick={() => history.push(ENUM_PAGES.List)} label="" />
          ) : (
            <BackButtonSpacerStyled />
          )}
          <HeaderTitle external={false} />
        </HeaderLayoutContentFlexStyled>
        <HeaderContentStyled>{children}</HeaderContentStyled>
        <HeaderRightPanelStyled>
          <HeaderMenu below={below} />
          <AccountModule compact={layoutSmall} />
          {
            // TODO : Restore when toggle theme is implemented
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
