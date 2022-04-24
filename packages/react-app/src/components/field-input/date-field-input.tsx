import { useTheme } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import { ThemeInterface } from 'src/styles/theme';
import { GUpx, isDarkTheme } from 'src/utils/style.util';
import styled, { css as _css } from 'styled-components';
import { addTime, dateFormat, ONE_HOUR_IN_MS } from '../../utils/date.utils';
import { FieldInput } from './field-input';

// #region StyledComponents

const InputStyled = styled.input<{
  theme: ThemeInterface;
  wide?: boolean;
  isDarkTheme?: boolean;
}>`
  ${(props: any) =>
    props.wide &&
    _css`
      width: 100%;
    `}
  border: 1px solid ${({ theme }: any) => theme.border};
  border-radius: 12px;
  background-color: ${({ theme }: any) => theme.surface};
  height: 40px;
  padding: ${GUpx(1)};
  font-size: 14px;
  &:focus-visible {
    border: 1px solid ${({ theme }: any) => theme.accent};
    outline: none;
  }
  &::-webkit-calendar-picker-indicator {
    ${(props) =>
      props.isDarkTheme &&
      _css`
        filter: invert();
      `};
  }
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  value?: Date | null;
  css?: CSSProperties;
  tooltip?: ReactNode;
  compact?: boolean;
  wide?: boolean;
  formik?: any;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string | false;
};

function DateFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  value = new Date(Date.now()),
  onChange = noop,
  css,
  tooltip,
  compact = false,
  wide = false,
  formik,
  onBlur = noop,
  error,
}: Props) {
  const theme = useTheme();

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.currentTarget) {
      const newValue = e.currentTarget.value
        ? // Set noon to prevent rounding form changing date
          addTime(new Date(e.currentTarget.value), 12 * ONE_HOUR_IN_MS)
        : null;
      if (formik) formik.setFieldValue(id, newValue);
      else onChange({ ...e, currentTarget: { ...e.currentTarget, value: newValue } });
    }
  };

  const loadableContent = isEdit ? (
    <InputStyled
      id={id}
      type="date"
      value={value ? dateFormat(value, 'ISO') : ''}
      onChange={handleChange}
      onBlur={onBlur}
      style={css}
      wide={wide}
      theme={theme}
      // eslint-disable-next-line no-underscore-dangle
      isDarkTheme={isDarkTheme(theme)}
    />
  ) : (
    <span>{value ? new Date(value).toDateString() : 'Not set'}</span>
  );

  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      compact={compact}
      isLoading={isLoading}
      error={error}
      wide={wide}
    >
      {loadableContent}
    </FieldInput>
  );
}

const DateFieldInputFormik = connect(DateFieldInput);
export default DateFieldInput;
export { DateFieldInputFormik };
