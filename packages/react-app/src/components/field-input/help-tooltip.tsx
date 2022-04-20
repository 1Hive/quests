import { Help, useTheme } from '@1hive/1hive-ui';
import { ReactNode, useRef } from 'react';
import { ThemeInterface } from 'src/styles/theme';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';

// #region Styled

const TooltipWrapperStyled = styled.div`
  color: #637381;
`;

const HelpWrapperStyled = styled.div<{ theme: ThemeInterface }>`
  margin-left: ${GUpx()};
  margin-right: ${GUpx(0.5)};
  svg {
    color: ${({ theme }) => theme.hint}!important;
  }
  button:focus::after {
    border: none;
  }
`;

// #endregion

type Props = {
  tooltip?: ReactNode;
  children?: ReactNode;
};

export const HelpTooltip = ({ tooltip, children }: Props) => {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    // Simulate help button click
    const btn = wrapperRef.current?.getElementsByTagName('button')[0];
    btn?.click();
  };
  const handleLeave = () => {
    // Simulate ESC key press
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }));
  };

  return (
    <>
      <HelpWrapperStyled
        theme={theme}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        ref={wrapperRef}
      >
        <Help hint="">
          <TooltipWrapperStyled color={theme.accentContent}>
            {children ?? tooltip}
          </TooltipWrapperStyled>
        </Help>
      </HelpWrapperStyled>
    </>
  );
};
