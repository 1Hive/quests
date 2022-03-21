import { Button, SearchInput, DropDown, useTheme } from '@1hive/1hive-ui';
import { useFilterContext } from 'src/contexts/filter.context';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { DEFAULT_FILTER, ENUM_QUEST_STATE } from '../constants';
import DateFieldInput from './field-input/date-field-input';
import { FieldInput } from './field-input/field-input';

// #region StyledComponents

const StatusDropdownStyled = styled(DropDown)`
  border: 1px solid ${(props: any) => props.borderColor};
`;

const FilterWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${GUpx(2)} ${GUpx(10)};
`;

// #endregion

type Props = {
  compact?: boolean;
};

export function Filter({ compact }: Props) {
  const { filter, setFilter } = useFilterContext();
  const theme = useTheme();
  const states = [ENUM_QUEST_STATE.All, ENUM_QUEST_STATE.Active, ENUM_QUEST_STATE.Expired];

  return (
    <FilterWrapperStyled>
      <div className="pr-16 flex-grow">
        <FieldInput label={!compact ? 'Title' : ''} wide>
          <SearchInput
            id="filterTitle"
            placeholder="Search by title"
            value={filter.title}
            onChange={(x: string) => setFilter({ ...filter, title: x })}
            wide
            compact={compact}
          />
        </FieldInput>
      </div>
      <div className="pl-16 pr-16 flex-grow">
        <FieldInput label={!compact ? 'Description' : ''} wide>
          <SearchInput
            id="filterDescription"
            placeholder="Search by description"
            value={filter.description}
            onChange={(x: string) => setFilter({ ...filter, description: x })}
            wide
            compact={compact}
          />
        </FieldInput>
      </div>
      <div className={!compact ? 'pl-16 pr-16' : 'pb-8'}>
        <DateFieldInput
          id="minExpireTime"
          value={filter.minExpireTime}
          label={!compact ? 'Expire time' : ''}
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
          compact={compact}
        />
      </div>
      <div className="pl-16 pr-16">
        <FieldInput label={!compact ? 'Status' : ''} wide>
          <StatusDropdownStyled
            id="filterStatus"
            items={states}
            borderColor={theme.border}
            selected={states.indexOf(filter.status)}
            onChange={(i: number) => setFilter({ ...filter, status: states[i] })}
            wide
            compact={compact}
          />
        </FieldInput>
      </div>
      <div className="pl-16 pr-16">
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
      </div>
      <div className={!compact ? 'pl-16 pt-16 pr-16' : 'pb-8'}>
        <Button label="Reset" mode="strong" wide onClick={() => setFilter(DEFAULT_FILTER)} />
      </div>
    </FilterWrapperStyled>
  );
}
