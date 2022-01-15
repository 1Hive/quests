import { Field, TextInput, EthIdenticon, AddressField } from '@1hive/1hive-ui';

import { noop } from 'lodash-es';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { IconTooltip } from './icon-tooltip';

// #region Styled

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;
const FieldHeaderStyled = styled(Field)`
  pointer-events: none;
`;
const DivStyled = styled.div`
  pointer-events: all !important;
`;
const LabelStyled = styled.div`
  width: 16px;
  justify-content: center;
  margin-left: 8px;
  display: flex;
  pointer-events: all !important;
`;
const TextInputStyled = styled(TextInput)`
  height: 40px;
  width: 380px;
  border-radius: 3px 0 0 3px;
`;

const EthIdenticonStyled = styled(EthIdenticon)`
  border-radius: 0 3px 3px 0;
  width: 38.4px;
  height: 38.4px;
`;

const WrapperStyled = styled.div`
  display: flex;
  pointer-events: none !important;
  flex-wrap: nowrap;
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  value?: string;
  compact?: boolean;
  tooltip?: string;
  tooltipDetail?: React.ReactNode;
};
export function AddressFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  value = '',
  onChange = noop,
  compact = false,
  tooltipDetail,
  tooltip,
}: Props) {
  if (isLoading)
    return (
      <FieldStyled label={label} key={id} compact={compact}>
        <Skeleton />
      </FieldStyled>
    );
  const loadableContent = isEdit ? (
    <WrapperStyled>
      <DivStyled>
        <TextInputStyled id={id} value={value} onChange={onChange} />
      </DivStyled>
      <EthIdenticonStyled address={value} scale={1.6} />
    </WrapperStyled>
  ) : (
    <AddressField address={value} />
  );
  return label ? (
    <>
      <FieldHeaderStyled
        label={
          <>
            <span title={tooltip}>{label}</span>
            <LabelStyled>
              {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
            </LabelStyled>
          </>
        }
        key={id}
      >
        {loadableContent}
      </FieldHeaderStyled>
    </>
  ) : (
    loadableContent
  );
}
