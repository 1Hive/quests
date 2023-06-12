/* eslint-disable no-nested-ternary */
import { Button, IconInfo } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import Piggy from 'src/assets/piggy';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { useThemeContext } from 'src/contexts/theme.context';
import { ThemeInterface } from 'src/styles/theme';
import QuestLogo from 'src/assets/quest-logo';
import BackgroundLogo from 'src/assets/background-logo';
import ModalBase, { ModalCallback } from './modal-base';
import Stepper from '../utils/stepper';
import MarkdownFieldInput from '../field-input/markdown-field-input';

// #region StyledComponents

const OpenButtonStyled = styled(Button)<{ theme: ThemeInterface }>`
  margin: ${GUpx(1)};
  z-index: 1;
  border-radius: 32px;
  background-color: ${({ theme }: any) => theme.overlay};
  span {
    color: ${({ theme }: any) => theme.accentContent};
  }
`;
const GuideStepStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const OpenButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
const GuideFirstColStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
const GuideSecondColStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const BottomRightCornerStyled = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;
const MdStyled = styled(MarkdownFieldInput)`
  margin-left: 24px;
`;

const StyledPiggy = styled(Piggy)`
  width: 100%;
  /* svg {
    width: auto;
    margin-left: ${GUpx(3)};
  } */
`;
// #endregion

type Props = {
  onClose?: ModalCallback;
};

export default function GuideModal({ onClose = noop }: Props) {
  const [opened, setOpened] = useState(false);
  const { currentTheme } = useThemeContext();
  const onModalClosed = (success: boolean) => {
    setOpened(false);
    onClose(success);
  };

  return (
    <BottomRightCornerStyled>
      <ModalBase
        css={{ height: '75vh' }}
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
        <Stepper
          submitButton={
            <Button
              onClick={() => setOpened(false)}
              label="Discover Quests Dapp"
              title="Start exploring Quests"
              mode="positive"
            />
          }
          steps={[
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page1"
                  value="#### Quests 
# Welcome 👋 
Here's a quick guide on how to use the Quests platform"
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <BackgroundLogo />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page2"
                  value="## Step 1: Understand the Roles 🧑‍🚀
- **Creator**: This is someone who has a task or requirement that they need fulfilled.
- **Player**: This is someone who completes the tasks defined in a quest.
- **Patron**: These are people or organizations that fund a quest."
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page3"
                  value="## Step 2: View Quests 📖
- Go to the _List view_ page. Here, you can see a dashboard and a summarized list of available Quests.
- Understand the key details of each quest such as title, description, and the reward."
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page4"
                  value='## Step 3: Fund or Create a Quest 💰
- If you are a _Patron_, you can choose to fund a quest. Go to the _detail view_ of a specific quest and click on the "Fund" button.
- If you are a _Creator_, you can choose to create a quest. Click on the "Create Quest" button on the header/dashboard/footer.'
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page5"
                  value='## Step 4: Participate in a Quest 🌟
- If you are a _Player_, you can choose to participate in a quest. Go to the _detail view_ of a specific quest and click on the "Claim quest" button.
- Provide evidence of completion as per the requirements specified in the quest description.
- Specify the amount you want to claim.## Step 4: View Quests
- Go to the _List view_ page. Here, you can see a dashboard and a summarized list of available Quests.
- Understand the key details of each quest such as title, description, and the reward.'
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page6"
                  value="## Step 5: Verification of a Quest 🕵️
- Anyone can verify a quest. Check if the evidence provided by a player meets the requirements specified in the quest.
- If you believe that the requirements have not been met, you can challenge the claim during the 7-day delay period."
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page7"
                  value="## Step 6: Resolving Challenges 🧑‍⚖️
- If a claim is challenged, it will be raised to _Celeste_ which will decide whether the work has been completed as expected.
- If the challenge is resolved in favor of the _Player_, the claim will be fulfilled and the player will win the challenger's deposit.
- If the challenge is resolved in favor of the _Challenger_, the claim is rejected and the challenger wins the player's deposit."
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
            <GuideStepStyled>
              <GuideFirstColStyled>
                <MarkdownFieldInput
                  id="page7"
                  value="## Step 7: Recover Funds 💸
- Once a quest has expired, the _Creator_ can recover the remaining funds and the deposit.
                  
Remember, it's essential to thoroughly understand the rules and requirements of each quest before participating. Happy questing!"
                />
              </GuideFirstColStyled>
              <GuideSecondColStyled>
                <StyledPiggy />
              </GuideSecondColStyled>
            </GuideStepStyled>,
          ]}
        />
      </ModalBase>
    </BottomRightCornerStyled>
  );
}
