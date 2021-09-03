// @ts-nocheck
import { Button, GU, useTheme, useViewport } from '@1hive/1hive-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import styled from 'styled-components';
import AccountModule from '../account/AccountModule';
import Layout from '../Layout';
import HeaderMenu from './HeaderMenu';
import HeaderTitle from './HeaderTitle';

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
`;
// #endregion

function Header({ toggleTheme, currentTheme }) {
  const theme = useTheme();
  const { below } = useViewport();
  const layoutSmall = below('medium');

  return (
    <HeaderWraper background={theme.surface}>
      <Layout paddingBottom={0}>
        <HeaderLayoutContent>
          <HeaderLayoutContentFlex>
            <HeaderTitle href="#/home" external={false} />
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
      </Layout>
    </HeaderWraper>
  );
}

Header.propTypes = {
  toggleTheme: PropTypes.func,
  currentTheme: PropTypes.string.isRequired,
};

export default Header;
