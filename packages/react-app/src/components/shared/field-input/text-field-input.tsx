import { Field, TextInput, Markdown } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

// #region Styled

const TextContainerStyled = styled.div`
  white-space: pre-wrap;
`;

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;

const EllipsisStyled = styled.div`
  overflow: hidden;
  display: inline-block;
  word-break: break-word;
  text-align: justify;
  max-height: 12em;
  line-height: 1.2em;
`;

// #endregion

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
  fontSize?: string;
  rows?: number;
  compact?: boolean;
  css?: React.CSSProperties;
  maxLine?: number;
  isMarkDown?: boolean;
};
export default function TextFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  fontSize,
  placeHolder = '',
  value = '',
  onChange = noop,
  wide = false,
  multiline = false,
  rows = 10,
  compact = false,
  css,
  maxLine,
  isMarkDown = false,
}: Props) {
  if (isLoading)
    return (
      <FieldStyled label={label} key={id} compact={compact}>
        <Skeleton />
      </FieldStyled>
    );
  const readOnlyContent = <>{isMarkDown ? <Markdown normalized content={value} /> : value}</>;
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
    <TextContainerStyled style={{ ...css, fontSize }}>
      <EllipsisStyled className="ellipsis">{readOnlyContent}</EllipsisStyled>
    </TextContainerStyled>
  );
  return label ? (
    <Field label={label} key={id}>
      {loadableContent}
    </Field>
  ) : (
    loadableContent
  );
}
