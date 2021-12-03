import { Box, Button, DateRangePicker, Field, GU, IconClose, SearchInput } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { defaultFilter, QUEST_MODE } from '../../constants';
import { useFilterContext } from '../../providers/filter.context';
import { useWallet } from '../../providers/wallet.context';
import QuestModal from '../modals/quest-modal';
import AmountFieldInput from './field-input/amount-field-input';
import Separator from './utils/separator';
import { Outset } from './utils/spacer-util';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: 100%;
  min-width: fit-content;
  margin: ${5 * GU}px 0;
`;

// #endregion

export default function QuestListFilter() {
  // @ts-ignore
  const { filter, setFilter } = useFilterContext();
  const { account } = useWallet();

  const handleClose = (address: string) => {
    if (address) setFilter(filter); // Force a refresh
  };

  return (
    <BoxStyled heading="Filters">
      <Outset gu8>
        <Field label="Search">
          <SearchInput
            id="filterSearch"
            value={filter.search}
            onChange={(x: string) => setFilter({ ...filter, search: x })}
            placeholder="keyword"
            wide
          />
        </Field>
        <Field label="Expire time">
          <DateRangePicker
            startDate={filter.expire?.start}
            endDate={filter.expire?.end}
            onChange={(val: any) => setFilter({ ...filter, expire: val })}
          />
        </Field>
        <AmountFieldInput
          id="filterBounty"
          label="Min available bounty"
          value={filter.bounty}
          onChange={(x: any) => setFilter({ ...filter, bounty: x }, true)}
          wide
        />
        {/* <TagFieldInput
            id="filterTags"
            label="Tags"
            isEdit
            placeholder="Search"
            value={filter.tags}
            onChange={(x: string[]) => setFilter({ ...filter, tags: x })}
          /> TODO : Restore after MVP */}
        <Button icon={<IconClose />} label="clear" wide onClick={() => setFilter(defaultFilter)} />
        {account && (
          <>
            <Separator />
            {/* <Field label="Created quests">
                <Switch checked={createdQuests} onChange={setCreatedQuests} />
              </Field>
              <Field label="Played quests">
                <Switch checked={playedQuests} onChange={setPlayedQuests} />
              </Field>
              <Field label="Founded quests">
                <Switch checked={foundedQuests} onChange={setFoundedQuests} />
              </Field>TODO : Restore after MVP or when doing #67 : https://github.com/1Hive/quests/issues/67 */}
            <QuestModal questMode={QUEST_MODE.CREATE} onClose={handleClose} />
          </>
        )}
      </Outset>
    </BoxStyled>
  );
}
