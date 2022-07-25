import {
  Button,
  SearchInput,
  DropDown,
  useTheme,
  useViewport,
  IconUp,
  IconClose,
} from '@1hive/1hive-ui';
import { useEffect, useState, useMemo } from 'react';
import { useFilterContext } from 'src/contexts/filter.context';
import { ThemeInterface } from 'src/styles/theme';
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
  theme: ThemeInterface;
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

// #endregion

type Props = {
  compact?: boolean;
};

export function Filter({ compact }: Props) {
  const { filter, setFilter, toggleFilter } = useFilterContext();
  const theme = useTheme();
  const { below, width } = useViewport();
  const states = [ENUM_QUEST_STATE.All, ENUM_QUEST_STATE.Active, ENUM_QUEST_STATE.Expired];
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
          <FieldInput
            className="flex-grow"
            label={!compact ? 'Title' : ''}
            wide={isSmallResolution}
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
            wide={isSmallResolution}
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
            wide={isSmallResolution}
            compact={compact}
          />
          <FieldInput label={!compact ? 'Status' : ''} wide={isSmallResolution} id="filterStatus">
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
