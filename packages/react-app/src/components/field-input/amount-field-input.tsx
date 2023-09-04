import { TextInput, _AutoComplete as AutoComplete, Tag, IconEdit, Button } from '@1hive/1hive-ui';
import { parseUnits } from 'ethers/lib/utils';
import { connect, FormikContextType } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { fetchRewardTokens } from 'src/services/quest.service';
import { arrayDistinctBy } from 'src/utils/array.util';
import { getTokenInfo } from 'src/utils/contract.util';
import { GUpx } from 'src/utils/style.util';
import { includesCaseInsensitive } from 'src/utils/string.util';
import { isAddress } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard.hook';
import { useIsMountedRef } from 'src/hooks/use-mounted.hook';
import { TOKENS } from 'src/tokens';
import { getNetwork } from 'src/networks';
import { sleep } from 'src/utils/common.util';
import { FieldInput } from './field-input';
import { ConditionalWrapper } from '../utils/util';
import { isDevelopement } from '../utils/debug-util';

// #region StyledComponents

const AmountTextInputStyled = styled(TextInput)`
  flex-grow: 1;
  ${({ wide }: any) => (wide ? '' : `max-width: 200px;`)}
`;

const AutoCompleteWrapperStyled = styled.div<{ wide?: boolean }>`
  flex-grow: 3;
  input {
    & + div {
      pointer-events: none;
      ${({ wide }) => (wide ? 'justify-content: end;' : '')}
    }
  }
  ul[role='listbox'] {
    max-height: 200px;
    overflow-y: auto;
  }
`;

const TokenNameStyled = styled.span`
  margin-right: ${GUpx(1)};
`;

const LineStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
interface AmountTokenWrapperStyledProps {
  isEdit?: boolean;
  wide?: boolean;
}

const AmountTokenWrapperStyled = styled.div<AmountTokenWrapperStyledProps>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  ${({ wide, isEdit }) => (wide && isEdit ? '' : `padding-right:${GUpx(1)};`)}
  ${({ wide }) => (wide ? `width:100%;` : 'max-width:100%;')}
`;

const TokenAmountButtonStyled = styled(Button)<{ compact?: boolean }>`
  ${({ compact }) => (compact ? '' : `margin-left: ${GUpx(1)};`)}
  border-radius: 4px;
  font-size: 16px;
  padding: 0 ${GUpx(1)};
  font-weight: bold;
  min-width: 0;

  &:after {
    border-radius: 4px !important;
  }
`;

const AmountEllipsisWrapperStyled = styled.div`
  overflow: hidden;
  max-width: ${GUpx(15)};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonMiniIconStyled = styled(Button)`
  width: 16px;
  height: 16px;
  margin-left: ${GUpx(1)};
`;

const IconEditStyled = styled(IconEdit)`
  cursor: pointer;
`;

// #endregion

type TokenBadgeProp = {
  className?: string;
  compact?: boolean;
  token?: TokenModel;
  amount?: number | false;
  usdValue?: number | false;
};

const TokenAmountBadge = React.memo(
  ({
    className,
    compact,
    token = {
      symbol: 'No token',
      name: 'No token',
      token: '0x0',
      decimals: 0,
      amount: '0x0',
    },
    amount,
    usdValue,
  }: TokenBadgeProp) => {
    const { isTestNetwork } = getNetwork();
    const copyCode = useCopyToClipboard();
    const label = useMemo(() => {
      let temp = '';
      if (amount !== false && amount !== undefined) {
        const amountFormat = new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 4,
        }).format(amount);
        temp += `${amountFormat} `;
      }
      temp += `${token.symbol}`;
      if (amount) {
        if (usdValue || isTestNetwork) {
          const usdFormat = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(usdValue || amount);
          temp += ` (${usdFormat})`;
        } else if (usdValue === undefined) {
          temp += ' (*)';
        }
      }

      return temp;
    }, [token, amount, usdValue]);

    const onBadgeClick = () => {
      copyCode(token.token, `${token.symbol} address copied to clipboard`);
    };

    return (
      <TokenAmountButtonStyled
        className={className}
        compact={compact}
        mode="strong"
        size="mini"
        label={label}
        title={`Copy : ${token.token}${
          usdValue === undefined
            ? `\n* This token don't have pair with our stable list (see footer)`
            : ''
        }`}
        onClick={onBadgeClick}
      />
    );
  },
);

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  amountLabel?: string;
  tokenLabel?: string;
  placeHolder?: string;
  value?: TokenAmountModel | null;
  onChange?: Function;
  formik?: FormikContextType<any>;
  compact?: boolean;
  tooltip?: ReactNode;
  disabled?: boolean;
  wide?: boolean;
  tokenEditable?: boolean;
  reversed?: boolean;
  error?: string | false;
  tagOnly?: boolean;
  showUsd?: boolean;
  className?: string;
};

function AmountFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label,
  amountLabel,
  tokenLabel,
  placeHolder = '',
  value,
  onChange = noop,
  formik,
  tooltip,
  compact = false,
  disabled = false,
  wide = false,
  tokenEditable = false,
  reversed = false,
  tagOnly = false,
  showUsd = false,
  className = '',
  error,
}: Props) {
  const isMountedRef = useIsMountedRef();
  const { networkId, name } = getNetwork();
  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [amount, setAmount] = useState<number | undefined>(value?.parsedAmount);
  const [token, setToken] = useState<TokenModel | undefined>(value?.token);
  const [availableTokens, setAvailableTokens] = useState<TokenModel[]>([]);
  const [_hasFocused, _setHasFocused] = useState<boolean>();
  const tokenInputId = tokenEditable ? id : `token-${id}`; // Handle label for
  const amountInputId = !tokenEditable ? id : `amount-${id}`; // Handle label for
  const [errorState, setErrorState] = useState<string | false | undefined>(error);

  // Needed since the access of state in event handlers is not working
  const hasFocusedRef = React.useRef(_hasFocused);
  const setHasFocused = (data: boolean) => {
    hasFocusedRef.current = data;
    _setHasFocused(data);
  };
  const autoCompleteRef: React.Ref<any> = useRef(null);

  useEffect(() => {
    if (tokenEditable && !availableTokens.length && !isLoading) fetchAvailableTokens();
  }, [isEdit, isLoading]);

  useEffect(() => {
    if (!token) document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [isEdit, tokenEditable, token]);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm && isAddress(searchTerm)) {
        setTokens([]);
        let tokenInfo;
        try {
          tokenInfo = await getTokenInfo(searchTerm);
        } catch {
          tokenInfo = null;
        }
        if (isMountedRef.current) {
          if (tokenInfo) {
            setTokens([tokenInfo]);
          } else {
            setErrorState(`No token found with this address on ${name}`);
          }
        }
      } else {
        setTokens(
          availableTokens.filter(
            (x: TokenModel) =>
              !searchTerm || includesCaseInsensitive([x.name, x.symbol].join('|'), searchTerm),
          ),
        );
      }
    };
    if (availableTokens.length && _hasFocused) {
      handleSearch();
    }
  }, [searchTerm, availableTokens, _hasFocused]);

  useEffect(() => {
    setAmount(value?.parsedAmount ?? 0);
    setToken(value?.token);
  }, [value?.parsedAmount, value?.token]);

  const handleFocusIn = (e: FocusEvent) => {
    if (document.activeElement === autoCompleteRef.current && isEdit && tokenEditable) {
      setHasFocused(true);
    } else if (
      document.activeElement !== autoCompleteRef.current &&
      hasFocusedRef.current &&
      !document.activeElement?.children[0]?.classList.contains('token-row')
    ) {
      formik?.handleBlur({ ...e, target: { id, name: id } });
      setHasFocused(false);
    }
  };

  const fetchAvailableTokens = async () => {
    const networkDefaultTokens =
      Object.values<TokenModel>(TOKENS[networkId]).filter((x) => !!x.token) ?? [];
    const questsUsedTokens = await fetchRewardTokens();

    if (isMountedRef.current) {
      setAvailableTokens(
        arrayDistinctBy([...networkDefaultTokens, ...questsUsedTokens], (x) => x.token),
      );
    }
  };

  const onAmountChange = (e: any) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    if (token && e.target.value !== '') {
      applyChanges({
        token: {
          ...token,
          amount: parseUnits(newAmount.toString(), token.decimals).toString(),
        },
        parsedAmount: +newAmount,
      });
    }
  };

  const onTokenChange = (i: number) => {
    const newToken = tokens[i];
    autoCompleteRef.current.value = newToken.symbol;
    setSearchTerm(undefined);
    applyChanges({ token: newToken, parsedAmount: amount });
  };

  const onTokenEditClick = () => {
    fetchAvailableTokens();
    applyChanges({ token: undefined, parsedAmount: amount });
  };

  const applyChanges = (nextValue: Partial<TokenAmountModel>) => {
    setToken(nextValue.token);
    setAmount(nextValue.parsedAmount);
    if (formik) formik.setFieldValue(id, nextValue);
    else onChange(nextValue);
  };
  const amountField = (isEdit || !tagOnly) && (
    <FieldInput id={amountInputId} key={amountInputId} label={amountLabel} wide={wide} compact>
      <AmountTokenWrapperStyled isEdit={isEdit} wide={wide}>
        {amount !== undefined &&
          (isEdit ? (
            <AmountTextInputStyled
              id={amountInputId}
              title={!token ? 'Set token first' : undefined}
              onChange={onAmountChange}
              placeHolder={placeHolder}
              onBlur={(e: React.FocusEvent) => {
                formik?.setFieldTouched(id, true);
                formik?.handleBlur(e);
              }}
              type="number"
              value={amount}
              wide={wide}
              disabled={!token ? true : disabled}
            />
          ) : (
            <ConditionalWrapper
              condition={compact}
              wrapper={(children) => (
                <AmountEllipsisWrapperStyled title={children?.toString()}>
                  {children}
                </AmountEllipsisWrapperStyled>
              )}
            >
              {Intl.NumberFormat('en-US', { maximumFractionDigits: 4, useGrouping: true }).format(
                amount,
              )}
            </ConditionalWrapper>
          ))}
      </AmountTokenWrapperStyled>
    </FieldInput>
  );

  const tokenField = (
    <FieldInput
      id={tokenInputId}
      key={tokenInputId}
      label={tokenLabel}
      wide={wide}
      compact
      tooltip="Select a token between the list or paste the token address"
    >
      {!isEdit || token?.token ? (
        <TokenAmountBadge
          compact={false}
          token={token}
          amount={tagOnly && amount}
          usdValue={showUsd && value?.usdValue}
        />
      ) : (
        <AutoCompleteWrapperStyled wide={wide}>
          <AutoComplete
            id={tokenInputId}
            items={tokens.map((_, index: number) => index)}
            onChange={setSearchTerm}
            onSelect={onTokenChange}
            ref={autoCompleteRef}
            onBlur={(e: FocusEvent) => formik?.handleBlur(e)}
            placeholder={availableTokens.length ? 'Search name or paste address' : 'Loading tokens'}
            wide={wide}
            renderSelected={(i: number) => (
              <Fragment key={tokens[i].token}>{tokens[i].name}</Fragment>
            )}
            renderItem={(i: number) => (
              <LineStyled key={tokens[i].symbol} className="token-row">
                <TokenNameStyled>{tokens[i].name}</TokenNameStyled>
                <Tag mode="identifier" title={tokens[i].token}>
                  {tokens[i].symbol}
                </Tag>
              </LineStyled>
            )}
            tabIndex="-1"
            disabled={!availableTokens.length}
          />
        </AutoCompleteWrapperStyled>
      )}
      {tokenEditable && isEdit && token && (
        <div className="btn-link">
          <ButtonMiniIconStyled
            size="mini"
            onClick={onTokenEditClick}
            label="edit"
            display="icon"
            title="Edit token"
            icon={<IconEditStyled size="small" />}
          />
        </div>
      )}
    </FieldInput>
  );

  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      isLoading={isLoading}
      wide={wide}
      compact={compact}
      direction={!!amountLabel || !!tokenLabel ? 'column' : 'row'}
      error={errorState}
      className={`${!isEdit ? 'fit-content' : ''} ${className}`}
    >
      {reversed ? [tokenField, amountField] : [amountField, tokenField]}
    </FieldInput>
  );
}

const AmountFieldInputFormik = connect(AmountFieldInput);
export default AmountFieldInput;
export { AmountFieldInputFormik };
