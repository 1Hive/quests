import { Field } from '@1hive/1hive-ui';
import React from 'react';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
  pointer-events: none;
`;

const ContentWrapperStyled = styled.div`
  textarea,
  input,
  select {
    pointer-events: all !important;
  }
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
  return (
    <FieldStyled
      key={id}
      compact={compact}
      label={
        <>
          <span>{label}</span>
          {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
        </>
      }
    >
      <ContentWrapperStyled>{children}</ContentWrapperStyled>
    </FieldStyled>
  );
}
