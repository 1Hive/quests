import MarkdownEditor from '@uiw/react-markdown-editor';
import { Markdown } from '@1hive/1hive-ui';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { noop } from 'lodash-es';
import styled from 'styled-components';
import { FieldInput } from './field-input';
import { CollapsableBlock } from '../collapsable-block';

const FieldInputStyled = styled(FieldInput)`
  width: 100%;
`;

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: ReactNode;
  onChange: Function;
  value?: string;
  wide?: boolean;
  isMarkDown?: boolean;
  compact?: boolean;
  tooltip?: ReactNode;
  disableLinks?: boolean;
  blockVisibility?: 'visible' | 'collapsed' | 'hidden';
  onBlur?: any;
  error?: string | false;
};
export default function MarkdownFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  value = '',
  onChange,
  wide = false,
  compact = false,
  tooltip,
  isMarkDown,
  onBlur = noop,
  error,
  disableLinks = false,
  blockVisibility = 'visible',
}: Props) {
  const parsedValue = useMemo(
    () => (isMarkDown ? value.replaceAll(/\n([^|])/g, '\n\n$1') : value),
    [value, isMarkDown],
  );

  return (
    <FieldInputStyled
      wide={wide}
      id={id}
      label={label}
      tooltip={tooltip}
      compact={compact}
      isLoading={isLoading}
      error={error}
    >
      {isEdit ? (
        <MarkdownEditor
          onChange={(val, viewUpdate) => onChange(val)}
          onBlur={onBlur}
          value={value}
        />
      ) : (
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
      )}
    </FieldInputStyled>
  );
}
