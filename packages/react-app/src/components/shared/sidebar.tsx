import { Box } from '@1hive/1hive-ui';
import { usePageContext } from 'src/contexts/page.context';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { ENUM_PAGES, ENUM_QUEST_MODE } from '../../constants';
import { useWallet } from '../../contexts/wallet.context';
import QuestModal from '../modals/quest-modal';
import { Filter } from './filter';
import Separator from './utils/separator';
import { Outset } from './utils/spacer-util';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: 100%;
  min-width: fit-content;
  margin: ${GUpx(5)} 0;
`;

// #endregion

export default function Sidebar() {
  const { account } = useWallet();
  const { page } = usePageContext();

  return (
    (account || page === ENUM_PAGES.List) && (
      <BoxStyled>
        <Outset gu8>
          {page === ENUM_PAGES.List && <Filter />}
          {page === ENUM_PAGES.List && account && <Separator gu16 />}
          {account && <QuestModal questMode={ENUM_QUEST_MODE.Create} />}
        </Outset>
      </BoxStyled>
    )
  );
}
