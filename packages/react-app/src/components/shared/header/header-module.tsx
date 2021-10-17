import { ButtonBase, GU, IconDown, useTheme, useViewport } from '@1hive/1hive-ui';
import React from 'react';
import styled from 'styled-components';

// #region StyledComponents

const HeaderAccountButtonStyled = styled(ButtonBase)`
  height: 100%;
  padding: ${1 * GU}px;
  background: ${({ background }: any) => background};
  &:active {
    background: ${({ backgroundActive }: any) => backgroundActive};
  }
`;

// #endregion

type Props = {
  content: React.ReactNode;
  hasPopover?: boolean;
  icon: React.ReactNode;
  onClick: Function;
};

function HeaderModule({ content, hasPopover = true, icon, onClick }: Props) {
  const { above } = useViewport();
  const theme = useTheme();

  return (
    <HeaderAccountButtonStyled
      onClick={onClick}
      background={theme.surface}
      backgroundActive={theme.surfacePressed}
    >
      <div
        // @ts-ignore
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
                // @ts-ignore
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

export default HeaderModule;
