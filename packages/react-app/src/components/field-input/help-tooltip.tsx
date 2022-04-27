import { useTheme, Button, IconQuestion, Popover } from '@1hive/1hive-ui';
import { ReactNode, useRef, useState } from 'react';
import { ThemeInterface } from 'src/styles/theme';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { Outset } from '../utils/spacer-util';

// #region Styled

const HelpWrapperStyled = styled.div`
  margin: 0 ${GUpx(1)};
`;

const HelpButtonStyled = styled(Button)<{ theme: ThemeInterface }>`
  border: none;
  background: ${({ theme }) => theme.help};
  box-shadow: 0px 0px 7px 1px rgb(0 0 0 / 25%);
  width: 16px;
  height: 16px;

  & > span {
    color: ${({ theme }) => theme.helpContent};
    width: 14px;
  }
`;

const PopoverStyled = styled(Popover)<{ theme: ThemeInterface }>`
  box-shadow: 0px 0px 8px 6px rgb(0 0 0 / 25%);
  border: none;
`;

const TooltipWrapperStyled = styled.div<{ theme: ThemeInterface }>`
  position: relative;
  max-width: 400px;
  min-width: 160px;
  padding: ${GUpx(3)};
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.helpContent};
`;

// #endregion

type Props = {
  tooltip?: ReactNode;
  children?: ReactNode;
};

export const HelpTooltip = ({ tooltip, children }: Props) => {
  const theme = useTheme();
  const buttonElement = useRef();
  const [visible, setVisible] = useState(false);

  const handleClick = (e: Event) => {
    e.stopPropagation();
    setVisible(true);
  };

  return (
    <HelpWrapperStyled>
      <HelpButtonStyled
        onMouseEnter={() => setVisible(true)}
        ref={buttonElement}
        icon={<IconQuestion />}
        mode="normal"
        size="mini"
        display="icon"
        label="Open tooltip"
        onClick={handleClick}
        theme={theme}
      />
      <PopoverStyled
        visible={visible}
        opener={buttonElement.current}
        onClose={() => setVisible(false)}
        theme={theme}
      >
        <TooltipWrapperStyled theme={theme} onMouseLeave={() => setVisible(false)}>
          {children ?? tooltip}
        </TooltipWrapperStyled>
      </PopoverStyled>
    </HelpWrapperStyled>
  );
};
