import { useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash';
import { Link } from 'react-router-dom';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { ENUM_PAGES } from '../../constants';
import { LogoTitle } from './logo-title';

// #region StyledComponents

const TitleLinkStyled = styled(Link)`
  height: 100%;
  text-decoration: none;
  color: ${({ theme }: any) => theme.content};
`;

const TitleLinkWrapperStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  margin-left: ${GUpx()};
`;

// #endregion

type Props = {
  onClick?: Function;
};

export default function HeaderTitle({ onClick = noop }: Props) {
  const theme = useTheme();

  return (
    <TitleLinkStyled onClick={onClick} to={ENUM_PAGES.List} color={theme.accent}>
      <TitleLinkWrapperStyled>
        <LogoTitle />
      </TitleLinkWrapperStyled>
    </TitleLinkStyled>
  );
}
