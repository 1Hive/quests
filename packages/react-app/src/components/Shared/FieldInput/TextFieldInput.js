import PropTypes from 'prop-types';
import React from 'react';
import { Field, TextInput } from '@1hive/1hive-ui';
import Skeleton from 'react-loading-skeleton';
import { emptyFunc } from '../../../utils/class-util';

export default function TextFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = '',
  fontSize = '',
  onChange = emptyFunc,
  wide = false,
  multiline = false,
  css = undefined,
}) {
  let content;
  if (isEdit)
    content = (
      <TextInput
        id={id}
        value={value ?? ''}
        wide={wide}
        onChange={onChange}
        placeHolder={placeHolder}
        multiline={multiline}
        style={css}
      />
    );
  else content = <span style={{ fontSize }}>{value}</span>;
  const loadableContent = isLoading ? <Skeleton /> : content;
  return label ? (
    <Field label={label} key={id}>
      {loadableContent}
    </Field>
  ) : (
    loadableContent
  );
}

TextFieldInput.propTypes = {
  id: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
  wide: PropTypes.bool,
  multiline: PropTypes.bool,
  fontSize: PropTypes.string,
};
