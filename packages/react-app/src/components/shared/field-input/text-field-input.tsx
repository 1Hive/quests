import { Field, TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
// eslint-disable-next-line import/no-unresolved
import parse from 'html-react-parser';
import styled from 'styled-components';

// #region Styled

const TextContainerStyled = styled.div`
  white-space: pre-wrap;
`;

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  maxLength?: number;
  onChange?: Function;
  placeHolder?: string;
  value?: string;
  wide?: boolean;
  multiline?: boolean;
  autoLinks?: boolean;
  fontSize?: string;
  rows?: number;
  compact?: boolean;
  css?: React.CSSProperties;
};
export default function TextFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  fontSize,
  maxLength,
  placeHolder = '',
  value = '',
  onChange = noop,
  wide = false,
  multiline = false,
  autoLinks = false,
  rows = 10,
  compact = false,
  css,
}: Props) {
  if (isLoading)
    return (
      <FieldStyled label={label} key={id} compact={compact}>
        <Skeleton />
      </FieldStyled>
    );
  const content = value.substring(0, maxLength);
  const readOnlyContent = (
    <>
      {autoLinks
        ? parse(content.replace(/(https?:\/\/)([^ ]+)/g, '<a target="_blank" href="$&">$2</a>'))
        : content}
      {maxLength && value.length > maxLength && <span title={value}>...</span>}
    </>
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
      rows={rows}
    />
  ) : (
    <TextContainerStyled style={{ ...css, fontSize }}>{readOnlyContent}</TextContainerStyled>
  );
  return label ? (
    <Field label={label} key={id}>
      {loadableContent}
    </Field>
  ) : (
    loadableContent
  );
}
