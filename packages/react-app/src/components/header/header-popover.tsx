/* eslint-disable no-shadow */
import { GU, Popover, springs } from '@1hive/1hive-ui';
import React from 'react';
import { animated, Spring } from 'react-spring/renderprops';
import styled from 'styled-components';

// #region StyledComponents

const AccountPopoverStyled = styled(Popover)`
  width: ${({ width }: any) => width}px;
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
type Props = {
  animateHeight: boolean;
  children: React.ReactNode;
  height: number;
  onClose?: Function;
  opener: any;
  visible: boolean;
  width: number;
};

function HeaderPopover({
  animateHeight,
  children,
  height,
  onClose,
  opener,
  visible,
  width,
}: Props) {
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

export default HeaderPopover;
