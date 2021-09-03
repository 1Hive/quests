import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconArrowLeft, GU, useTheme } from '@1hive/1hive-ui';
import styled from 'styled-components';

// #region Styled Components

const WrapperStyled = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const IconArrowLeftStyled = styled(IconArrowLeft)`
  color: ${(props) => props.color};
`;

// #endregion

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
  const theme = useTheme();

  return (
    <WrapperStyled>
      <div>
        {showBack && (
          <Button
            disabled={!backEnabled}
            icon={<IconArrowLeftStyled color={theme.accent} />}
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
    </WrapperStyled>
  );
}

Navigation.propTypes = {
  backEnabled: PropTypes.bool,
  backLabel: PropTypes.string,
  nextEnabled: PropTypes.bool,
  nextLabel: PropTypes.string,
  showBack: PropTypes.bool,
  showNext: PropTypes.bool,
};

Navigation.defaultProps = {
  backEnabled: true,
  backLabel: 'Back',
  nextEnabled: true,
  nextLabel: 'Next',
  showBack: true,
  showNext: true,
};

export default Navigation;
