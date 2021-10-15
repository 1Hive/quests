import {
  Box,
  Button,
  DateRangePicker,
  Field,
  GU,
  IconClose,
  SearchInput,
  Switch,
} from '@1hive/1hive-ui';
import React, { useState } from 'react';
import styled from 'styled-components';
import { defaultFilter } from '../../../constants';
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

export default function QuestListFilter() {
  const { filter, setFilter } = useFilterContext();
  const { account } = useWallet();
  const [createdQuests, setCreatedQuests] = useState(false);
  const [playedQuests, setPlayedQuests] = useState(false);
  const [foundedQuests, setFoundedQuests] = useState(false);

  const handleClose = (address) => {
    if (address) setFilter(filter); // Force a refresh
  };

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
          <Field label="Expire time">
            <DateRangePicker
              startDate={filter.expire?.start}
              endDate={filter.expire?.end}
              onChange={(val) => setFilter({ expire: val })}
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
              <CreateQuestModal create onClose={handleClose} />
            </>
          )}
        </Outset>
      </BoxStyled>
    </Outset>
  );
}
