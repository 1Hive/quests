import { Field, TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function TextFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = '',
  fontSize = '',
  onChange = noop,
  wide = false,
  multiline = false,
  css = undefined,
}) {
  if (isLoading)
    return (
      <Field label={label} key={id}>
        <Skeleton />
      </Field>
    );

  const loadableContent = isEdit ? (
    <TextInput
      id={id}
      value={value ?? ''}
      wide={wide}
      onChange={onChange}
      placeHolder={placeHolder}
      multiline={multiline}
      style={css}
    />
  ) : (
    <span style={{ fontSize }}>{value}</span>
  );
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
