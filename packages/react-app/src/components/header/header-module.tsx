import { Button, IconDown, useTheme, useViewport } from '@1hive/1hive-ui';
import React from 'react';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';

// #region StyledComponents

const HeaderAccountButtonStyled = styled(Button)`
  // Deault link button style override
  color: unset !important;
  padding-left: ${GUpx(1)} !important;
  margin: ${GUpx(1)} 0;
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
  const { below } = useViewport();
  const theme = useTheme();

  return (
    <div
      className="
    btn-link"
    >
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
          `}
        >
          <>
            {icon}
            {!below('medium') && (
              <>
                <div
                  // @ts-ignore
                  css={`
                    padding-left: ${GUpx(1)};
                    padding-right: ${GUpx(0.5)};
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
    </div>
  );
}

export default HeaderModule;
