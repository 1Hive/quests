import { useTheme, GU, Link, IconExternal } from '@1hive/1hive-ui';
import { useHistory } from 'react-router-dom';
import { ENUM_PAGES, ENUM_QUEST_VIEW_MODE } from 'src/constants';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { LogoTitle } from './header/logo-title';
import QuestModal from './modals/quest-modal';

// #region StyledComponent

const FooterContainerStyled = styled.div`
  margin: auto;
  box-shadow: rgb(0 0 0 / 5%) 3px -2px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  a {
    color: ${({ color }: any) => color} !important;
  }

  padding: ${GUpx(2)} ${GUpx(20)} ${GUpx(2)} ${GUpx(20)};
`;

const FooterContainerStyledSide = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const LineStyled = styled.div`
  display: flex;
  align-items: top;
  max-width: 100%;
  margin-top: ${GUpx(3)};
`;

const FooterNavItemStyled = styled(Link)`
  color: #F7F7CE !important
  margin-right: ${3 * GU}px;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
`;

const TitleLinkStyled = styled(Link)`
  text-decoration: none;
`;

const TitleLinkWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  margin-left: ${GUpx()};
`;

// #endregion

export default function footer() {
  const history = useHistory();
  const theme = useTheme();
  return (
    <FooterContainerStyled background={theme.surface} color={theme.contentSecondary}>
      <FooterContainerStyledSide>
        <FooterColumnStyled>
          <TitleLinkStyled onClick={() => history.push(ENUM_PAGES.List)} to={ENUM_PAGES.List}>
            <TitleLinkWrapperStyled>
              <LogoTitle />
            </TitleLinkWrapperStyled>
          </TitleLinkStyled>
          <LineStyled>
            Bounty board platform built on xDai <br /> and linked to the 1Hive project
          </LineStyled>
          <LineStyled>© 2022 Quests</LineStyled>
          <LineStyled>All Rights Reserved</LineStyled>
        </FooterColumnStyled>
      </FooterContainerStyledSide>
      <FooterContainerStyledSide>
        <FooterColumnStyled>
          <FooterTitleStyled>Quests</FooterTitleStyled>
          <FooterLinkStyled href="#" external={false}>
            Quest List
          </FooterLinkStyled>
          <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} isLink />
        </FooterColumnStyled>
        <FooterColumnStyled>
          <FooterTitleStyled>Community</FooterTitleStyled>
          <FooterLinkStyled href="https://twitter.com/1HiveOrg" external>
            Follow Twitter
          </FooterLinkStyled>
          <FooterLinkStyled href="https://discord.gg/4fm7pgB" external>
            Join Discord
          </FooterLinkStyled>
        </FooterColumnStyled>
        <FooterColumnStyled>
          <FooterNavItemStyled
            href="https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9"
            external
          >
            <span>Get Honey</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
          <FooterNavItemStyled href="https://forum.1hive.org/" external>
            <span>1Hive</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
        </FooterColumnStyled>
      </FooterContainerStyledSide>
    </FooterContainerStyled>
  );
}
