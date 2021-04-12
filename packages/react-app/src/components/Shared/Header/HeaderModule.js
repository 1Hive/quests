import PropTypes from 'prop-types';
import React from 'react';
import { ButtonBase, GU, IconDown, useTheme, useViewport } from '@1hive/1hive-ui';
import styled from 'styled-components';

// #region StyledComponents

const HeaderAccountButtonStyled = styled(ButtonBase)`
  height: 100%;
  padding: ${1 * GU}px;
  background: ${({ background }) => background};
  &:active {
    background: ${({ backgroundActive }) => backgroundActive};
  }
`;

// #endregion

function HeaderModule({ content, hasPopover = true, icon, onClick }) {
  const { above } = useViewport();
  const theme = useTheme();

  return (
    <HeaderAccountButtonStyled
      onClick={onClick}
      background={theme.surface}
      backgroundActive={theme.surfacePressed}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px;
        `}
      >
        <>
          {icon}
          {above('medium') && (
            <>
              <div
                css={`
                  padding-left: ${1 * GU}px;
                  padding-right: ${0.5 * GU}px;
                `}
              >
                {content}
              </div>
              {hasPopover && (
                <IconDown
                  size="small"
                  css={`
                    color: ${theme.surfaceIcon};
                  `}
                />
              )}
            </>
          )}
        </>
      </div>
    </HeaderAccountButtonStyled>
  );
}

HeaderModule.propTypes = {
  content: PropTypes.node,
  hasPopover: PropTypes.bool,
  icon: PropTypes.node,
  onClick: PropTypes.func,
};

export default HeaderModule;
