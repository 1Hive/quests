import { Button, useViewport } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { ConditionalWrapper } from './util';

// #region StyledComponents
const QuestActionButtonStyled = styled(Button)<{ visible: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  margin-top: ${GUpx(5)};
  margin-bottom: ${GUpx(0.5)};
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
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

const SubmitWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: center;
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
  const { below } = useViewport();

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
          <ConditionalWrapper
            condition={below('medium')}
            wrapper={(children) => <SubmitWrapperStyled>{children}</SubmitWrapperStyled>}
          >
            {submitButton}
          </ConditionalWrapper>
        )}
      </ButtonWrapperStyled>
    </WrapperStyled>
  );
}
