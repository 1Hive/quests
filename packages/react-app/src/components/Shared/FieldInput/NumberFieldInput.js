import PropTypes from 'prop-types';
import React from 'react';
import { Field, TextInput } from '@1hive/1hive-ui';
import Skeleton from 'react-loading-skeleton';
import { emptyFunc } from '../../../utils/class-util';

export default function NumberFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = 0,
  onChange = emptyFunc,
  wide = false,
  max,
  min,
  isRequired = false,
}) {
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
  else content = value;
  return (
    <Field label={label} key={id}>
      {isLoading ? <Skeleton /> : content}
    </Field>
  );
}

NumberFieldInput.propTypes = {
  id: PropTypes.string,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  placeHolder: PropTypes.string,
  value: PropTypes.number,
  wide: PropTypes.bool,
};
