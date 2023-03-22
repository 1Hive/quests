/* eslint-disable no-nested-ternary */
import MarkdownEditor from '@uiw/react-markdown-editor';
import { Markdown } from '@1hive/1hive-ui';
import { ReactNode, useMemo } from 'react';
import { noop } from 'lodash-es';
import styled from 'styled-components';
import { GUpx } from 'src/utils/style.util';
import { FieldInput } from './field-input';
import { CollapsableBlock } from '../collapsable-block';

// #region Styled

const BlockStyled = styled.div<{ wide?: boolean }>`
  max-width: 100%;
  ${({ wide }) => wide && 'width: 100%;'}
`;

const MarkdownEditorStyled = styled(MarkdownEditor)<{ rows: number }>`
  min-height: ${({ rows }) => rows * 22.5 + 30}px;
  border-radius: 12px;
  border: 1px solid #5c5c52;

  &:focus-within {
    outline: none;
    border-color: #f7f7ce;
  }

  // Overide the default style of the editor
  --color-canvas-subtle: #303030;
  --color-fg-default: #8d8d79;

  .cm-line ::selection {
    background: #f7f7ce;
  }
`;

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

const MarkdownWrapperStyled = styled.div<{ maxLine?: number }>`
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
  value?: string;
  wide?: boolean;
  rows?: number;
  maxLine?: number;
  ellipsis?: ReactNode;
  compact?: boolean;
  tooltip?: ReactNode;
  disableLinks?: boolean;
  blockVisibility?: 'visible' | 'collapsed' | 'hidden';
  onBlur?: any;
  error?: string | false;
  placeHolder?: string;
};
export default function MarkdownFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  value = '',
  onChange = noop,
  wide = false,
  rows = 10,
  compact = false,
  tooltip,
  maxLine,
  ellipsis,
  onBlur = noop,
  error,
  disableLinks = false,
  blockVisibility = 'visible',
  placeHolder,
}: Props) {
  const parsedValue = useMemo(() => value.replaceAll(/\n([^|])/g, '\n\n$1'), [value]);
  const readOnlyContent = (
    <Markdown
      normalized
      content={parsedValue}
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
  );

  return (
    <FieldInput
      wide={wide}
      id={id}
      label={label}
      tooltip={tooltip}
      compact={compact}
      isLoading={isLoading}
      error={error}
    >
      <BlockStyled wide={wide}>
        {isEdit ? (
          <MarkdownEditorStyled
            onChange={onChange(id)}
            onBlur={onBlur}
            value={value}
            rows={rows}
            placeholder={placeHolder}
          />
        ) : maxLine ? (
          <MarkdownWrapperStyled>
            <MaxLineStyled maxLine={maxLine}>{readOnlyContent}</MaxLineStyled>
            {ellipsis}
          </MarkdownWrapperStyled>
        ) : (
          readOnlyContent
        )}
      </BlockStyled>
    </FieldInput>
  );
}
