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
  gu8?: boolean;
  gu16?: boolean;
  gu24?: boolean;
  gu32?: boolean;
};
export default function Separator({ horizontal, gu8 = true, gu16, gu24, gu32 }: Props) {
  return (
    <Outset gu8={gu8} gu16={gu16} gu24={gu24} gu32={gu32} vertical>
      {horizontal ? <HorizontalSeparatorStyled /> : <SeparatorStyled />}
    </Outset>
  );
}
