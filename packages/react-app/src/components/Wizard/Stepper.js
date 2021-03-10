import React from 'react'
import { useTheme } from '@1hive/1hive-ui'
import { WizardScreens } from './config'
import { useWizard } from '../../providers/Wizard'

function Stepper() {
  const theme = useTheme()
  const { step } = useWizard()
  const steps = WizardScreens
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      {steps.map(({ title }, index) => {
        const active = index === step
        return (
          <div>
            <div
              css={`
                color: ${active ? theme.info : theme.content};
              `}
            >
              {index + 1}
            </div>
            <span>{title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
