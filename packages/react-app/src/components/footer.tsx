import { useTheme, GU, Link, IconExternal } from '@1hive/1hive-ui';
import { ENUM_QUEST_VIEW_MODE, REPO_ADDRESS } from 'src/constants';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { LogoTitle } from 'src/assets/logo-title';
import { useWallet } from 'src/contexts/wallet.context';
import { getNetwork } from 'src/networks';
import QuestModal from './modals/quest-modal';

// #region StyledComponent

const FooterContainerStyled = styled.div<{ color: string }>`
  margin: auto;
  box-shadow: rgb(0 0 0 / 5%) 3px -2px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  a {
    color: ${({ color }) => color} !important;
  }

  padding: ${GUpx(8)};
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

const LineStyled = styled.div`
  display: flex;
  align-items: top;
  max-width: 100%;
  margin-top: ${GUpx(3)};
`;

const FooterNavItemStyled = styled(Link)`
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
  margin-left: ${GUpx(1)};
`;

const IconStyled = styled.div`
  width: 32px;
`;

// #endregion

export default function footer() {
  const theme = useTheme();
  const year = new Date().getFullYear();
  const { walletAddress } = useWallet();
  const { networkId } = getNetwork();

  return (
    <FooterContainerStyled color={theme.contentSecondary}>
      <FooterContainerStyledSide>
        <FooterColumnStyled>
          <TitleLinkStyled href="#" external={false}>
            <TitleLinkWrapperStyled>
              <LogoTitle />
            </TitleLinkWrapperStyled>
          </TitleLinkStyled>
          <LineStyled>
            Bounty board platform built on xDai <br /> and linked to the 1Hive project
          </LineStyled>
          <LineStyled>© {year} Quests</LineStyled>
          <LineStyled>All Rights Reserved</LineStyled>
        </FooterColumnStyled>
      </FooterContainerStyledSide>
      <FooterContainerStyledSide>
        <FooterColumnStyled>
          <FooterTitleStyled>Quests</FooterTitleStyled>
          <FooterNavItemStyled href="#" external={false}>
            Quest List
          </FooterNavItemStyled>
          {walletAddress && (
            <QuestModal questMode={ENUM_QUEST_VIEW_MODE.Create} buttonMode="link" />
          )}
        </FooterColumnStyled>
        <FooterColumnStyled>
          <FooterTitleStyled>Community</FooterTitleStyled>
          <FooterNavItemStyled href="https://twitter.com/1HiveOrg" external>
            <IconStyled>
              <FontAwesomeIcon icon={faTwitter} />
            </IconStyled>
            Follow Twitter
          </FooterNavItemStyled>
          <FooterNavItemStyled href="https://discord.gg/4fm7pgB" external>
            <IconStyled>
              <FontAwesomeIcon icon={faDiscord} />
            </IconStyled>
            Join Discord
          </FooterNavItemStyled>
        </FooterColumnStyled>
        <FooterColumnStyled>
          <FooterTitleStyled>Links</FooterTitleStyled>
          <FooterNavItemStyled
            href={
              networkId === 'rinkeby'
                ? 'https://app.uniswap.org/#/swap?chain=rinkeby&inputCurrency=eth&outputCurrency=0x3050E20FAbE19f8576865811c9F28e85b96Fa4f9'
                : 'https://app.honeyswap.org/#/swap?inputCurrency=0x71850b7e9ee3f13ab46d67167341e4bdc905eef9'
            }
            external
          >
            <span>{networkId === 'rinkeby' ? 'Get test Honey' : 'Get Honey'}</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
          <FooterNavItemStyled href="https://forum.1hive.org/" external>
            <span>1Hive Forum</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
          <FooterNavItemStyled href="https://wiki.1hive.org/projects/quests" external>
            <span>Quest Wiki</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
          <FooterNavItemStyled href="https://github.com/1Hive/quests" external>
            <span>Github</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
        </FooterColumnStyled>
        <FooterColumnStyled>
          <FooterTitleStyled>Feedback</FooterTitleStyled>
          <FooterNavItemStyled
            color={theme.contentSecondary}
            href={`${REPO_ADDRESS}/issues/new?assignees=&label=App%2CBug&template=bug_report.md&title=Bug+%3A+`}
            external
          >
            <span>Report a bug</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
          <FooterNavItemStyled
            color={theme.contentSecondary}
            href={`${REPO_ADDRESS}/security/policy`}
            external
          >
            <span>Report a vulnerability</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
          <FooterNavItemStyled
            color={theme.contentSecondary}
            href={`${REPO_ADDRESS}/issues/new?assignees=&labels=App%2CFeature&template=feature----feature_title-.md`}
            external
          >
            <span>Request a feature</span>
            <IconExternal size="small" />
          </FooterNavItemStyled>
        </FooterColumnStyled>
      </FooterContainerStyledSide>
    </FooterContainerStyled>
  );
}
