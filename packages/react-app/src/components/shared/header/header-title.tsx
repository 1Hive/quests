import { textStyle, useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash';
import { Link } from 'react-router-dom';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { APP_TITLE, PAGES } from '../../../constants';
import logo from './assets/logo.svg';

// #region StyledComponents

const TitleLinkStyled = styled(Link)`
  height: 100%;
  text-decoration: none;
`;

const TitleLinkWrapperStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  margin-left: ${GUpx()};
`;

const TitleTextStyled = styled.span`
  height: 100%;
  display: inline-flex;
  align-items: center;
  ${textStyle('title3')};
  color: ${({ color }: any) => color};
`;

// #endregion

type Props = {
  onClick?: Function;
};

export default function HeaderTitle({ onClick = noop }: Props) {
  const theme = useTheme();

  return (
    <TitleLinkStyled onClick={onClick} to={PAGES.List} color={theme.accent}>
      <TitleLinkWrapperStyled>
        <img src={logo} alt="" />
        <TitleTextStyled color={theme.accent}>{APP_TITLE}</TitleTextStyled>
      </TitleLinkWrapperStyled>
    </TitleLinkStyled>
  );
}
