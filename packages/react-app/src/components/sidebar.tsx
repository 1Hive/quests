import { Box } from '@1hive/1hive-ui';
import { usePageContext } from 'src/contexts/page.context';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { ENUM_PAGES, ENUM_QUEST_VIEW_MODE } from '../constants';
import { useWallet } from '../contexts/wallet.context';
import QuestModal from './modals/quest-modal';
import { Filter } from './filter';
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
    <>
      {page === ENUM_PAGES.List && (
        <BoxStyled>
          <Outset gu8>
            {page === ENUM_PAGES.List && (
              <>
                {account && <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} />}
                <>
                  <Outset gu16 />
                </>
                <Filter />
              </>
            )}
          </Outset>
        </BoxStyled>
      )}
    </>
  );
}
