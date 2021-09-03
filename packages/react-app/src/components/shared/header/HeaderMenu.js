import { GU, Link, useTheme } from '@1hive/1hive-ui';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// #region StyledComponents

const HeaderNavStyled = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: ${6.5 * GU}px;
`;

const HeaderNavItemStyled = styled(Link)`
  color: ${({ color }) => color} !important;
  margin-right: ${3 * GU}px;
`;

// #endregion

export default function HeaderMenu({ below }) {
  const theme = useTheme();

  return (
    !below('large') && (
      <HeaderNavStyled>
        <HeaderNavItemStyled href="#/home" external={false} color={theme.contentSecondary}>
          Home
        </HeaderNavItemStyled>
        <HeaderNavItemStyled
          color={theme.contentSecondary}
          href="https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
          external
        >
          Get Honey
        </HeaderNavItemStyled>
        <HeaderNavItemStyled
          href="https://github.com/1Hive/quests/wiki"
          external
          color={theme.contentSecondary}
        >
          FAQ
        </HeaderNavItemStyled>
      </HeaderNavStyled>
    )
  );
}

HeaderMenu.propTypes = {
  below: PropTypes.func,
};
