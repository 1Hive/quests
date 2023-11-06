import { Button, useViewport } from '@1hive/1hive-ui';
import { ReactNode, useEffect, useState } from 'react';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { ThemeInterface } from 'src/styles/theme';
import { useThemeContext } from 'src/contexts/theme.context';
import { ConditionalWrapper } from './util';

// #region StyledComponents
const QuestActionButtonStyled = styled(Button)<{ visible: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  margin-bottom: ${GUpx(0.5)};
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: ${GUpx(4)};
`;

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100% !important;
  row-gap: ${GUpx(2)};
`;

const ContentContainerStyled = styled.div`
  overflow: auto;
  max-height: calc(75vh - 60px) !important;
`;

const SubmitWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-items: center;
`;

const StepperPagerWrapperStyled = styled.div<{ theme: ThemeInterface }>`
  justify-content: center;
  display: flex;
  flex-direction: row;
  column-gap: ${GUpx(1)};
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25%;
    width: 24px;
    height: 24px;
    padding: ${GUpx(1)};

    background: ${({ theme }) => theme.surfaceContent};
    border: 1px solid ${({ theme }) => theme.content};
    color: ${({ theme }) => theme.accentContent};
    text-align: center;
    user-select: none;

    &:not(.active) {
      cursor: pointer;
    }

    &.active {
      background: ${({ theme }) => theme.surface};
      span {
        color: ${({ theme }) => theme.accent};
      }
    }

    span {
      color: ${({ theme }) => theme.accentContent};
    }
  }
`;

// #endregion

type Props = {
  steps?: ReactNode[];
  submitButton?: ReactNode;
  showPager?: boolean;
  onNext?: (_currentStep: number, _isSubmitStep: boolean) => boolean;
  onBack?: (_currentStep: number) => void;
};
export default function Stepper({
  steps = [],
  submitButton,
  showPager = false,
  onNext,
  onBack,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitStep, setIsSubmitStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const { below } = useViewport();
  const { currentTheme } = useThemeContext();

  const nextStep = () => {
    const isValid = onNext?.(currentStep, currentStep + 2 === steps?.length);
    if (isValid || !onNext) {
      setStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    onBack?.(currentStep);
    setStep(currentStep - 1);
  };

  const setStep = (step: number) => {
    if (step < 0 || step > steps.length - 1) {
      return;
    }

    setCurrentStep(step);

    if (isSubmitStep) {
      setIsSubmitStep(false);
    }

    if (isFirstStep) {
      setIsFirstStep(false);
    }
  };

  useEffect(() => {
    if (currentStep + 1 === steps.length) {
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
        {showPager && (
          <StepperPagerWrapperStyled theme={currentTheme}>
            {steps?.map((step, index) => (
              <div
                key={Math.random().toString()}
                tabIndex={0}
                role="button"
                className={currentStep === index ? 'active' : ''}
                onClick={() => setStep(index)}
                onKeyDown={(ev) => {
                  (ev.key === 'Enter' || ev.key === 'Space') && setStep(index);
                }}
              >
                <span>{index}</span>
              </div>
            ))}
          </StepperPagerWrapperStyled>
        )}
        {!isSubmitStep ? (
          <QuestActionButtonStyled
            className="next-step-btn"
            visible
            label="Next"
            mode="strong"
            onClick={nextStep}
          />
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
