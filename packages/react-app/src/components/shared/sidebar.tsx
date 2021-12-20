import { Box, GU } from '@1hive/1hive-ui';
import { usePageContext } from 'src/providers/page.context';
import styled from 'styled-components';
import { PAGES, QUEST_MODE } from '../../constants';
import { useWallet } from '../../providers/wallet.context';
import QuestModal from '../modals/quest-modal';
import { Filter } from './filter';
import Separator from './utils/separator';
import { Outset } from './utils/spacer-util';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: 100%;
  min-width: fit-content;
  margin: ${5 * GU}px 0;
`;

// #endregion

export default function Sidebar() {
  const { account } = useWallet();
  const { page } = usePageContext();

  return (
    (account || page === PAGES.List) && (
      <BoxStyled>
        <Outset gu8>
          {page === PAGES.List && <Filter />}
          {page === PAGES.List && account && <Separator />}
          {account && <QuestModal questMode={QUEST_MODE.CREATE} />}
        </Outset>
      </BoxStyled>
    )
  );
}
