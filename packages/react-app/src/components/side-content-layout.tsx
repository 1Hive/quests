import { useViewport } from '@1hive/1hive-ui';
import React, { useEffect, useState } from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { BREAKPOINTS } from '../styles/breakpoints';

const WrapperStyled = styled.div`
  display: grid;
  grid-template-areas:
    'm m m s'
    'm m m s'
    'f f f f';
  height: calc(100vh - 64px);
  overflow-y: auto;
`;

const SideBlockStyled = styled.div`
  grid-area: s;
`;

const FooterStyled = styled.div`
  grid-area: f;
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
  grid-area: m;
`;

type Props = {
  main: React.ReactNode;
  side: React.ReactNode;
};

function SideContentLayout({ main, side }: Props) {
  const { width: vw } = useViewport();
  const [twoCol, setTwoCol] = useState(true);
  console.log({ side });
  useEffect(() => {
    setTwoCol(vw >= BREAKPOINTS.large);
  }, [vw]);
  return (
    <>
      <WrapperStyled>
        <ScrollViewStyled>{main}</ScrollViewStyled>
        {twoCol && <SideBlockStyled>{side}</SideBlockStyled>}
        <FooterStyled>
          <div style={{ height: '100px', backgroundColor: 'black' }}>footer</div>
        </FooterStyled>
      </WrapperStyled>
    </>
  );
}

export default SideContentLayout;
