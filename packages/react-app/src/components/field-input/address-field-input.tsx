import { TextInput, EthIdenticon, AddressField } from '@1hive/1hive-ui';

import { noop } from 'lodash-es';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

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
  flex-wrap: nowrap;
  ${(props: any) => (props.wide ? 'width:100%' : '')}
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
  wide?: boolean;
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
  wide = false,
}: Props) {
  if (isLoading)
    return (
      <FieldInput label={label} id={id} compact={compact}>
        <Skeleton />
      </FieldInput>
    );
  const loadableContent = isEdit ? (
    <WrapperStyled wide={wide}>
      <TextInputStyled id={id} value={value} onChange={onChange} />
      <EthIdenticonStyled address={value} scale={1.6} />
    </WrapperStyled>
  ) : (
    <AddressField address={value} wide={wide} />
  );
  return label ? (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      tooltipDetail={tooltipDetail}
      compact={compact}
    >
      {loadableContent}
    </FieldInput>
  ) : (
    loadableContent
  );
}
