import { TextInput, Markdown, Button } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState } from 'react';
import { CollapsableBlock } from 'src/collapsable-block';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

const MaxLineStyled = styled.div<{ maxLine: number }>`
  margin-bottom: ${GUpx(1)};
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
  tooltip?: React.ReactNode;
  disableLinks?: boolean;
  showBlocks?: boolean;

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
  showBlocks = false,
}: Props) {
  const [isEditState, setIsEdit] = useState(isEdit);

  useEffect(() => {
    setIsEdit(isEdit);
  }, [isEdit]);

  const handlePreview = () => {
    setIsEdit(!isEditState);
  };

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
                  visible: showBlocks,
                },
              },
              code: {
                component: CollapsableBlock,
                props: {
                  label: 'code block',
                  type: 'code',
                  visible: showBlocks,
                },
              },
              img: {
                component: CollapsableBlock,
                props: {
                  label: 'image',
                  type: 'image',
                  visible: showBlocks,
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
  const loadableContent = isEditState ? (
    <BlockStyled wide={wide}>
      <TextInput
        id={id}
        value={value ?? ''}
        wide={wide}
        onChange={onChange}
        onBlur={onBlur}
        placeHolder={placeHolder}
        multiline={multiline}
        style={css}
        rows={rows}
      />
      {isMarkDown && isEdit && <Button size="mini" label="Preview" onClick={handlePreview} />}
    </BlockStyled>
  ) : (
    <BlockStyled>
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
      {isMarkDown && isEdit && <Button size="mini" label="Edit" onClick={handlePreview} />}
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
      >
        {loadableContent}
      </FieldInput>
    </>
  );
}
