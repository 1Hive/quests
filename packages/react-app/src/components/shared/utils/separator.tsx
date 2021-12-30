import styled from 'styled-components';
import { Outset } from './spacer-util';

const SeparatorStyled = styled.div`
  border-top: 1px solid #efefef;
`;
const HorizontalSeparatorStyled = styled.div`
  border-left: 2px solid #818181;
`;
type Props = {
  horizontal?: boolean;
};
export default function Separator({ horizontal }: Props) {
  return (
    <Outset gu8 vertical>
      {horizontal ? <HorizontalSeparatorStyled /> : <SeparatorStyled />}
    </Outset>
  );
}
