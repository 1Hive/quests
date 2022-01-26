import { Button, IconDown, IconUp, IconCopy } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCopyToClipboard } from './hooks/use-copy-to-clipboard.hook';
import { GUpx } from './utils/css.util';

// #region StyledComponents

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

const LabelStyled = styled.span`
  height: 100%;
`;

// #endregion

type Props = {
  children: any;
  label?: string;
  visible?: boolean;
};

export function CodeBlock({ children, visible = false, label = '' }: Props) {
  const [isVisible, setVisible] = useState(visible);
  const copyCode = useCopyToClipboard();

  useEffect(() => setVisible(visible), [visible]);

  const [content, setContent] = useState<ReactNode | undefined>();

  useEffect(() => {
    setContent(children.props?.children ? children.props.children : children);
  }, [children]);

  return (
    <pre>
      <LineStyled>
        <CollapseButtonStyled onClick={() => setVisible(!isVisible)}>
          <IconColumnStyled>
            {isVisible ? (
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
          <LabelStyled>
            {isVisible ? 'Hide ' : 'Show '}
            {label}
          </LabelStyled>
        </CollapseButtonStyled>
        {isVisible && (
          <CopyButtonStyled
            onClick={() => copyCode(content)}
            icon={<IconCopy />}
            size="small"
            label="Copy"
            display="icon"
          />
        )}
      </LineStyled>
      {isVisible && content ? <ContentWrapperStyled>{content}</ContentWrapperStyled> : <></>}
    </pre>
  );
}
