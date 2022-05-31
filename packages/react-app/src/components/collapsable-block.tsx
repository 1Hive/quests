/* eslint-disable react/destructuring-assignment */
import { Button, IconDown, IconUp, IconCopy, useTheme } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard.hook';
import { GUpx } from '../utils/style.util';

// #region StyledComponents

const IconColumnStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${GUpx(1)};
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
  padding-top: ${GUpx(1)};
`;

const LabelStyled = styled.span`
  height: 100%;
  color: ${({ theme }: any) => theme.link} !important;
`;

const WrapperStyled = styled.pre`
  background: ${({ theme }: any) => theme.surfaceUnder} !important;
`;

// #endregion

type Props = {
  children: any;
  label?: string;
  visible?: boolean;
  collapsed?: boolean;
  type?: 'image' | 'code' | 'default';
  alt?: string;
};

export function CollapsableBlock(props: Props) {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(props.collapsed);
  const [content, setContent] = useState<ReactNode | undefined>();
  const copyCode = useCopyToClipboard();

  useEffect(() => setCollapsed(props.collapsed), [props.collapsed]);

  useEffect(() => {
    // eslint-disable-next-line jsx-a11y/alt-text
    if (props.type === 'image') setContent(<img {...props} />);
    else
      setContent(props.children?.props?.children ? props.children.props.children : props.children);
  }, [props, props.children]);

  return (
    <>
      {props.visible && (
        <WrapperStyled theme={theme}>
          <LineStyled>
            <CollapseButtonStyled onClick={() => setCollapsed(!collapsed)}>
              <IconColumnStyled>
                {collapsed ? (
                  <>
                    <IconUp size="tiny" />
                    <IconDown size="tiny" />
                  </>
                ) : (
                  <>
                    <IconDown size="tiny" />
                    <IconUp size="tiny" />
                  </>
                )}
              </IconColumnStyled>
              <LabelStyled theme={theme}>
                {collapsed ? 'Show ' : 'Hide '}
                {props.label}
              </LabelStyled>
            </CollapseButtonStyled>
            {!collapsed && (
              <CopyButtonStyled
                onClick={() => copyCode(content)}
                icon={<IconCopy />}
                size="small"
                label="Copy"
                display="icon"
              />
            )}
          </LineStyled>
          {!collapsed && content ? <ContentWrapperStyled>{content}</ContentWrapperStyled> : <></>}
        </WrapperStyled>
      )}
    </>
  );
}
