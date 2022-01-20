import { useTheme } from '@1hive/1hive-ui';
import React from 'react';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

const FieldStyled = styled.div`
  ${({ compact }: any) => (!compact ? 'margin-bottom: 24px' : '')};
`;

const LabelStyled = styled.label`
  color: ${(props: any) => props.color};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
  user-select: none;
  margin-bottom: -1px;
`;

const LineStyled = styled.div`
  display: flex;
  align-items: center;
`;

type Props = {
  compact?: boolean;
  label: React.ReactNode;
  tooltip?: string;
  tooltipDetail?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
};

export function FieldInput({ id, children, compact, tooltip, tooltipDetail, label }: Props) {
  const theme = useTheme();
  const labelComponent = (
    <LineStyled>
      <LabelStyled color={theme.contentSecondary} htmlFor={id}>
        {label}
      </LabelStyled>
      {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
    </LineStyled>
  );

  return (
    <FieldStyled key={id} compact={compact}>
      {labelComponent}
      {children}
    </FieldStyled>
  );
}
