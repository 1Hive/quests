import { noop } from 'lodash';
import { Link } from 'react-router-dom';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { MouseEventHandler } from 'react';
import { Pages } from 'src/enums/pages.enum';
import { LogoTitle } from '../../assets/logo-title';

// #region StyledComponents

const TitleLinkStyled = styled(Link)`
  height: 100%;
  text-decoration: none;
`;

const TitleLinkWrapperStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-left: ${GUpx(1)};
`;

// #endregion

type Props = {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function HeaderTitle({ onClick = noop }: Props) {
  return (
    <TitleLinkStyled onClick={onClick} to={Pages.List}>
      <TitleLinkWrapperStyled>
        <LogoTitle />
      </TitleLinkWrapperStyled>
    </TitleLinkStyled>
  );
}
