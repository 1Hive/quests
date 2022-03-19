import { GU, Link, useTheme, IconExternal } from '@1hive/1hive-ui';
import styled from 'styled-components';
// #region StyledComponents

const HeaderNavStyled = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: ${6.5 * GU}px;
`;

const HeaderNavItemStyled = styled(Link)`
  color: ${({ color }: any) => color} !important;
  margin-right: ${3 * GU}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
`;

// #endregion

type Props = {
  below: Function;
};

export default function HeaderMenu({ below }: Props) {
  const theme = useTheme();

  return (
    !below('large') && (
      <HeaderNavStyled>
        <HeaderNavItemStyled
          color={theme.contentSecondary}
          href="https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
          external
        >
          <span>Get Honey</span>
          <IconExternal />
        </HeaderNavItemStyled>
        <HeaderNavItemStyled
          href="https://wiki.1hive.org/projects/quests"
          external
          color={theme.contentSecondary}
        >
          <span>Wiki</span>
          <IconExternal />
        </HeaderNavItemStyled>
      </HeaderNavStyled>
    )
  );
}
