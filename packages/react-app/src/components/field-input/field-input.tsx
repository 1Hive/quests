import { useTheme } from '@1hive/1hive-ui';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

const FieldStyled = styled.div`
  ${({ compact }: any) => (!compact ? `margin-bottom:${GUpx(2)}` : '')};
  ${({ isLoading, wide }: any) => (isLoading || wide ? `width: 100%;` : 'max-width: 100%;')};
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
`;

const ContentWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  ${(props: any) => (!props.compact ? 'min-height: 45px;' : '')}
  & > div {
    input {
      ${({ wide }: any) => (wide ? `max-width:none;` : '')}
    }
  }
  flex-direction: ${({ direction }: any) => direction};
`;

const SkeletonWrapperStyled = styled.div`
  width: 100%;
  padding: 0 ${GUpx()};
`;

type Props = {
  compact?: boolean;
  label?: React.ReactNode;
  tooltip?: string;
  tooltipDetail?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  isLoading: boolean;
  wide?: boolean;
  direction?: 'row' | 'column';
};

export function FieldInput({
  id,
  children,
  compact,
  tooltip,
  tooltipDetail,
  label,
  isLoading = false,
  wide = false,
  direction = 'row',
}: Props) {
  const theme = useTheme();
  const labelComponent = label && (
    <LineStyled>
      <LabelStyled color={theme.contentSecondary} htmlFor={id}>
        {label}
      </LabelStyled>
      {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
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
          <ContentWrapperStyled compact={compact} wide={wide} direction={direction}>
            {children}
          </ContentWrapperStyled>
        )}
      </>
    </FieldStyled>
  );
}
