import { TextInput, Markdown, IconDown, IconUp, Button, IconCopy } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { ReactNode, useState } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { FieldInput } from './field-input';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard.hook';

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

const IconColumnStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${GUpx()};
`;

const CollapseButtonStyled = styled.a`
  display: flex;
  cursor: pointer;
  text-decoration: none !important;
  user-select: none;
  flex-grow: 1;
`;

const CopyButtonStyled = styled(Button)`
  border-color: #2c3a584d;
`;

const LineStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ContentWrapperStyled = styled.div`
  padding-top: ${GUpx()};
`;

// #endregion

const CodeBlock = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const copyCode = useCopyToClipboard();
  return (
    <div>
      <div className="content">
        <pre>
          <LineStyled>
            <CollapseButtonStyled onClick={() => setVisible(!visible)}>
              <IconColumnStyled>
                {visible ? (
                  <>
                    <IconDown size="tiny" />
                    <IconUp size="tiny" />
                  </>
                ) : (
                  <>
                    <IconUp size="tiny" />
                    <IconDown size="tiny" />
                  </>
                )}
              </IconColumnStyled>
              Code block
            </CollapseButtonStyled>
            {visible && (
              <CopyButtonStyled
                onClick={() => copyCode(children.props.children)}
                icon={<IconCopy />}
                size="small"
                label="Copy"
                display="icon"
              />
            )}
          </LineStyled>
          {visible ? <ContentWrapperStyled>{children}</ContentWrapperStyled> : <></>}
        </pre>
      </div>
    </div>
  );
};

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
            overrides: {
              pre: {
                component: CodeBlock,
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
