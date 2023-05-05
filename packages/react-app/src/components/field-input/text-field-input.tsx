import { TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { ReactNode } from 'react';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

const MaxLineStyled = styled.div<{ maxLine: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.maxLine};
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  p {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
`;

const BlockStyled = styled.div<{ wide?: boolean }>`
  max-width: 100%;
  ${({ wide }) => wide && 'width: 100%;'}
`;

const TextFieldWrapperStyled = styled.div<{ maxLine?: number }>`
  ${({ maxLine }) => (maxLine ? `height: ${maxLine + 1 * 30}px;` : '')};
  overflow: hidden;
  margin-bottom: ${GUpx(1)};
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: ReactNode;
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
  ellipsis?: ReactNode;
  tooltip?: React.ReactNode;
  onBlur?: Function;
  error?: string | false;
};
export default function TextFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
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
  ellipsis,
  tooltip,
  onBlur = noop,
  error,
}: Props) {
  const loadableContent = isEdit ? (
    <BlockStyled wide={wide}>
      <TextInput
        id={id}
        value={value ?? ''}
        wide={wide}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeHolder}
        multiline={multiline}
        style={css}
        rows={rows}
      />
    </BlockStyled>
  ) : (
    <BlockStyled wide={wide}>
      <div style={{ ...css, fontSize }}>
        {maxLine ? (
          <TextFieldWrapperStyled>
            <MaxLineStyled maxLine={maxLine}>{value}</MaxLineStyled>
            {ellipsis}
          </TextFieldWrapperStyled>
        ) : (
          value
        )}
      </div>
    </BlockStyled>
  );
  return (
    <>
      <FieldInput
        label={label}
        tooltip={tooltip}
        id={id}
        error={error}
        compact={compact}
        isLoading={isLoading}
        wide={wide}
      >
        {loadableContent}
      </FieldInput>
    </>
  );
}
