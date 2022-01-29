import { Button, Field, IconClose, SearchInput, DropDown, useTheme } from '@1hive/1hive-ui';
import { useFilterContext } from 'src/contexts/filter.context';
import styled from 'styled-components';
import { DEFAULT_FILTER, ENUM_QUEST_STATE } from '../constants';
import DateFieldInput from './field-input/date-field-input';

const StatusDropdownStyled = styled(DropDown)`
  border: 1px solid ${(props: any) => props.borderColor};
`;

export function Filter() {
  const { filter, setFilter } = useFilterContext();
  const theme = useTheme();
  const states = [ENUM_QUEST_STATE.All, ENUM_QUEST_STATE.Active, ENUM_QUEST_STATE.Expired];
  return (
    <>
      <Field label="Title">
        <SearchInput
          id="filterTitle"
          value={filter.title}
          onChange={(x: string) => setFilter({ ...filter, title: x })}
          wide
        />
      </Field>
      <Field label="Description">
        <SearchInput
          id="filterDescription"
          value={filter.description}
          onChange={(x: string) => setFilter({ ...filter, description: x })}
          wide
        />
      </Field>
      <DateFieldInput
        id="expireTime"
        value={filter.expireTime}
        label="Expire time"
        tooltip="Minimum expire time"
        tooltipDetail="Will show all quests that expire after this date"
        onChange={(val: any) => {
          setFilter({
            ...filter,
            expireTime: val.currentTarget.value
              ? new Date(val.currentTarget.value).getTime()
              : undefined,
          });
        }}
        isEdit
        wide
      />
      <Field label="Status">
        <StatusDropdownStyled
          id="filterStatus"
          items={states}
          borderColor={theme.border}
          selected={states.indexOf(filter.status)}
          onChange={(i: number) => setFilter({ ...filter, status: states[i] })}
          wide
        />
      </Field>
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
      <Button icon={<IconClose />} label="clear" wide onClick={() => setFilter(DEFAULT_FILTER)} />
    </>
  );
}
