import { Button, SearchInput, DropDown, useTheme } from '@1hive/1hive-ui';
import { useFilterContext } from 'src/contexts/filter.context';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { DEFAULT_FILTER, ENUM_QUEST_STATE } from '../constants';
import DateFieldInput from './field-input/date-field-input';
import { FieldInput } from './field-input/field-input';
import { ChildSpacer, Outset } from './utils/spacer-util';

// #region StyledComponents

const StatusDropdownStyled = styled(DropDown)`
  border: 1px solid ${(props: any) => props.borderColor};
`;

const SpacerStyled = styled.div`
  margin-top: ${GUpx(2)};
`;

// #endregion

export function Filter() {
  const { filter, setFilter } = useFilterContext();
  const theme = useTheme();
  const states = [ENUM_QUEST_STATE.All, ENUM_QUEST_STATE.Active, ENUM_QUEST_STATE.Expired];

  return (
    <Outset gu16>
      <ChildSpacer align="center" justify="space-between">
        <FieldInput label="Title" wide>
          <SearchInput
            id="filterTitle"
            value={filter.title}
            onChange={(x: string) => setFilter({ ...filter, title: x })}
            wide
          />
        </FieldInput>
        <FieldInput label="Description" wide>
          <SearchInput
            id="filterDescription"
            value={filter.description}
            onChange={(x: string) => setFilter({ ...filter, description: x })}
            wide
          />
        </FieldInput>
        <DateFieldInput
          id="minExpireTime"
          value={filter.minExpireTime}
          label="Expire time"
          tooltip="Minimum expire time"
          tooltipDetail="Will show all quests that are not expired this date"
          onChange={(e: any) => {
            setFilter({
              ...filter,
              minExpireTime: e.currentTarget.value,
            });
          }}
          isEdit
          wide
        />
        <FieldInput label="Status" wide>
          <StatusDropdownStyled
            id="filterStatus"
            items={states}
            borderColor={theme.border}
            selected={states.indexOf(filter.status)}
            onChange={(i: number) => setFilter({ ...filter, status: states[i] })}
            wide
          />
        </FieldInput>
        {
          // TODO : We don't have this information available in subgraph
          /* <AmountFieldInput
          id="filterBounty"
          label="Min available bounty"
          value={filter.bounty}
          onChange={(x: any) => setFilter({ ...filter, bounty: x }, true)}
          wide
        /> */
        }

        {/* <TagFieldInput
            id="filterTags"
            label="Tags"
            isEdit
            placeholder="Search"
            value={filter.tags}
            onChange={(x: string[]) => setFilter({ ...filter, tags: x })}
          /> TODO : Restore after MVP */}
        <SpacerStyled>
          <Button label="Reset" mode="strong" wide onClick={() => setFilter(DEFAULT_FILTER)} />
        </SpacerStyled>
      </ChildSpacer>
    </Outset>
  );
}
