import { GU, Link, useTheme, IconExternal } from '@1hive/1hive-ui';
import { ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { useWallet } from 'src/contexts/wallet.context';
import { getNetwork } from 'src/networks';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import QuestModal from '../modals/create-quest-modal';
// #region StyledComponents

const HeaderNavStyled = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  margin: ${GUpx(2)};
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
  const { networkId } = getNetwork();
  const { walletConnected } = useWallet();

  return (
    <>
      {!below('large') && (
        <HeaderNavStyled>
          <HeaderNavItemStyled
            color={theme.contentSecondary}
            href={
              networkId === 'rinkeby'
                ? 'https://app.uniswap.org/#/swap?chain=rinkeby&inputCurrency=eth&outputCurrency=0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9'
                : 'https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9'
            }
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

          {walletConnected && (
            <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} buttonMode="normal" />
          )}
        </HeaderNavStyled>
      )}
    </>
  );
}
