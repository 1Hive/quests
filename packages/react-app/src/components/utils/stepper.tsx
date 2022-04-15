import { Button } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';

import styled from 'styled-components';

const QuestActionButtonStyled = styled(Button)`
  width: 40px;
  height: 30px;
`;
const ButtonWrapperStyled = styled(Button)`
  justify-content: ${(props: any) => props.content};
  border: none;
`;
const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100% !important;
`;
type Props = {
  steps?: ReactNode[];
  submitButton?: ReactNode;
  showButton?: boolean;
  onNext?: (_currentStep: number, _isSubmitStep: boolean) => boolean;
  onBack?: (_currentStep: number) => void;
};
export default function Stepper({
  steps,
  submitButton,

  showButton = false,
  onNext,
  onBack,
}: Props) {
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
      {steps && steps[currentStep]}
      <ButtonWrapperStyled content={isFirstStep ? 'end' : 'space-between'}>
        {!isFirstStep && (
          <QuestActionButtonStyled label="Back" mode="normal" size="mini" onClick={previousStep} />
        )}
        {!isSubmitStep && showButton ? (
          <QuestActionButtonStyled label="Next" mode="positive" size="mini" onClick={nextStep} />
        ) : (
          showButton && submitButton
        )}
      </ButtonWrapperStyled>
    </WrapperStyled>
  );
}
