// @ts-nocheck
import { BackButton, Button, GU, useTheme, useViewport } from '@1hive/1hive-ui';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { PAGES } from 'src/constants';
import { usePageContext } from 'src/providers/page.context';
import styled from 'styled-components';
import AccountModule from '../account/account-module';
import HeaderMenu from './header-menu';
import HeaderTitle from './header-title';

// #region StyledComponents
const HeaderWraper = styled.header`
  position: relative;
  z-index: 3;
  background: ${({ background }) => background};
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 3px;
`;

const HeaderLayoutContent = styled.div`
  height: ${8 * GU}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLayoutContentFlex = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const HeaderRightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${6 * GU}px;
`;

const BackButtonStyled = styled(BackButton)`
  padding-right: 16px;
  border-radius: 0;
`;

const BackButtonSpacerStyled = styled.span`
  width: 69px;
`;

// #endregion

type Props = {
  toggleTheme: Function;
  currentTheme: string;
};

function Header({ toggleTheme, currentTheme }: Props) {
  const theme = useTheme();

  const history = useHistory();
  const { page } = usePageContext();
  const { below } = useViewport();
  const layoutSmall = below('medium');

  return (
    <HeaderWraper background={theme.surface}>
      <HeaderLayoutContent>
        <HeaderLayoutContentFlex>
          {page !== PAGES.List ? (
            <BackButtonStyled onClick={() => history.push(PAGES.List)} label="" />
          ) : (
            <BackButtonSpacerStyled />
          )}
          <HeaderTitle external={false} />
          <HeaderMenu below={below} />
        </HeaderLayoutContentFlex>

        <HeaderRightPanel>
          <AccountModule compact={layoutSmall} />
          <Button
            className="ml-8"
            label={currentTheme === 'dark' ? 'Light' : 'Dark'}
            icon={currentTheme === 'dark' ? <FaSun /> : <FaMoon />}
            display="icon"
            onClick={toggleTheme}
          />
        </HeaderRightPanel>
      </HeaderLayoutContent>
    </HeaderWraper>
  );
}

export default Header;
