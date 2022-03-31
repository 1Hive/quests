import { TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { ReactNode } from 'react';
import { FieldInput } from './field-input';

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
  tooltip?: string;
  tooltipDetail?: ReactNode;
  suffix?: string;
  compact?: boolean;
  onBlur?: Function;
  error?: string | false;
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
  tooltipDetail,
  suffix = '',
  compact = false,
  onBlur = noop,
  error,
}: Props) {
  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      tooltipDetail={tooltipDetail}
      compact={compact}
      isLoading={isLoading}
      error={error}
    >
      {isEdit ? (
        <TextInput
          id={id}
          type="number"
          wide={wide}
          onChange={onChange}
          placeHolder={placeHolder}
          onBlur={onBlur}
          max={max}
          min={min}
          isRequired={isRequired}
        />
      ) : (
        value + suffix
      )}
    </FieldInput>
  );
}
