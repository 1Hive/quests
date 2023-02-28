import { TextInput, EthIdenticon, TextCopy, IconExternal, Link } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import React, { useMemo } from 'react';
import { getNetwork } from 'src/networks';
import { getExplorerUrl } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region Styled

const TextInputStyled = styled(TextInput)`
  border-radius: 12px;
  width: 100%;
  text-overflow: ellipsis;
  padding-right: 42px;
`;
const TextCopyStyled = styled(TextCopy)`
  margin-left: 1px;
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
  max-width: 400px;
  width: 100%;

  input {
    cursor: ${({ isEdit }: any) => (isEdit ? 'text' : 'default')};
  }
`;

const LineStyled = styled.div`
  display: flex;
  align-items: center;
`;

const LinkStyled = styled(Link)`
  height: 16px;
  margin-left: 8px;
  margin-bottom: 2px;
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: React.ReactNode;
  onChange?: Function;
  value?: string;
  compact?: boolean;
  tooltip?: React.ReactNode;
  wide?: boolean;
  onBlur?: Function;
  error?: string | false;
  disabled?: boolean;
  showExplorerLink?: boolean;
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
  disabled = false,
  error,
  showExplorerLink = false,
}: Props) {
  const { chainId } = getNetwork();
  const explorerLink = useMemo(
    () => `${getExplorerUrl(chainId)}/address/${value}`,
    [value, chainId],
  );

  const loadableContent = (
    <AddressWrapperStyled isEdit={isEdit} wide={wide}>
      {isEdit ? (
        <TextInputStyled
          isEdit={isEdit}
          wide={wide}
          id={id}
          value={value}
          disabled={!isEdit || disabled}
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
          disabled={!isEdit || disabled}
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
      label={
        showExplorerLink && !isLoading ? (
          <LineStyled>
            {label}
            <LinkStyled label="Open in explorer" href={explorerLink} external>
              <IconExternal size="small" />
            </LinkStyled>
          </LineStyled>
        ) : (
          label
        )
      }
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
