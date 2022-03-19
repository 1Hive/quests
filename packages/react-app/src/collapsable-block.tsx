/* eslint-disable react/destructuring-assignment */
import { Button, IconDown, IconUp, IconCopy, useTheme } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCopyToClipboard } from './hooks/use-copy-to-clipboard.hook';
import { GUpx } from './utils/style.util';

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
  type?: 'image' | 'code' | 'default';
  alt?: string;
};

export function CollapsableBlock(props: Props) {
  const theme = useTheme();
  const [isVisible, setVisible] = useState(props.visible);
  const copyCode = useCopyToClipboard();

  useEffect(() => setVisible(props.visible), [props.visible]);

  const [content, setContent] = useState<ReactNode | undefined>();

  useEffect(() => {
    // eslint-disable-next-line jsx-a11y/alt-text
    if (props.type === 'image') setContent(<img {...props} />);
    else
      setContent(props.children?.props?.children ? props.children.props.children : props.children);
  }, [props, props.children]);

  return (
    <WrapperStyled theme={theme}>
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
          <LabelStyled theme={theme}>
            {isVisible ? 'Hide ' : 'Show '}
            {props.label}
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
    </WrapperStyled>
  );
}
