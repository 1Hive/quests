import { useViewport } from '@1hive/1hive-ui';
import React, { useEffect, useRef, useState } from 'react';
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
  scroll-behavior: smooth;
`;

const SideBlockStyled = styled.div`
  grid-area: s;
`;

const FooterStyled = styled.div`
  grid-area: f;
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
  const scrollRef = useRef<HTMLDivElement>();
  const footerRef = useRef<HTMLDivElement>();
  const [twoCol, setTwoCol] = useState(true);

  useEffect(() => {
    const handleWheelOnMain = (e: WheelEvent) => {
      const scrollElement = scrollRef.current as HTMLElement;
      const wrapperElement = document.getElementById('main-scroll');
      const footerElement = footerRef.current as HTMLElement;
      // scroll is bottom
      if (wrapperElement && scrollElement) {
        if (Math.round(wrapperElement.scrollTop) >= footerElement.clientHeight && e.deltaY < 0) {
          e.preventDefault();
          wrapperElement.scroll({ top: e.deltaY, behavior: 'smooth' });
        }
      }
    };

    if (scrollRef.current && footerRef.current && side) {
      scrollRef.current?.addEventListener('wheel', handleWheelOnMain);
    } else {
      scrollRef.current?.removeEventListener('wheel', handleWheelOnMain);
    }
    return () => scrollRef.current?.removeEventListener('wheel', handleWheelOnMain);
  }, [scrollRef.current, footerRef.current]);

  useEffect(() => {
    setTwoCol(vw >= BREAKPOINTS.large);
  }, [vw]);

  return (
    <>
      <WrapperStyled twoCol={twoCol && side} id="main-scroll">
        <ScrollViewStyled scrollable={mainScrollable} id="scroll-view" ref={scrollRef}>
          {main}
        </ScrollViewStyled>
        {side && <SideBlockStyled>{side}</SideBlockStyled>}
        <FooterStyled ref={footerRef}>{footer}</FooterStyled>
      </WrapperStyled>
    </>
  );
}

export default SideContentLayout;
