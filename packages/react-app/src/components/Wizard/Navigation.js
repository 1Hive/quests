import React from 'react'
import PropTypes from 'prop-types'
import { Button, IconArrowLeft, GU, useTheme } from '@1hive/1hive-ui'

function Navigation({
  backEnabled,
  backLabel,
  nextEnabled,
  nextLabel,
  onBack,
  onNext,
  showBack,
  showNext,
}) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <div>
        {showBack && (
          <Button
            disabled={!backEnabled}
            icon={
              <IconArrowLeft
                css={`
                  color: ${theme.accent};
                `}
              />
            }
            label={backLabel}
            onClick={onBack}
          />
        )}
      </div>
      <div>
        {showNext && (
          <Button
            disabled={!nextEnabled}
            label={nextLabel}
            mode="strong"
            onClick={onNext}
            css={`
              margin-left: ${1.5 * GU}px;
            `}
          />
        )}
      </div>
    </div>
  )
}

Navigation.propTypes = {
  backEnabled: PropTypes.bool.isRequired,
  backLabel: PropTypes.string.isRequired,
  nextEnabled: PropTypes.bool.isRequired,
  nextLabel: PropTypes.string.isRequired,
  showBack: PropTypes.bool.isRequired,
  showNext: PropTypes.bool.isRequired,
}

Navigation.defaultProps = {
  backEnabled: true,
  backLabel: 'Back',
  nextEnabled: true,
  nextLabel: 'Next',
  showBack: true,
  showNext: true,
}

export default Navigation
