import { useViewport } from '@1hive/1hive-ui';
import React, { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { BREAKPOINTS } from '../styles/breakpoints';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const MainBlockStyled = styled.div`
  width: ${({ twoCol }: any) => (twoCol ? '75' : '90')}%;
`;
const SideBlockStyled = styled.div``;

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
};

function SideContentLayout({ main, side }: Props) {
  const { width: vw } = useViewport();
  const [twoCol, setTwoCol] = useState(true);
  useEffect(() => {
    setTwoCol(vw >= BREAKPOINTS.large);
  }, [vw]);
  return (
    <>
      <WrapperStyled>
        <MainBlockStyled twoCol={twoCol}>
          <ScrollViewStyled id="scroll-view">
            <>
              {twoCol === false && <>{side}</>}
              {main}
            </>
          </ScrollViewStyled>
        </MainBlockStyled>
        {twoCol && <SideBlockStyled>{side}</SideBlockStyled>}
      </WrapperStyled>
    </>
  );
}

export default SideContentLayout;
