import { Help, IconQuestion, useTheme } from '@1hive/1hive-ui';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { GUpx } from 'src/utils/css.util';

const IconSpanStyled = styled.span`
  margin-top: 0px;
  margin-left: 8px;
  margin-bottom: 4px;
  width: 16px;
  height: 16px;
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
  margin: 0 ${GUpx()};
`;
type Props = {
  tooltip: string;
  tooltipDetail?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
};

export const IconTooltip = ({ tooltip, tooltipDetail, icon, children }: Props) => {
  const theme = useTheme();
  return (
    <HelpWrapperStyled>
      {tooltipDetail || children ? (
        <Help hint={tooltip}>
          <TooltipWrapperStyled color={theme.accentContent}>
            {tooltipDetail ?? children}
          </TooltipWrapperStyled>
        </Help>
      ) : (
        <IconSpanStyled title={tooltip}>{icon ?? <IconQuestion size="tiny" />}</IconSpanStyled>
      )}
    </HelpWrapperStyled>
  );
};
