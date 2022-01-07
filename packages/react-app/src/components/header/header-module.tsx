import { ButtonBase, GU, IconDown, useTheme, useViewport } from '@1hive/1hive-ui';
import React from 'react';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';

// #region StyledComponents

const HeaderAccountButtonStyled = styled(ButtonBase)`
  height: 100%;
  padding: ${GUpx()};
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
          padding: 0 ${GUpx()};
        `}
      >
        <>
          {icon}
          {above('medium') && (
            <>
              <div
                // @ts-ignore
                css={`
                  padding-left: ${GUpx()};
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
