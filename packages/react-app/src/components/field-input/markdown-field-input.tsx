import MarkdownEditor from '@uiw/react-markdown-editor';
import { Markdown, FieldInput } from '@1hive/1hive-ui';
import { CSSProperties, ReactNode } from 'react';
import { noop } from 'lodash-es';

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
  css?: CSSProperties;
  maxLine?: number;
  ellipsis?: ReactNode;
  tooltip?: ReactNode;
  disableLinks?: boolean;
  blockVisibility?: 'visible' | 'collapsed' | 'hidden';
  onBlur?: Function;
  error?: string | false;
};
export default function MarkdownFieldInput({
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
  disableLinks = false,
  blockVisibility = 'visible',
}: Props) {
  return (
    // <FieldInput
    //   id={id}
    //   label={label}
    //   tooltip={tooltip}
    //   compact={compact}
    //   isLoading={isLoading}
    //   error={error}
    // >
    //   {isEdit ? (
    <MarkdownEditor />
    //   ) : (
    //     <Markdown
    //       normalized
    //       content={parsedValue}
    //       markdownToJsxOptions={(o: any) => ({
    //         ...o,
    //         wrapper: 'div',
    //         overrides: {
    //           p: {
    //             component: 'div',
    //           },
    //           pre: {
    //             component: CollapsableBlock,
    //             props: {
    //               label: 'block',
    //               visible: blockVisibility !== 'hidden' ? 'true' : undefined,
    //               collapsed: blockVisibility === 'collapsed' ? 'true' : undefined,
    //               copyable: true,
    //               usePre: true,
    //             },
    //           },
    //           code: {
    //             component: CollapsableBlock,
    //             props: {
    //               label: 'code block',
    //               type: 'code',
    //               visible: blockVisibility !== 'hidden' ? 'true' : undefined,
    //               collapsed: blockVisibility === 'collapsed' ? 'true' : undefined,
    //               copyable: true,
    //               usePre: true,
    //             },
    //           },
    //           img: {
    //             component: CollapsableBlock,
    //             props: {
    //               label: 'image',
    //               type: 'image',
    //               visible: blockVisibility !== 'hidden' ? 'true' : undefined,
    //               collapsed: blockVisibility === 'collapsed' ? 'true' : undefined,
    //             },
    //           },
    //           a: {
    //             component: disableLinks ? 'span' : 'a',
    //             props: {
    //               target: '_blank',
    //               tabIndex: '-1',
    //             },
    //           },
    //         },
    //       })}
    //     />
    //   )}
    // </FieldInput>
  );
}
