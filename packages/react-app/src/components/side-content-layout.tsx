import React from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';

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
  footer: React.ReactNode;
};

function SideContentLayout({ main, side, footer }: Props) {
  return (
    <>
      <WrapperStyled>
        <ScrollViewStyled id="scroll-view">{main}</ScrollViewStyled>
        <SideBlockStyled>{side}</SideBlockStyled>
        <FooterStyled>{footer}</FooterStyled>
      </WrapperStyled>
    </>
  );
}

export default SideContentLayout;
