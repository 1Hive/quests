import { Button, SearchInput, DropDown, useTheme, useViewport } from '@1hive/1hive-ui';
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
  flex-wrap: ${({ colDisplay }: any) => (colDisplay ? 'wrap' : 'no-wrap')};
  padding: 0 ${GUpx(2)};
  ${({ isSmallResolution }: any) =>
    isSmallResolution &&
    `
    margin-right: 20px;
    padding-bottom: ${GUpx(2)};
    `} // Size of scrollbar because parent is 100% + 20px
  // Each filter having a sibling
  & > div + div {
    ${({ isSmallResolution }: any) => !isSmallResolution && `margin-left: ${GUpx()};`}
  }
`;

const ResetButtonStyled = styled(Button)`
  margin: ${GUpx(2)} ${GUpx(3)} 0 ${GUpx(3)};
`;

// #endregion

type Props = {
  compact?: boolean;
};

export function Filter({ compact }: Props) {
  const { filter, setFilter } = useFilterContext();
  const theme = useTheme();
  const { below } = useViewport();
  const states = [ENUM_QUEST_STATE.All, ENUM_QUEST_STATE.Active, ENUM_QUEST_STATE.Expired];
  const { isFilterShown } = useFilterContext();

  return (
    <>
      {(isFilterShown || !below('medium')) && (
        <FilterWrapperStyled colDisplay={below('medium')} isSmallResolution={below('medium')}>
          <FieldInput className="flex-grow" label={!compact ? 'Title' : ''} wide={below('medium')}>
            <SearchInput
              id="filterTitle"
              placeholder="Search by title"
              value={filter.title}
              onChange={(x: string) => setFilter({ ...filter, title: x })}
              wide
              compact={compact}
            />
          </FieldInput>
          <FieldInput
            className="flex-grow"
            label={!compact ? 'Description' : ''}
            wide={below('medium')}
          >
            <SearchInput
              id="filterDescription"
              placeholder="Search by description"
              value={filter.description}
              onChange={(x: string) => setFilter({ ...filter, description: x })}
              wide
              compact={compact}
            />
          </FieldInput>
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
            wide={below('medium')}
            compact={compact}
          />
          <FieldInput label={!compact ? 'Status' : ''} wide={below('medium')}>
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
          {
            // TODO : We don't have this information available in subgraph
            /* <AmountFieldInput
          id="filterBounty"
          label="Min available bounty"
          value={filter.bounty}
          onChange={(x: any) => setFilter({ ...filter, bounty: x }, true)}
          wide={!below('medium')}
        /> */
          }

          {/* <TagFieldInput
          id="filterTags"
          label="Tags"
          isEdit
        wide={!below('medium')}
          placeholder="Search"
          value={filter.tags}
          onChange={(x: string[]) => setFilter({ ...filter, tags: x })}
        /> TODO : Restore after MVP */}
          <ResetButtonStyled
            label="Reset"
            mode="strong"
            wide={below('medium')}
            onClick={() => setFilter(DEFAULT_FILTER)}
          />
        </FilterWrapperStyled>
      )}
    </>
  );
}
