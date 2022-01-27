import { useViewport } from '@1hive/1hive-ui';
import React, { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { BREAKPOINTS } from '../styles/breakpoints';

const WrapperStyled = styled.div`
  display: grid;
  grid-template-areas: ${(props: any) =>
    props.twoCol ? "'m m s'\n'm m s'\n'f f f'" : "'s s s'\n'm m m'\n'f f f'"};
  height: calc(100vh - 64px);
  overflow-y: auto;
  grid-template-columns: 1fr auto;
`;

const SideBlockStyled = styled.div`
  grid-area: s;
`;

const FooterStyled = styled.div`
  grid-area: f;
  max-height: 250px;
`;

const ScrollViewStyled = styled.div`
  ${(props: any) =>
    props.scrollable
      ? `
      overflow-x: auto;
      ::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
      height: calc(100vh - 64px);
      `
      : ''}

  ${(props: any) => (props.twoCol ? `padding: ${GUpx(1)} ${GUpx(4)};` : `padding: ${GUpx(1)}`)};
  grid-area: m;
`;

type Props = {
  main: React.ReactNode;
  side?: React.ReactNode;
  footer: React.ReactNode;
  mainScrollable?: boolean;
};

function SideContentLayout({ main, side, footer, mainScrollable = true }: Props) {
  const { width: vw } = useViewport();
  const [twoCol, setTwoCol] = useState(true);
  useEffect(() => {
    setTwoCol(vw >= BREAKPOINTS.large);
  }, [vw]);

  return (
    <>
      <WrapperStyled twoCol={twoCol && side}>
        <ScrollViewStyled scrollable={mainScrollable} id="scroll-view">
          {main}
        </ScrollViewStyled>
        {side && <SideBlockStyled>{side}</SideBlockStyled>}
        <FooterStyled>{footer}</FooterStyled>
      </WrapperStyled>
    </>
  );
}

export default SideContentLayout;
