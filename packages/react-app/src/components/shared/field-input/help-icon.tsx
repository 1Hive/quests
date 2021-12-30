import { Help, IconQuestion } from '@1hive/1hive-ui';
import { ReactNode } from 'react';
import styled from 'styled-components';

const IconSpanStyled = styled.span`
  margin-top: 0px;
  margin-left: 8px;
  margin-bottom: 4px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: rgb(136, 168, 228);
  color: rgb(255, 255, 255);
  border-radius: 50%;
  box-shadow: rgb(0 0 0 / 25%) 0px 1px 3px;
  transition-property: transform, box-shadow;
  transition-duration: 50ms;
  transition-timing-function: ease-in-out;
`;
type Props = {
  tooltip: string;
  tooltipDetail?: ReactNode;
};

export default ({ tooltip, tooltipDetail }: Props) => (
  <>
    {tooltipDetail ? (
      <Help hint={tooltip}>{tooltipDetail}</Help>
    ) : (
      <IconSpanStyled title={tooltip}>
        <IconQuestion size="tiny" />
      </IconSpanStyled>
    )}
  </>
);
