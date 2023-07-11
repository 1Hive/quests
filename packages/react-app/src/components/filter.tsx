import { Button, DropDown, useTheme, useViewport } from '@1hive/1hive-ui';
import { useEffect, useState, useMemo } from 'react';
import { useFilterContext } from 'src/contexts/filter.context';
import { QuestStatus } from 'src/enums/quest-status.enum';
import { ThemeInterface } from 'src/styles/theme';
import { GUpx } from 'src/utils/style.util';
import styled, { css } from 'styled-components';
import { DEFAULT_FILTER } from '../constants';
import DateFieldInput from './field-input/date-field-input';
import { FieldInput } from './field-input/field-input';
import TextFieldInput from './field-input/text-field-input';

// #region StyledComponents

const StatusDropdownStyled = styled(DropDown)`
  border: 1px solid ${(props: any) => props.borderColor};
`;

const FilterWrapperStyled = styled.div<{
  colDisplay?: boolean;
  isSmallResolution?: boolean;
  theme: ThemeInterface;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  flex-wrap: ${({ colDisplay }) => (colDisplay ? 'wrap' : 'no-wrap')};

  padding: 0 ${GUpx(2)};

  column-gap: ${GUpx(4)};

  ${({ isSmallResolution }) =>
    isSmallResolution
      ? css`
          margin-right: ${GUpx(2.5)};
          padding-top: ${GUpx(2)};
          padding-bottom: ${GUpx(2)};

          border: 1px solid ${({ theme }) => theme.border};
          border-radius: 16px;
          margin: 0 28px 0 8px;
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

const ButtonLineStyled = styled.div<{ isSmallResolution: boolean }>`
  margin: ${GUpx(2)} ${GUpx(3)} 0 ${GUpx(3)};
  display: flex;
  column-gap: ${GUpx(2)};

  ${({ isSmallResolution }) =>
    isSmallResolution &&
    css`
      width: 100%;
      button {
        width: 100%;
      }
    `}
  :disabled {
    border: 1px solid #5d5d52;
  }
`;

const SearchTextInputWrapperStyled = styled.div<{ wide: boolean }>`
  flex-grow: 1;
  ${({ wide }) => wide && 'width: 100%;'}
`;

// #endregion

type Props = {
  compact?: boolean;
};

const QuestStatusOptions = [QuestStatus.Active, QuestStatus.Expired, QuestStatus.All];

export function Filter({ compact }: Props) {
  const { filter, setFilter, toggleFilter } = useFilterContext();
  const theme = useTheme();
  const { below, width } = useViewport();
  const { isFilterShown } = useFilterContext();
  const isSmallResolution = useMemo(() => below('medium'), [width]);
  const [isFilteringOriginalState, setIsFilteringOriginalState] = useState(false);

  useEffect(() => {
    setIsFilteringOriginalState(filter === DEFAULT_FILTER);
  }, [filter]);

  return (
    <>
      {(isFilterShown || !isSmallResolution) && (
        <FilterWrapperStyled colDisplay={isSmallResolution} isSmallResolution={isSmallResolution}>
          <SearchTextInputWrapperStyled wide={isSmallResolution}>
            <TextFieldInput
              id="filterSearch"
              label={!compact ? 'Search' : ''}
              wide
              placeHolder="Search by title, description, or address"
              value={filter.search}
              onChange={(e: any) => setFilter({ ...filter, search: e.currentTarget.value })}
              compact={compact}
              tooltip="Search accross title, description, and address and return in rank order. There is support for & (AND) and | (OR) operators."
              isEdit
            />
          </SearchTextInputWrapperStyled>
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
            wide={isSmallResolution}
            compact={compact}
          />
          <FieldInput label={!compact ? 'Status' : ''} wide={isSmallResolution} id="filterStatus">
            <StatusDropdownStyled
              id="filterStatus"
              items={QuestStatusOptions}
              borderColor={theme.border}
              selected={QuestStatusOptions.indexOf(filter.status)}
              onChange={(i: number) => setFilter({ ...filter, status: QuestStatusOptions[i] })}
              wide
              compact={compact}
            />
          </FieldInput>
          <ButtonLineStyled isSmallResolution={isSmallResolution}>
            <Button
              label="Reset"
              mode="strong"
              disabled={isFilteringOriginalState}
              wide={below('medium')}
              onClick={() => setFilter(DEFAULT_FILTER)}
            />
            {isSmallResolution && <Button label="Close" onClick={() => toggleFilter(false)} />}
          </ButtonLineStyled>
        </FilterWrapperStyled>
      )}
    </>
  );
}
