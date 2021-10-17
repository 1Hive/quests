import { Layout, useViewport } from '@1hive/1hive-ui';
import React from 'react';
import styled from 'styled-components';
import { BREAKPOINTS } from '../../styles/breakpoints';

const LayoutStyled = styled(Layout)`
  ${({ width }: any) => width < BREAKPOINTS.large && 'width: auto;'}
  min-width: auto;
`;

type Props = {
  children: React.ReactNode;
  paddingBottom: number;
};

function CustomLayout({ children, paddingBottom = 0 }: Props) {
  const { width: vw } = useViewport();
  return (
    <LayoutStyled
      breakpoints={BREAKPOINTS}
      width={vw}
      parentWidth={vw}
      paddingBottom={paddingBottom}
    >
      {children}
    </LayoutStyled>
  );
}

export default CustomLayout;
