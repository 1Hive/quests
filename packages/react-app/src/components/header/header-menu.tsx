import { Link, useTheme, IconExternal } from '@1hive/1hive-ui';
import { ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { useWallet } from 'src/contexts/wallet.context';
import { getNetwork } from 'src/networks';
import { ThemeInterface } from 'src/styles/theme';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { useMemo } from 'react';
import { TOKENS } from 'src/tokens';
import QuestModal from '../modals/create-quest-modal';

// #region StyledComponents

const HeaderNavStyled = styled.nav<{ theme: ThemeInterface }>`
  display: flex;
  align-items: center;
  height: 100%;
  margin: ${GUpx(2)} 0;
  border-right: solid 1px;
  border-color: ${({ theme }) => theme.contentSecondary};
  padding-right: ${GUpx(3)};
  column-gap: ${GUpx(2)};
`;

const HeaderNavItemStyled = styled(Link)`
  color: ${({ color }: any) => color} !important;
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
  const swapLink = useMemo(() => {
    switch (networkId) {
      case 'xdai':
        return `https://app.honeyswap.org/#/swap?inputCurrency=${TOKENS.xdai.Honey.token}`;
      case 'goerli':
        return `https://app.uniswap.org/#/swap?chain=goerli&inputCurrency=eth&outputCurrency=${TOKENS.goerli.Dai.token}`;
      case 'rinkeby':
        return `https://app.uniswap.org/#/swap?chain=rinkeby&inputCurrency=eth&outputCurrency=${TOKENS.rinkeby.HoneyTest.token}`;
      default:
        return undefined;
    }
  }, [networkId]);
  return (
    <>
      {!below('medium') && (
        <HeaderNavStyled theme={theme}>
          {!below('large') && (
            <>
              <HeaderNavItemStyled color={theme.contentSecondary} href={swapLink} external>
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
            </>
          )}

          {walletConnected && (
            <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} buttonMode="normal" />
          )}
        </HeaderNavStyled>
      )}
    </>
  );
}
