import styled from 'styled-components';
import { Button, IconUp } from '@1hive/1hive-ui';
import { GUpx } from 'src/utils/style.util';
import { useEffect, useState } from 'react';

const TopRightCornerStyled = styled.div`
  position: absolute;
  bottom: ${GUpx(2)};
  right: ${GUpx(2)};
`;

export function BackToTop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollView = document.getElementById('scroll-view');
    scrollView?.addEventListener('scroll', handleScroll);
    return () => {
      scrollView?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = (e: Event) => {
    const scrollView = e.currentTarget as HTMLElement;
    if (scrollView) setScrolled(scrollView.scrollTop > 0);
  };

  const scrollToTop = () => {
    document.getElementById('scroll-view')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TopRightCornerStyled>
      {scrolled && (
        <Button label="Back to top" icon={<IconUp />} display="icon" onClick={scrollToTop} />
      )}
    </TopRightCornerStyled>
  );
}
