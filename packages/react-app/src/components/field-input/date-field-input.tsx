import { useTheme } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import { CSSProperties, ReactNode } from 'react';
import { GUpx, isDarkTheme } from 'src/utils/style.util';
import styled from 'styled-components';
import { addTime, dateFormat, ONE_HOUR_IN_MS } from '../../utils/date.utils';
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
  value?: Date | null;
  css?: CSSProperties;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  compact?: boolean;
  wide?: boolean;
  formik?: any;
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
  tooltipDetail,
  compact = false,
  wide = false,
  formik,
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
      style={css}
      background={theme.surface}
      wide={wide}
      borderColor={theme.border}
      focusBorderColor={theme.accent}
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
      tooltipDetail={tooltipDetail}
      compact={compact}
      isLoading={isLoading}
    >
      {loadableContent}
    </FieldInput>
  );
}

const DateFieldInputFormik = connect(DateFieldInput);
export default DateFieldInput;
export { DateFieldInputFormik };
