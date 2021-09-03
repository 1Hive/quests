import {
  Box,
  Button,
  DateRangePicker,
  DropDown,
  Field,
  GU,
  IconClose,
  SearchInput,
  Switch,
} from '@1hive/1hive-ui';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { defaultFilter, QUEST_STATUS } from '../../../constants';
import { useFilterContext } from '../../../providers/FilterContext';
import { isConnected } from '../../../utils/web3-utils';
import CreateQuestModal from '../../Modals/QuestModal';
import AmountFieldInput from '../../Shared/FieldInput/AmountFieldInput';
import TagFieldInput from '../../Shared/FieldInput/TagFieldInput';
import Separator from '../../Shared/Utils/Separator';
import { Outset } from '../../Shared/Utils/spacer-util';

// #region StyledComponent

const BoxStyled = styled(Box)`
  width: 100%;
  min-width: fit-content;
  margin-bottom: ${2 * GU}px;
`;

// #endregion

const questStatusOptions = Object.values(QUEST_STATUS).map((x) => x.label);

export default function QuestListFilter() {
  const { filter, setFilter } = useFilterContext();
  const [connected, setConnected] = useState(false);
  const [createdQuests, setCreatedQuests] = useState(false);
  const [playedQuests, setPlayedQuests] = useState(false);
  const [foundedQuests, setFoundedQuests] = useState(false);

  useEffect(() => {
    isConnected().then((x) => setConnected(x));
  }, []);

  return (
    <Outset gu16>
      <BoxStyled heading="Filters">
        <Outset gu8>
          <Field label="Search">
            <SearchInput
              id="filterSearch"
              value={filter.search}
              onChange={(x) => setFilter({ search: x })}
              placeholder="keyword"
              wide
            />
          </Field>
          <Field label="filterStatus">
            <DropDown
              items={questStatusOptions}
              selected={Object.keys(QUEST_STATUS).indexOf(filter.status)}
              onChange={(i) => setFilter({ status: Object.keys(QUEST_STATUS)[i] })}
              placeholder="All"
              wide
            />
          </Field>
          <Field label="Expiration">
            <DateRangePicker
              startDate={filter.expiration?.start}
              endDate={filter.expiration?.end}
              onChange={(val) => setFilter({ expiration: val })}
            />
          </Field>
          <AmountFieldInput
            id="filterBounty"
            label="Min bounty"
            value={filter.bounty}
            onChange={(x) => setFilter({ bounty: x }, true)}
            wide
          />
          <TagFieldInput
            id="filterTags"
            label="Tags"
            isEdit
            placeholder="Search"
            value={filter.tags}
            onChange={(x) => setFilter({ tags: x })}
          />
          <Button
            icon={<IconClose />}
            label="clear"
            wide
            onClick={() => setFilter(defaultFilter)}
          />
          {connected && (
            <>
              <Separator />
              <Field label="Created quests">
                <Switch checked={createdQuests} onChange={setCreatedQuests} />
              </Field>
              <Field label="Played quests">
                <Switch checked={playedQuests} onChange={setPlayedQuests} />
              </Field>
              <Field label="Founded quests">
                <Switch checked={foundedQuests} onChange={setFoundedQuests} />
              </Field>
              <CreateQuestModal create />
            </>
          )}
        </Outset>
      </BoxStyled>
    </Outset>
  );
}
