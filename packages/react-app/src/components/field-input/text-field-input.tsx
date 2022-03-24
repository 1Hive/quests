import { TextInput, Markdown } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { ReactNode } from 'react';
import { CollapsableBlock } from 'src/collapsable-block';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

const MaxLineStyled = styled.div`
  margin-bottom: ${GUpx()};
  display: -webkit-box;
  -webkit-line-clamp: ${(props: any) => props.maxLine};
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
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
  isMarkDown = false,
  ellipsis,
  tooltipDetail,
  tooltip,
}: Props) {
  const readOnlyContent = (
    <>
      {isMarkDown ? (
        <Markdown
          normalized
          content={value}
          markdownToJsxOptions={(o: any) => ({
            ...o,
            wrapper: 'div',

            overrides: {
              p: {
                component: 'div',
              },
              pre: {
                component: CollapsableBlock,
                props: {
                  label: 'block',
                  visible: !maxLine,
                },
              },
              code: {
                component: CollapsableBlock,
                props: {
                  label: 'code block',
                  type: 'code',
                  visible: !maxLine,
                },
              },
              img: {
                component: CollapsableBlock,
                props: {
                  label: 'image',
                  type: 'image',
                  visible: !maxLine,
                },
              },
              a: {
                component: 'a',
                props: {
                  target: '_blank',
                },
              },
            },
          })}
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
          <MaxLineStyled maxLine={maxLine}>{readOnlyContent}</MaxLineStyled>
          {ellipsis}
        </div>
      ) : (
        readOnlyContent
      )}
    </div>
  );
  return (
    <FieldInput
      label={label}
      tooltip={tooltip}
      tooltipDetail={tooltipDetail}
      id={id}
      compact={compact}
      isLoading={isLoading}
    >
      {loadableContent}
    </FieldInput>
  );
}
