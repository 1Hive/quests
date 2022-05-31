import { useTheme, Popover } from '@1hive/1hive-ui';
import React, { ReactNode, useRef, useState } from 'react';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { ThemeInterface } from 'src/styles/theme';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';

// #region Styled

const GenericWrapperStyled = styled.div`
  margin: 0;
  cursor: pointer;
  color: ${({ theme }: { theme: ThemeInterface }) => theme.contentSecondary};
`;

const PopoverStyled = styled(Popover)<{ theme: ThemeInterface }>`
  box-shadow: 0px 0px 8px 6px rgb(0 0 0 / 25%);
  border: none;
`;

const TooltipWrapperStyled = styled.div<{ theme: ThemeInterface }>`
  position: relative;
  max-width: 500px;
  min-width: 160px;
  padding: ${GUpx(3)};
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.helpContent};
  font-size: 0.8rem;
  white-space: pre-line; //Used to accept break line with \n
`;

// #endregion

type Props = {
  tooltip?: ReactNode;
  children?: ReactNode;
  label?: ReactNode;
};

export const GenericTooltip = ({ tooltip, children, label }: Props) => {
  const theme = useTheme();
  const buttonElement = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [_isHover, _setIsHover] = useState(false);
  const [showing, setShowing] = useState(false);
  const isHoverRef = useRef(_isHover);
  const setIsHover = (isHover: boolean) => {
    isHoverRef.current = isHover;
    _setIsHover(isHover);
  };

  const isMountedRef = useIsMountedRef();

  // TODO Click need be used to Mobile?
  // const handleClick = (e: Event) => {
  //   e.stopPropagation();
  //   setVisible(true);
  // };

  const showDelayed = () => {
    setIsHover(true);
    setTimeout(() => {
      setShowing(true);
      setTimeout(() => setShowing(false), 100);
      if (isHoverRef.current && isMountedRef.current) setVisible(true);
    }, 100);
  };

  const closeImediatly = () => {
    if (!showing) {
      setIsHover(false);
      setVisible(false);
    }
  };

  return (
    <GenericWrapperStyled
      onMouseEnter={() => showDelayed()}
      ref={buttonElement}
      theme={theme}
      // onClick={handleClick} // TODO Click need be used to Mobile?
      onMouseLeave={() => closeImediatly()}
    >
      <>
        {label}

        <PopoverStyled
          visible={visible}
          opener={buttonElement.current}
          onClose={() => closeImediatly()}
          theme={theme}
        >
          <TooltipWrapperStyled theme={theme} onMouseLeave={() => closeImediatly()}>
            {children ?? tooltip}
          </TooltipWrapperStyled>
        </PopoverStyled>
      </>
    </GenericWrapperStyled>
  );
};
