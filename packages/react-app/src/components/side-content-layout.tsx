import { useViewport } from '@1hive/1hive-ui';
import React, { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { BREAKPOINTS } from '../styles/breakpoints';

const WrapperStyled = styled.div`
  //display: flex;
  justify-content: space-evenly;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: repeat(2, 1fr);
  grid-template-areas:
    'main main main sd'
    'ft ft ft ft';
`;

// display: grid;
// grid-template-columns: repeat(2, 1fr);
// grid-auto-rows: minmax(100px, auto);
// grid-template-areas:
//   'hd hd hd hd   hd   hd   hd   hd   hd'
//   'main main main main main main sd sd sd'
//   'ft ft ft ft   ft   ft   ft   ft   ft';

const MainBlockStyled = styled.div`
  /* width: ${({ twoCol }: any) => (twoCol ? '75' : '90')}%;
  height: ${({ twoRow }: any) => (twoRow ? '75' : '90')}%; */
  grid-area: main;
  width: 90%;
`;
const SideBlockStyled = styled.div`
  grid-area: sd;
  width: 75%;
`;

const FooterBlockStyled = styled.div`
  grid-area: ft;
`;

const ScrollViewStyled = styled.div`
  overflow-x: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  height: calc(100vh - 64px);
  padding: ${GUpx(3)} 0;
`;

type Props = {
  main: React.ReactNode;
  side: React.ReactNode;
  footer: React.ReactNode;
};

function SideContentLayout({ main, side, footer }: Props) {
  // const { width: vw } = useViewport();
  // const [twoCol, setTwoCol] = useState(true);
  // const [twoRow, setTwoRow] = useState(true);
  // useEffect(() => {
  //   setTwoCol(vw >= BREAKPOINTS.large);
  //   setTwoRow(vw >= BREAKPOINTS.large);
  // }, [vw]);
  return (
    <WrapperStyled>
      <MainBlockStyled>
        <ScrollViewStyled id="scroll-view">{main}</ScrollViewStyled>
      </MainBlockStyled>
      <SideBlockStyled>{side}</SideBlockStyled>
      <FooterBlockStyled>{footer}</FooterBlockStyled>
    </WrapperStyled>
  );
}

export default SideContentLayout;
