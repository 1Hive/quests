import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@1hive/1hive-ui';
import { WizardScreens } from './config';
import { useWizard } from '../../../providers/Wizard';

// #region Styled Components

const WrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ColorDivStyled = styled.div`
  color: ${(props) => props.color};
`;

// #endregion

function Stepper() {
  const theme = useTheme();
  const { step } = useWizard();
  const steps = WizardScreens;
  return (
    <WrapperStyled>
      {steps.map(({ title }, index) => {
        const active = index === step;
        return (
          <div>
            <ColorDivStyled color={active ? theme.info : theme.content}>{index + 1}</ColorDivStyled>
            <span>{title}</span>
          </div>
        );
      })}
    </WrapperStyled>
  );
}

export default Stepper;
