import { useTheme } from '@1hive/1hive-ui';
import React from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

const FieldStyled = styled.div`
  ${({ compact }: any) => (!compact ? `margin-bottom:${GUpx(2)}` : '')};
`;

const LabelStyled = styled.label`
  color: ${(props: any) => props.color};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
  user-select: none;
`;

const LineStyled = styled.div`
  display: flex;
  align-items: top;
`;

const ContentWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  ${(props: any) => (!props.compact ? 'min-height: 45px;' : '')}
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
      <ContentWrapperStyled compact={compact}>{children}</ContentWrapperStyled>
    </FieldStyled>
  );
}
