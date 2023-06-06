import { useTheme } from '@1hive/1hive-ui';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled, { css } from 'styled-components';
import { GUpx } from '../../utils/style.util';
import { HelpTooltip } from './help-tooltip';

const FieldStyled = styled.div<{
  id?: string;
  compact?: boolean;
  isLoading?: boolean;
  wide?: boolean;
}>`
  ${({ compact }) =>
    !compact &&
    css`
      margin-bottom: ${GUpx(1)};
    `};
  ${({ isLoading, wide }) =>
    isLoading || wide
      ? css`
          width: 100%;
        `
      : css`
          max-width: 100%;
        `};
`;

const ErrorStyled = styled.span`
  color: ${(props: any) => props.theme.negative};
  font-size: small;
  margin-left: ${GUpx(2)};
  font-style: italic;
`;

const LabelStyled = styled.label`
  color: ${(props: any) => props.color};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
  text-transform: uppercase;
  user-select: none;
  margin-bottom: ${GUpx(0.5)};
`;

const LineStyled = styled.div`
  display: flex;
  max-width: 100%;
  margin-top: ${GUpx(0.5)};
  align-items: center;
`;

const ContentWrapperStyled = styled.div<{
  compact?: boolean;
  wide?: boolean;
  align: string;
  direction: string;
}>`
  display: flex;
  align-items: ${({ align }) => align};
  ${(props) => (!props.compact ? 'min-height: 45px;' : '')}
  & > div {
    input {
      ${({ wide }) => (wide ? `max-width:none;` : '')}
    }
  }
  flex-direction: ${({ direction }) => direction};
  padding-left: ${GUpx(0.5)};
`;

const SkeletonWrapperStyled = styled.div`
  width: 100%;
  min-width: 100px;
  padding: 0 ${GUpx(1)};
`;

type Props = {
  compact?: boolean;
  label?: React.ReactNode;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  isLoading?: boolean;
  error?: string | false;
  wide?: boolean;
  direction?: 'row' | 'column';
  align?: 'center' | 'baseline' | 'flex-start' | 'flex-end' | 'unset';
  className?: string;
};

export function FieldInput({
  id,
  children,
  compact,
  tooltip,
  label,
  isLoading = false,
  wide = false,
  direction = 'row',
  align = 'center',
  error,
  className = '',
}: Props) {
  const theme = useTheme();
  const labelComponent = label && (
    <LineStyled>
      <LabelStyled color={theme.contentSecondary} htmlFor={id}>
        {label}
      </LabelStyled>
      {tooltip && <HelpTooltip tooltip={tooltip} />}
    </LineStyled>
  );
  return (
    <FieldStyled
      id={`${id}-wrapper`}
      key={id}
      compact={compact}
      isLoading={isLoading}
      wide={wide}
      className={className}
    >
      {labelComponent}
      <>
        {isLoading ? (
          <SkeletonWrapperStyled>
            {/* @ts-ignore */}
            <Skeleton />
          </SkeletonWrapperStyled>
        ) : (
          <>
            <ContentWrapperStyled compact={compact} wide={wide} direction={direction} align={align}>
              {children}
            </ContentWrapperStyled>
            {error && <ErrorStyled theme={theme}>{error}</ErrorStyled>}
          </>
        )}
      </>
    </FieldStyled>
  );
}
