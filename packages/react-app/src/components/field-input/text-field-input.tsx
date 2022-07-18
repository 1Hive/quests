import { TextInput, Markdown } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { ReactNode } from 'react';
import { CollapsableBlock } from 'src/components/collapsable-block';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { ConditionalWrapper } from '../utils/util';
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
  isMarkDown?: boolean;
  ellipsis?: ReactNode;
  tooltip?: React.ReactNode;
  disableLinks?: boolean;
  blockVisibility?: 'visible' | 'collapsed' | 'hidden';
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
  isMarkDown = false,
  ellipsis,
  tooltip,
  onBlur = noop,
  error,
  disableLinks = false,
  blockVisibility = 'visible',
}: Props) {
  const readOnlyContent = (
    <>
      {isMarkDown ? (
        <Markdown
          normalized
          content={value.replaceAll('\n-', '\n\n-')}
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
                  visible: blockVisibility !== 'hidden' ? 'true' : undefined,
                  collapsed: blockVisibility === 'collapsed' ? 'true' : undefined,
                  copyable: true,
                  usePre: true,
                },
              },
              code: {
                component: CollapsableBlock,
                props: {
                  label: 'code block',
                  type: 'code',
                  visible: blockVisibility !== 'hidden' ? 'true' : undefined,
                  collapsed: blockVisibility === 'collapsed' ? 'true' : undefined,
                  copyable: true,
                  usePre: true,
                },
              },
              img: {
                component: CollapsableBlock,
                props: {
                  label: 'image',
                  type: 'image',
                  visible: blockVisibility !== 'hidden' ? 'true' : undefined,
                  collapsed: blockVisibility === 'collapsed' ? 'true' : undefined,
                },
              },
              a: {
                component: disableLinks ? 'span' : 'a',
                props: {
                  target: '_blank',
                  tabIndex: '-1',
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
            <MaxLineStyled maxLine={maxLine}>{readOnlyContent}</MaxLineStyled>
            {ellipsis}
          </TextFieldWrapperStyled>
        ) : (
          readOnlyContent
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
