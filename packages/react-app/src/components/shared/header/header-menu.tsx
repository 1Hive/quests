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
          href="https://github.com/1Hive/quests/wiki"
          external
          color={theme.contentSecondary}
        >
          FAQ
        </HeaderNavItemStyled>
        <Separator horizontal />
        <HeaderNavItemStyled
          href="https://app.zenhub.com/workspaces/quests-6092dda4c272a5000e858266/board?repos=362850649"
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
