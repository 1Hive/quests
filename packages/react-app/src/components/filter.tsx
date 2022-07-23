import { Button, SearchInput, DropDown, useTheme, useViewport } from '@1hive/1hive-ui';
import { useFilterContext } from 'src/contexts/filter.context';
import { GUpx } from 'src/utils/style.util';
import styled, { css } from 'styled-components';
import { DEFAULT_FILTER, ENUM_QUEST_STATE } from '../constants';
import DateFieldInput from './field-input/date-field-input';
import { FieldInput } from './field-input/field-input';

// #region StyledComponents

const StatusDropdownStyled = styled(DropDown)`
  border: 1px solid ${(props: any) => props.borderColor};
`;

const FilterWrapperStyled = styled.div<{
  colDisplay?: boolean;
  isSmallResolution?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  flex-wrap: ${({ colDisplay }) => (colDisplay ? 'wrap' : 'no-wrap')};

  padding: 0 ${GUpx(2)};

  ${({ isSmallResolution }) =>
    isSmallResolution
      ? css`
          margin-right: 20px;
          padding-bottom: ${GUpx(2)};
        `
      : css`
          height: 80px;
        `} // Size of scrollbar because parent is 100% + 20px

  // Each filter having a sibling
  & > div + div {
    ${({ isSmallResolution }) =>
      !isSmallResolution &&
      css`
        margin-left: ${GUpx(1)};
      `}
  }
`;

const ResetButtonStyled = styled(Button)`
  margin: ${GUpx(2)} ${GUpx(3)} 0 ${GUpx(3)};
  :disabled {
    border: 1px solid #5d5d52;
  }
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
  const isFilteringOriginalState =
    !filter.title &&
    !filter.description &&
    !filter.minExpireTime &&
    filter.status === ENUM_QUEST_STATE.Active;

  return (
    <>
      {(isFilterShown || !below('medium')) && (
        <FilterWrapperStyled colDisplay={below('medium')} isSmallResolution={below('medium')}>
          <FieldInput
            className="flex-grow"
            label={!compact ? 'Title' : ''}
            wide={below('medium')}
            id="filterTitle"
          >
            <SearchInput
              id="filterTitle"
              placeholder="Search by title"
              value={filter.title}
              onChange={(title: string) => setFilter({ ...filter, title })}
              wide
              compact={compact}
            />
          </FieldInput>
          <FieldInput
            className="flex-grow"
            label={!compact ? 'Description' : ''}
            wide={below('medium')}
            id="filterDescription"
          >
            <SearchInput
              id="filterDescription"
              placeholder="Search by description"
              value={filter.description}
              onChange={(description: string) => setFilter({ ...filter, description })}
              wide
              compact={compact}
            />
          </FieldInput>
          <DateFieldInput
            id="minExpireTime"
            value={filter.minExpireTime}
            label={!compact ? 'Expire time' : ''}
            tooltip="will show all quests that are not expired until this date"
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
          <FieldInput label={!compact ? 'Status' : ''} wide={below('medium')} id="filterStatus">
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
          <ResetButtonStyled
            label="Reset"
            mode="strong"
            disabled={isFilteringOriginalState}
            wide={below('medium')}
            onClick={() => setFilter(DEFAULT_FILTER)}
          />
        </FilterWrapperStyled>
      )}
    </>
  );
}
