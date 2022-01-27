import { useTheme, GU, Link } from '@1hive/1hive-ui';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';

// #region StyledComponent

const FooterContainerStyled = styled.div`
  margin: auto;
  background-color: ${(props: any) => props.background};
  box-shadow: rgb(0 0 0 / 5%) 3px -2px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  a {
    color: ${({ color }: any) => color} !important;
  }

  padding: ${GUpx(5)} ${GUpx(3)};
`;

const FooterColumnStyled = styled.div`
  padding: ${GUpx(2)};
`;

const FooterTitleStyled = styled.div`
  display: flex;
  flex-direction: center;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
`;

const FooterLinkStyled = styled(Link)`
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
    <FooterContainerStyled background={theme.surface} color={theme.contentSecondary}>
      <FooterColumnStyled>
        <FooterTitleStyled>Community</FooterTitleStyled>
        <FooterLinkStyled href="https://discord.gg/4fm7pgB" external>
          Discord
        </FooterLinkStyled>
        <FooterLinkStyled href="https://github.com/1Hive" external>
          Github
        </FooterLinkStyled>
        <FooterLinkStyled href="https://twitter.com/1HiveOrg" external>
          Twitter
        </FooterLinkStyled>
        <FooterLinkStyled href="https://t.me/honeyswapdex" external>
          Telegram
        </FooterLinkStyled>
        <FooterLinkStyled href="https://forum.1hive.org/" external>
          Forum
        </FooterLinkStyled>
      </FooterColumnStyled>
      <FooterColumnStyled>
        <FooterTitleStyled>Documentation</FooterTitleStyled>
        <FooterLinkStyled href="https://wiki.1hive.org/projects/quests" external>
          Wiki
        </FooterLinkStyled>
      </FooterColumnStyled>
      <FooterColumnStyled>
        <FooterTitleStyled>Feedback</FooterTitleStyled>
        <FooterLinkStyled
          href="https://github.com/1Hive/quests/issues/new?assignees=&labels=Feature&template=feature----feature_title-.md"
          external
        >
          Submit an idea
        </FooterLinkStyled>
        <FooterLinkStyled
          href="https://github.com/1Hive/quests/issues/new?assignees=&labels=&template=bug----bug_title-.md"
          external
        >
          Report a bug
        </FooterLinkStyled>
      </FooterColumnStyled>
    </FooterContainerStyled>
  );
}
