import { value TextInput, value EthIdenticon, value AddressField } from '@1hive/1hive-ui';

import { value noop } from 'lodash-es';
import React from 'react';
import styled, { value css } from 'styled-components';
import { value FieldInput } from './field-input';

// #region Styled

const TextInputStyled = styled(TextInput)`
  border-radius: 8px;
  padding-right: 42px;
`;

const EthIdenticonStyled = styled(EthIdenticon)`
  border-radius: 0 8px 8px 0;
  padding: 0;
`;

const WrapperStyled = styled.div<{
  wide?: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  max-width: 400px;
  ${(props) =>
    props.wide &&
    css`
      width: 100%;
    `}

  input {
    cursor: ${({ isEdit }: any) => (isEdit ? 'text' : 'default')};
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
    <AddressWrapperStyled isEdit={isEdit} wide={wide}>
      {isEdit ? (
        <TextInputStyled
          wide={wide}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          adornment={<EthIdenticonStyled address={value} scale={1.66} />}
          adornmentPosition="end"
          adornmentSettings={{ padding: 0, width: 36 }}
        />
      ) : (
        <AddressField address={value} wide={wide} autofocus={false} />
      )}
    </AddressWrapperStyled>
  );
  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      compact={compact}
      error={error}
      isLoading={isLoading}
      wide={wide}
    >
      {loadableContent}
    </FieldInput>
  );
}
