import { GU, Link, textStyle, useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash';
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
  margin-left: ${5 * GU}px;
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
  external?: boolean;
  href?: string;
  onClick?: Function;
};

export default function HeaderTitle({ onClick = noop, href, external = false }: Props) {
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
