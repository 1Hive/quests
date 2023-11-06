import { TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region StyledComponents

const WrapperStyled = styled.div`
  input.disabled {
    opacity: 0.5;
  }
`;

// #endregion

type Props = {
  id?: string;
  isEdit?: boolean;
  isLoading?: boolean;
  isRequired?: boolean;
  label?: string;
  max?: number;
  min?: number;
  onChange?: Function;
  placeHolder?: string;
  value?: number;
  wide?: boolean;
  tooltip?: ReactNode;
  suffix?: string;
  compact?: boolean;
  onBlur?: Function;
  error?: string | false;
  disabled?: boolean;
};

export default function NumberFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  placeHolder = '',
  value = 0,
  onChange = noop,
  wide = false,
  max,
  min,
  isRequired = false,
  tooltip,
  suffix = '',
  compact = false,
  onBlur = noop,
  error,
  disabled = false,
}: Props) {
  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      compact={compact}
      isLoading={isLoading}
      error={error}
    >
      {isEdit ? (
        <WrapperStyled>
          <TextInput
            id={id}
            type={disabled ? 'text' : 'number'}
            wide={wide}
            onChange={onChange}
            placeHolder={placeHolder}
            onBlur={onBlur}
            disabled={disabled}
            max={max}
            min={min}
            isRequired={isRequired}
            value={disabled ? '∞' : value}
          />
        </WrapperStyled>
      ) : (
        value + suffix
      )}
    </FieldInput>
  );
}
