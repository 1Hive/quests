import { TextInput, EthIdenticon, AddressField } from '@1hive/1hive-ui';

import { noop } from 'lodash-es';
import React from 'react';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

const TextInputStyled = styled(TextInput)`
  height: 40px;
  width: 370px;
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

  input {
    cursor: default;
  }
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
  tooltip?: React.ReactNode;
  wide?: boolean;
  onBlur?: Function;
  error?: string | false;
};
export function AddressFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  value = '',
  onChange = noop,
  compact = false,
  tooltip,
  wide = false,
  onBlur = noop,
  error,
}: Props) {
  const loadableContent = (
    <WrapperStyled wide={wide}>
      {isEdit ? (
        <>
          <TextInputStyled id={id} value={value} onChange={onChange} onBlur={onBlur} />
          <EthIdenticonStyled address={value} scale={1.6} />
        </>
      ) : (
        <AddressField address={value} wide={wide} autofocus={false} />
      )}
    </WrapperStyled>
  );
  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      compact={compact}
      error={error}
      isLoading={isLoading}
    >
      {loadableContent}
    </FieldInput>
  );
}
