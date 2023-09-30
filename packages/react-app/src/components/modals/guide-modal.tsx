/* eslint-disable no-nested-ternary */
import { Button, IconInfo, useViewport } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState, useMemo } from 'react';
import Piggy from 'src/assets/piggy.png';
import QuestListScreenshot from 'src/assets/ListScreenshot.png';
import CreateQuestScreenshot from 'src/assets/CreateQuestScreenshot.png';
import ClaimScreenshot from 'src/assets/ClaimScreenshot.png';
import ChallengeScreenshot from 'src/assets/ChallengeScreenshot.png';
import ResolveScreenshot from 'src/assets/ResolveScreenshot.png';
import RecoverFundsScreenshot from 'src/assets/RecoverFundsScreenshot.png';
import useImagePreloader from 'src/hooks/use-image-preloader';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { useThemeContext } from 'src/contexts/theme.context';
import { ThemeInterface } from 'src/styles/theme';
import backgroundLogo from 'src/assets/background-logo.png';
import ModalBase, { ModalCallback } from './modal-base';
import Stepper from '../utils/stepper';
import MarkdownFieldInput from '../field-input/markdown-field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)<{ theme: ThemeInterface }>`
  margin: ${GUpx(2)};
  z-index: 1;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.surfaceContent};
  &,
  span {
    color: ${({ theme }) => theme.accentContent};
  }
`;

const ExploreButtonStyled = styled(Button)<{ theme: ThemeInterface }>`
  &,
  span {
    color: ${({ theme }) => theme.content};
  }
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const BottomRightCornerStyled = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const GuideStepStyled = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: space-evenly;
  align-items: center;
  ${({ isSmall }) => (isSmall ? '' : 'height: 50vh')};
`;

const FirstColStyled = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex-direction: column;

  &.centered {
    align-items: center;
  }

  width: ${({ isSmall }) => (isSmall ? '100%' : '50%')};
`;

const SecondColStyled = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  width: ${({ isSmall }) => (isSmall ? '100%' : '50%')};
`;

const SideImageStyled = styled.img`
  width: 100%;
`;

const WrapperStyled = styled.div`
  height: fit-content;
`;

// #endregion

type Props = {
  onClose?: ModalCallback;
};

export default function GuideModal({ onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const { currentTheme } = useThemeContext();
  const { below, width } = useViewport();

  const isSmall = useMemo(() => below('medium'), [width]);

  useImagePreloader([
    Piggy,
    QuestListScreenshot,
    CreateQuestScreenshot,
    ClaimScreenshot,
    ChallengeScreenshot,
    ResolveScreenshot,
    RecoverFundsScreenshot,
  ]);

  useEffect(() => {
    if (localStorage.getItem('alreadyVisisted') !== 'true') {
      setOpened(true);
    }
  }, []);

  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
    localStorage.setItem('alreadyVisisted', 'true');
  };

  return (
    <BottomRightCornerStyled>
      <ModalBase
        id="guide"
        openButton={
          <OpenButtonWrapperStyled>
            <OpenButtonStyled
              onClick={() => setOpened(true)}
              icon={<IconInfo />}
              mode="positive"
              title="Open Guide"
              display="icon"
              theme={currentTheme}
            />
          </OpenButtonWrapperStyled>
        }
        onModalClosed={onModalClosed}
        isOpened={opened}
        size="normal"
      >
        <WrapperStyled>
          <Stepper
            showPager
            submitButton={
              <ExploreButtonStyled
                onClick={() => setOpened(false)}
                label="🌟 Start exploring"
                title="Start exploring"
                mode="positive"
                theme={currentTheme}
              />
            }
            steps={[
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall} className="centered">
                  <MarkdownFieldInput
                    id="page1"
                    value="#### Quests
# Welcome 👋
Here's a 7 steps to understand how Quests works."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled
                    style={{
                      height: '90%',
                      maxWidth: '60%',
                    }}
                    src={backgroundLogo}
                    alt="logo"
                  />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page2"
                    value="## Step 1: Understand the Roles 🧑‍🚀
- **Creator**: This is someone who has a task or requirement that they need fulfilled.
- **Player**: This is someone who completes the tasks defined in a quest.
- **Patron**: These are people or organizations that fund a quest."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={Piggy} alt="piggy" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page3"
                    value="## Step 2: View Quests 📖
- Go to the _List view_ page. Here, you can see a dashboard and a summarized list of available Quests.
- Understand the key details of each quest such as title, description, and the reward.
- You can refine filters to find quests that are relevant to you."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={QuestListScreenshot} alt="quest list" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page4"
                    value="## Step 3: Create a Quest 💰
- If you are a _Creator_, you can choose to create a quest. Click on the **Create Quest** button. And fill in the details & parameters.
- You have the option to create an *Open* or *Restricted* Quest. A *restricted* Quest has a list of players who are allowed to claim. This list is created and can be modified anytime by the Quest creator"
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={CreateQuestScreenshot} alt="create quest" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page5"
                    value="## Step 4: Fund a Quest 💰
- If you are a _Patron_, you can choose to fund a quest. Go to the _detail view_ of a specific quest and click on the **Fund** button."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={CreateQuestScreenshot} alt="create quest" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page6"
                    value="## Step 5: Participate in a Quest 🌟
- If you are a _Player_, you can choose to participate in a quest if its an open participation quest. Go to the _detail view_ of a specific quest and click on the **Play** button.
- Then you will be elligible to claim the quest reward. Click on the **Claim quest** button.
- Provide evidence of completion as per the requirements specified in the quest description.
- Specify the amount you want to claim."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={ClaimScreenshot} alt="claim" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page7"
                    value="## Step 6: Verification of a Quest 🕵️
- Anyone can verify a quest. Check if the evidence provided by a player meets the requirements specified in the quest.
- If you believe that the requirements have not been met, you can challenge the claim during the 7-day delay period."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={ChallengeScreenshot} alt="challenge" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page8"
                    value="## Step 7: Resolving Challenges 🧑‍⚖️
- If a claim is challenged, it will be raised to **Celeste** which will decide whether the work has been completed as expected.
- If the challenge is resolved in favor of the **Player**, the claim will be fulfilled and the player will win the challenger's deposit.
- If the challenge is resolved in favor of the **Challenger**, the claim is rejected and the challenger wins the player's deposit."
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={ResolveScreenshot} alt="Resolve challenge" />
                </SecondColStyled>
              </GuideStepStyled>,
              <GuideStepStyled isSmall={isSmall}>
                <FirstColStyled isSmall={isSmall}>
                  <MarkdownFieldInput
                    id="page9"
                    value="## Step 8: Recover Funds 💸
- Once a quest has expired, the **Creator** can recover his deposit and the remaining funds will be send to the initially specified fallback address.
##### Remember, it's essential to thoroughly understand the rules and requirements of each quest before participating.
#### Happy questing! 🌟"
                  />
                </FirstColStyled>
                <SecondColStyled isSmall={isSmall}>
                  <SideImageStyled src={RecoverFundsScreenshot} alt="Recover funds" />
                </SecondColStyled>
              </GuideStepStyled>,
            ]}
          />
        </WrapperStyled>
      </ModalBase>
    </BottomRightCornerStyled>
  );
}
