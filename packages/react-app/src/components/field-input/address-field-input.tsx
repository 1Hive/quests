import { TextInput, EthIdenticon, IconCopy, Button, TextCopy } from '@1hive/1hive-ui';
import { ClientError } from 'graphql-request';
import { noop } from 'lodash-es';
import React from 'react';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard.hook';
import styled, { css } from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

const TextInputStyled = styled(TextInput)`
  border-radius: 12px;
  //overflow: hidden !important;
  width: 100%;
  text-overflow: ellipsis;
  padding-right: 42px;
`;
const TextCopyStyled = styled(TextCopy)`
  margin-left: 1px;
`;
const ButtonStyled = styled(Button)`
  border: none;
  background: none;
  margin-left: -45px;
  z-index: 0;
  margin-bottom: 1px;
  cursor: pointer;
`;

const EthIdenticonStyled = styled(EthIdenticon)<{ isEdit: boolean }>`
  border-radius: ${({ isEdit }) => (isEdit ? '0 12px 12px 0' : '4px 0 0 4px')};
  padding: 0;
`;

const AddressWrapperStyled = styled.div<{
  wide: boolean;
  isEdit: boolean;
}>`
  align-items: center;
  display: flex;
  //flex-wrap: nowrap;
  max-width: 400px;
  width: 100%;

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
  const copyCode = useCopyToClipboard();
  const copyAddress = () => {
    copyCode(value, 'Wallet address copied to clipboard');
  };
  const loadableContent = (
    <AddressWrapperStyled isEdit={isEdit} wide={wide} onClick={(e) => e.stopPropagation()}>
      {isEdit ? (
        <TextInputStyled
          isEdit={isEdit}
          wide={wide}
          id={id}
          value={value}
          disabled={!isEdit}
          onChange={onChange}
          onBlur={onBlur}
          adornment={<EthIdenticonStyled isEdit={isEdit} address={value} scale={1.66} />}
          adornmentPosition={isEdit ? 'end' : 'start'}
          adornmentSettings={{ padding: 0, width: 36 }}
        />
      ) : (
        <TextCopyStyled
          isEdit={isEdit}
          wide={wide}
          message="Address copied to clipboard"
          id={id}
          value={value}
          disabled={!isEdit}
          onChange={onChange}
          onBlur={onBlur}
          adornment={<EthIdenticonStyled isEdit={isEdit} address={value} scale={1.66} />}
          adornmentPosition={isEdit ? 'end' : 'start'}
          adornmentSettings={{ padding: 0, width: 36 }}
        />
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
