import styled from 'styled-components';
import { Button, IconUp } from '@1hive/1hive-ui';
import { GUpx } from 'src/utils/style.util';

const TopRightCornerStyled = styled.div`
  position: absolute;
  bottom: ${GUpx(2)};
  right: ${GUpx(2)};
`;

export function BackToTop() {
  const scrollToTop = () => {
    document.getElementById('scroll-view')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TopRightCornerStyled>
      <Button label="Back to Top" icon={<IconUp />} display="icon" onClick={scrollToTop} />
    </TopRightCornerStyled>
  );
}
