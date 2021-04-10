import React from 'react';
import styled from 'styled-components';
import { Spacer16V } from './Spacer';

const SeparatorStyled = styled.div`
  border-top: 1px solid #efefef;
`;

export default function Separator() {
  return (
    <Spacer16V>
      <SeparatorStyled />
    </Spacer16V>
  );
}
