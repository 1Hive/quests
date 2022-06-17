/* eslint-disable react/destructuring-assignment */
import { Button, IconDown, IconUp, IconCopy, useTheme } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ThemeInterface } from 'src/styles/theme';
import styled, { css } from 'styled-components';
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard.hook';
import { GUpx } from '../utils/style.util';
import { ConditionalWrapper } from './utils/util';

// #region StyledComponents

const IconColumnStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${GUpx(1)};
`;

const CollapseButtonStyled = styled(Button)`
  display: flex;
  cursor: pointer;
  text-decoration: none !important;
  user-select: none;
  flex-grow: 1;
  height: fit-content;
  padding: ${GUpx(1)};
`;

const CopyButtonStyled = styled(Button)`
  border-color: #2c3a584d;
`;

const LineStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

const ContentWrapperStyled = styled.div`
  padding-top: ${GUpx(1)};
`;

const WrapperStyled = styled.div<{ usePre: boolean | undefined; wide: boolean | undefined }>`
  ${({ usePre, wide }) =>
    css`
      ${usePre ? 'pre {' : ''}
      background: ${({ theme }: any) => theme.surfaceUnder} !important;
      padding: ${GUpx(2)};
      border-radius: 8px;
      width: ${wide ? '100%' : '95%'};
      margin-left: ${wide ? '0' : GUpx(2)};
      margin-top: ${GUpx(2)};
      box-shadow: 10px 10px 15px 5px #00000029;
      ${usePre ? '}' : ''}
    `}

  margin-bottom: ${GUpx(1)};

  a {
    color: ${({ theme }: any) => theme.link};
  }
`;

const HeaderWraperStyled = styled.div`
  flex-grow: 1;
  padding-left: 16px;
`;

const CollapseButtonContentStyled = styled.div<{ theme: ThemeInterface }>`
  color: ${({ theme }: any) => theme.link} !important;
  display: flex;
  align-items: center;
  width: 100%;
`;

// #endregion

type Props = {
  children: any;
  header?: ReactNode;
  visible?: boolean;
  src?: string;
  width?: number;
  collapsed?: boolean;
  type?: 'image' | 'code' | 'default';
  alt?: string;
  copyable?: boolean;
  hideState?: boolean;
  usePre?: boolean;
  wide?: boolean;
};

export function CollapsableBlock(props: Props) {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(props.collapsed);
  const copyCode = useCopyToClipboard();

  useEffect(() => setCollapsed(props.collapsed), [props.collapsed]);

  const content = useMemo(() => {
    if (props.type === 'image') {
      // eslint-disable-next-line jsx-a11y/alt-text
      return <img {...props} />;
    }
    return props.children?.props?.children ? props.children.props.children : props.children;
  }, [props, props.children]);

  return (
    <>
      {props.visible && (
        <WrapperStyled theme={theme} usePre={props.usePre} wide={props.wide}>
          <ConditionalWrapper
            condition={props.usePre}
            wrapper={(children) => <pre>{children}</pre>}
          >
            <LineStyled>
              <div className="btn-link">
                <CollapseButtonStyled onClick={() => setCollapsed(!collapsed)}>
                  <CollapseButtonContentStyled theme={theme}>
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
                    {!props.hideState && (collapsed ? 'Show ' : 'Hide ')}
                  </CollapseButtonContentStyled>
                </CollapseButtonStyled>
              </div>
              <HeaderWraperStyled>{props.header}</HeaderWraperStyled>
              {!collapsed && props.copyable && (
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
          </ConditionalWrapper>
        </WrapperStyled>
      )}
    </>
  );
}
