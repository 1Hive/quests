import { useTheme, GU, Link } from '@1hive/1hive-ui';
import styled from 'styled-components';

// #region StyledComponent

const FooterWrapper = styled.div`
  display: flex;
  background-color: ${(props: any) => props.background};
  column-gap: 150px;
  justify-content: center;
  box-shadow: rgb(0 0 0 / 5%) 3px -2px 0px;
  position: relative;
  padding: 40px 24px;
`;

const FooterColumn = styled.div`
  text-align: center;
`;

const FooterTitle = styled.div`
  display: flex;
  flex-direction: center;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
`;

const FooterLinkStyled = styled(Link)`
  color: ${({ color }: any) => color} !important;
  margin-right: ${3 * GU}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
`;

// #endregion

export default function footer() {
  const theme = useTheme();
  return (
    <FooterWrapper background={theme.surface}>
      <FooterColumn>
        <FooterTitle>Community</FooterTitle>
        <FooterLinkStyled color={theme.contentSecondary} href="https://discord.gg/4fm7pgB" external>
          Discord
        </FooterLinkStyled>
        <FooterLinkStyled color={theme.contentSecondary} href="https://github.com/1Hive" external>
          Github
        </FooterLinkStyled>
        <FooterLinkStyled
          color={theme.contentSecondary}
          href="https://twitter.com/1HiveOrg"
          external
        >
          Twitter
        </FooterLinkStyled>
        <FooterLinkStyled color={theme.contentSecondary} href="https://t.me/honeyswapdex" external>
          Telegram
        </FooterLinkStyled>
        <FooterLinkStyled color={theme.contentSecondary} href="https://forum.1hive.org/" external>
          Forum
        </FooterLinkStyled>
      </FooterColumn>
      <FooterColumn>
        <FooterTitle>Documentation</FooterTitle>
        <FooterLinkStyled
          color={theme.contentSecondary}
          href="https://wiki.1hive.org/projects/quests"
          external
        >
          Wiki
        </FooterLinkStyled>
      </FooterColumn>
      <FooterColumn>
        <FooterTitle>Feedback</FooterTitle>
        <FooterLinkStyled
          color={theme.contentSecondary}
          href="https://github.com/1Hive/quests/issues/new?assignees=&labels=&template=bug----bug_title-.md&title="
          external
        >
          Report a bug
        </FooterLinkStyled>
      </FooterColumn>
    </FooterWrapper>
  );
}
