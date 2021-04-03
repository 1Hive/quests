/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { GU, Popover, springs } from '@1hive/1hive-ui';
import { animated, Spring } from 'react-spring/renderprops';
import styled from 'styled-components';

// #region StyledComponents

const AccountPopoverStyled = styled(Popover)`
  width: ${({ width }) => width}px;
`;

const AnimatedSectionStyled = styled(animated.section)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChildrenWrapperStyled = styled.div`
  position: relative;
  flex-grow: 1;
  width: 100%;
`;

// #endregion

function HeaderPopover({ animateHeight, children, height, onClose, opener, visible, width }) {
  return (
    <AccountPopoverStyled
      closeOnOpenerFocus
      onClose={onClose}
      opener={opener}
      placement="bottom-end"
      visible={visible}
      width={width}
    >
      <Spring
        config={springs.smooth}
        from={{ height: `${38 * GU}px` }}
        to={{ height: `${height}px` }}
        immediate={!animateHeight}
        native
      >
        {({ height }) => (
          <AnimatedSectionStyled style={{ height }}>
            <ChildrenWrapperStyled>{children}</ChildrenWrapperStyled>
          </AnimatedSectionStyled>
        )}
      </Spring>
    </AccountPopoverStyled>
  );
}

HeaderPopover.propTypes = {
  animateHeight: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  opener: PropTypes.any,
  visible: PropTypes.bool.isRequired,
  width: PropTypes.number,
};

export default HeaderPopover;
