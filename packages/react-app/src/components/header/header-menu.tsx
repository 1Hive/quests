import { GU, Link, useTheme } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { FaBug } from 'react-icons/fa';
import Separator from '../utils/separator';
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
          Get Honey
        </HeaderNavItemStyled>
        <HeaderNavItemStyled
          href="https://wiki.1hive.org/projects/quests"
          external
          color={theme.contentSecondary}
        >
          Wiki
        </HeaderNavItemStyled>
        <Separator horizontal />
        <HeaderNavItemStyled
          href="https://github.com/1Hive/quests/issues/new?assignees=&labels=&template=bug----bug_title-.md&title="
          external
          color={theme.contentSecondary}
        >
          <FaBug className="mb-4" />
          <span className="ml-8 ">Report a Bug</span>
        </HeaderNavItemStyled>
      </HeaderNavStyled>
    )
  );
}
