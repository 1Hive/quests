/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Help, IconQuestion, useTheme } from '@1hive/1hive-ui';
import { ReactNode, useRef } from 'react';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';

// #region Styled

const IconSpanStyled = styled.span`
  margin-top: 0px;
  margin-bottom: 4px;
  height: 16px;
  width: 16px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background: #7c80f2;
  color: #ffffff;
  border-radius: 50%;
  box-shadow: rgb(0 0 0 / 25%) 0px 1px 3px;
  transition-property: transform, box-shadow;
  transition-duration: 50ms;
  transition-timing-function: ease-in-out;
`;

const TooltipWrapperStyled = styled.div`
  color: #637381;
`;

const HelpWrapperStyled = styled.div`
  width: 16px;
  display: inline-block;
  margin-left: ${GUpx()};
  margin-right: ${GUpx(0.5)};
  svg {
    color: ${({ theme }: any) => theme.hint}!important;
  }
  button:focus::after {
    border: none;
  }
`;

// #endregion

type Props = {
  tooltip?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
};

export const IconTooltip = ({ tooltip, icon, children }: Props) => {
  const theme = useTheme();
  const wrapperRef = useRef<HTMLElement>(null);

  const handleEnter = () => {
    const btn = wrapperRef.current?.getElementsByTagName('button')[0];
    btn?.click();
  };
  const handleLeave = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }));
  };

  return (
    <>
      <HelpWrapperStyled
        className="btn-no-margin"
        theme={theme}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        ref={wrapperRef}
      >
        {tooltip || children ? (
          <Help hint={tooltip}>
            <TooltipWrapperStyled color={theme.accentContent}>
              {children ?? tooltip}
            </TooltipWrapperStyled>
          </Help>
        ) : (
          <IconSpanStyled title={tooltip}>{icon ?? <IconQuestion size="tiny" />}</IconSpanStyled>
        )}
      </HelpWrapperStyled>
    </>
  );
};
