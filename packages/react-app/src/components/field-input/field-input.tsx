import { useTheme } from '@1hive/1hive-ui';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { HelpTooltip } from './help-tooltip';

const FieldStyled = styled.div`
  ${({ compact }: any) => (!compact ? `margin-bottom:${GUpx(1)}` : '')};
  ${({ isLoading, wide }: any) => (isLoading || wide ? `width: 100%;` : 'max-width: 100%;')};
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
  align-items: top;
  max-width: 100%;
  margin-top: ${GUpx(0.5)};
`;

const ContentWrapperStyled = styled.div`
  display: flex;
  align-items: ${({ align }: any) => align};
  ${(props: any) => (!props.compact ? 'min-height: 45px;' : '')}
  & > div {
    input {
      ${({ wide }: any) => (wide ? `max-width:none;` : '')}
    }
  }
  flex-direction: ${({ direction }: any) => direction};
  padding-left: ${GUpx(0.5)};
`;

const SkeletonWrapperStyled = styled.div`
  width: 100%;
  padding: 0 ${GUpx()};
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
}: Props) {
  const theme = useTheme();
  const labelComponent = label && (
    <LineStyled>
      <LabelStyled color={theme.contentSecondary} htmlFor={id} title={tooltip}>
        {label}
      </LabelStyled>
      {tooltip && <HelpTooltip tooltip={tooltip} />}
    </LineStyled>
  );
  return (
    <FieldStyled key={id} compact={compact} isLoading={isLoading} wide={wide}>
      {labelComponent}
      <>
        {isLoading ? (
          <SkeletonWrapperStyled>
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
