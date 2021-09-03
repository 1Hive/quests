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
import React, { useState } from 'react';
import styled from 'styled-components';
import { defaultFilter, QUEST_STATUS } from '../../../constants';
import { useFilterContext } from '../../../providers/FilterContext';
import { useWallet } from '../../../providers/Wallet';
import CreateQuestModal from '../../modals/QuestModal';
import AmountFieldInput from '../../shared/field-input/AmountFieldInput';
import TagFieldInput from '../../shared/field-input/TagFieldInput';
import Separator from '../../shared/utils/Separator';
import { Outset } from '../../shared/utils/spacer-util';

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
  const { account } = useWallet();
  const [createdQuests, setCreatedQuests] = useState(false);
  const [playedQuests, setPlayedQuests] = useState(false);
  const [foundedQuests, setFoundedQuests] = useState(false);

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
          {account && (
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
