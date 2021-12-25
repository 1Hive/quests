import styled from 'styled-components';
import { Outset } from './spacer-util';

const SeparatorStyled = styled.div`
  border-top: 1px solid #efefef;
`;

export default function Separator() {
  return (
    <Outset gu8 vertical>
      <SeparatorStyled />
    </Outset>
  );
}
