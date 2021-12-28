import { Box, GU } from '@1hive/1hive-ui';
import { useHistory } from 'react-router-dom';
import { FilterModel } from 'src/models/filter.model';
import { useFilterContext } from 'src/contexts/filter.context';
import { usePageContext } from 'src/contexts/page.context';
import styled from 'styled-components';
import { PAGES, QUEST_MODE } from '../../constants';
import { useWallet } from '../../contexts/wallet.context';
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
  const { filter, setFilter } = useFilterContext();
  const history = useHistory();

  const onCreateQuestClosed = (questAddress: string) => {
    if (questAddress)
      setTimeout(() => {
        if (page === PAGES.List) setFilter({ ...filter, address: questAddress } as FilterModel);
        else if (page === PAGES.Detail) history.push(`/${PAGES.Detail}?id=${questAddress}`);
      }, 2000);
  };

  return (
    (account || page === PAGES.List) && (
      <BoxStyled>
        <Outset gu8>
          {page === PAGES.List && <Filter />}
          {page === PAGES.List && account && <Separator />}
          {account && (
            <QuestModal
              questMode={QUEST_MODE.Create}
              onClose={(x: string) => onCreateQuestClosed(x)}
            />
          )}
        </Outset>
      </BoxStyled>
    )
  );
}
