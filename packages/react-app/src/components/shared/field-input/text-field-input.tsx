import { Field, TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  placeHolder?: string;
  value?: string;
  wide?: boolean;
  multiline?: boolean;
  autoLinks?: boolean;
  fontSize?: string;
  css?: React.CSSProperties;
};
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
  autoLinks = false,
  css,
}: Props) {
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
    <span style={{ fontSize }}>
      {autoLinks
        ? value.split(' ').map((x) =>
            x.startsWith('http') ? (
              <a target="_blank" href={x} rel="noreferrer" key={x}>
                {x}
              </a>
            ) : (
              `${x} `
            ),
          )
        : value}
    </span>
  );
  return label ? (
    <Field label={label} key={id}>
      {loadableContent}
    </Field>
  ) : (
    loadableContent
  );
}
