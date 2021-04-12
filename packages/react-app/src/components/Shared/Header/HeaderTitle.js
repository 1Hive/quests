import PropTypes from 'prop-types';
import React from 'react';
import { useTheme, textStyle, Link } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { APP_TITLE } from '../../../constants';
import logo from './assets/logo.svg';

// #region StyledComponents

const TitleLinkStyled = styled(Link)`
  height: 100%;
`;

const TitleLinkWrapperStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;

const TitleTextStyled = styled.span`
  height: 100%;
  display: inline-flex;
  align-items: center;
  ${textStyle('title3')};
  color: ${({ color }) => color};
`;

// #endregion

export default function HeaderTitle({ onClick, href, external }) {
  const theme = useTheme();

  return (
    <TitleLinkStyled onClick={onClick} href={href} external={external} color={theme.accent}>
      <TitleLinkWrapperStyled>
        <img src={logo} alt="" />
        <TitleTextStyled color={theme.accent}>{APP_TITLE}</TitleTextStyled>
      </TitleLinkWrapperStyled>
    </TitleLinkStyled>
  );
}

HeaderTitle.propTypes = {
  external: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
};
