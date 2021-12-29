import { Field, TextInput, Markdown } from '@1hive/1hive-ui';

import { noop } from 'lodash-es';
import React, { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import HelpIcon from './help-icon';
// #region Styled

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;

const MaxHeightStyled = styled.div`
  overflow: hidden;
  margin-bottom: 8px;
  line-height: 1.4em;
  ${({ maxLine }: any) => (maxLine ? `max-height: ${maxLine * 1.4}em;` : '')}

  p {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
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
  ellipsis?: ReactNode;
  tooltip?: string;
  tooltipDetail?: React.ReactNode;
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
  ellipsis,
  tooltipDetail,
  tooltip,
}: Props) {
  if (isLoading)
    return (
      <FieldStyled label={label} key={id} compact={compact}>
        <Skeleton />
      </FieldStyled>
    );
  const readOnlyContent = (
    <>
      {isMarkDown ? (
        <Markdown
          normalized
          markdownToJsxOptions={(o: any) => ({
            ...o,
          })}
          content={value}
        />
      ) : (
        value
      )}
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
    <div style={{ ...css, fontSize }}>
      {maxLine ? (
        <div>
          <MaxHeightStyled maxLine={maxLine}>{readOnlyContent}</MaxHeightStyled>
          {ellipsis}
        </div>
      ) : (
        readOnlyContent
      )}
    </div>
  );
  return label ? (
    <>
      <Field
        label={
          <>
            {label}
            {tooltip && <HelpIcon tooltip={tooltip} tooltipDetail={tooltipDetail} />}
          </>
        }
        key={id}
      >
        {loadableContent}
      </Field>
      {/* {tooltip?(

        )} */}
    </>
  ) : (
    loadableContent
  );
}
