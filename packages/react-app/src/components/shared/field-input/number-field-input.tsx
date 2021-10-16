import { Field, TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import Skeleton from 'react-loading-skeleton';

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
  suffix?: string;
};

export default function NumberFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = 0,
  onChange = noop,
  wide = false,
  max,
  min,
  isRequired = false,
  suffix = '',
}: Props) {
  let content;
  if (isEdit)
    content = (
      <TextInput
        id={id}
        type="number"
        wide={wide}
        onChange={onChange}
        placeHolder={placeHolder}
        max={max}
        min={min}
        isRequired={isRequired}
      />
    );
  else content = value + suffix;
  return (
    <Field label={label} key={id}>
      {isLoading ? <Skeleton /> : content}
    </Field>
  );
}
