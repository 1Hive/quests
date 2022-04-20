import { Button } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';

// #region StyledComponents
const QuestActionButtonStyled = styled(Button)<{ visible: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${GUpx(5)};
  margin-bottom: ${GUpx(0.5)};
  align-items: center;
`;

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100% !important;
`;

const ContentContainerStyled = styled.div`
  overflow: auto;
  max-height: calc(60vh - 60px) !important;
`;
// #endregion

type Props = {
  steps?: ReactNode[];
  submitButton?: ReactNode;
  onNext?: (_currentStep: number, _isSubmitStep: boolean) => boolean;
  onBack?: (_currentStep: number) => void;
};
export default function Stepper({ steps, submitButton, onNext, onBack }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitStep, setIsSubmitStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);

  const nextStep = () => {
    const isValid = onNext?.(currentStep, currentStep + 2 === steps?.length);
    if (isValid) {
      if (steps && steps[currentStep + 1]) {
        setCurrentStep(currentStep + 1);
      }
      if (isFirstStep) {
        setIsFirstStep(false);
      }
    }
  };
  const previousStep = () => {
    onBack?.(currentStep);
    if (currentStep >= 1) {
      setCurrentStep(currentStep - 1);
    }
    if (isSubmitStep) {
      setIsSubmitStep(false);
    }
  };

  useEffect(() => {
    if (currentStep + 1 === steps?.length) {
      setIsSubmitStep(true);
    }
    if (currentStep === 0) {
      setIsFirstStep(true);
    }
  }, [currentStep]);

  return (
    <WrapperStyled>
      <ContentContainerStyled>{steps && steps[currentStep]}</ContentContainerStyled>
      <ButtonWrapperStyled>
        <QuestActionButtonStyled
          visible={!isFirstStep}
          label="Back"
          mode="normal"
          onClick={previousStep}
        />
        {!isSubmitStep ? (
          <QuestActionButtonStyled visible label="Next" mode="positive" onClick={nextStep} />
        ) : (
          submitButton
        )}
      </ButtonWrapperStyled>
    </WrapperStyled>
  );
}
