import { useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { CSSProperties, ReactNode } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { dateFormat } from '../../utils/date.utils';
import { FieldInput } from './field-input';

// #region StyledComponents

const InputStyled = styled.input`
  ${(props: any) => (props.wide ? 'width:100%;' : '')}
  border: 1px solid ${(props: any) => props.borderColor};
  border-radius: 12px;
  background-color: ${({ background }: any) => background};
  height: 40px;
  padding: ${GUpx()};
  font-size: 14px;
  &:focus-visible {
    border: 1px solid ${(props: any) => props.focusBorderColor};
    outline: none;
  }
  &::-webkit-calendar-picker-indicator {
    ${(props: any) => (props.isDarkTheme ? 'filter: invert();' : '')};
  }
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  value?: number | null;
  css?: CSSProperties;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  compact?: boolean;
  wide?: boolean;
};

export default function DateFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  value = Date.now(),
  onChange = noop,
  css,
  tooltip,
  tooltipDetail,
  compact = false,
  wide = false,
}: Props) {
  const theme = useTheme();
  const valFormat = dateFormat(value, 'iso');

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.currentTarget) {
      onChange(e);
    }
  };

  const loadableContent = isEdit ? (
    <InputStyled
      id={id}
      type="date"
      defaultValue={valFormat}
      onChange={handleChange}
      style={css}
      background={theme.surface}
      wide={wide}
      borderColor={theme.border}
      focusBorderColor={theme.accent}
      // eslint-disable-next-line no-underscore-dangle
      isDarkTheme={theme._appearance === 'dark'}
    />
  ) : (
    <span>{value ? new Date(value).toDateString() : 'Not set'}</span>
  );

  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      tooltipDetail={tooltipDetail}
      compact={compact}
      isLoading={isLoading}
    >
      {loadableContent}
    </FieldInput>
  );
}
