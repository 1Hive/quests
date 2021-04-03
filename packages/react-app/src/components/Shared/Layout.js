import PropTypes from 'prop-types';
import React from 'react';
import { Layout, useViewport } from '@1hive/1hive-ui';
import styled from 'styled-components';
import { BREAKPOINTS } from '../../styles/breakpoints';

const LayoutStyled = styled(Layout)`
  ${({ width }) => width < BREAKPOINTS.large && 'width: auto;'}
  min-width: auto;
`;

function CustomLayout({ children, paddingBottom = 0 }) {
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

CustomLayout.propTypes = {
  children: PropTypes.node,
  paddingBottom: PropTypes.number,
};

export default CustomLayout;
