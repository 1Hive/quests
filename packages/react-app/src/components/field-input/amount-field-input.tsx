import { TextInput, _AutoComplete as AutoComplete, Tag, IconEdit, Button } from '@1hive/1hive-ui';
import { parseUnits } from 'ethers/lib/utils';
import { connect, FormikContextType } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState, useRef, Fragment, useMemo } from 'react';
import { NETWORK_TOKENS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { getNetwork } from 'src/networks';
import { fetchRewardTokens } from 'src/services/quest.service';
import { arrayDistinctBy } from 'src/utils/array.util';
import { getTokenInfo } from 'src/utils/contract.util';
import { GUpx } from 'src/utils/style.util';
import { Logger } from 'src/utils/logger';
import { floorNumber } from 'src/utils/math.utils';
import { includesCaseInsensitive } from 'src/utils/string.util';
import { isAddress } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard.hook';
import { FieldInput } from './field-input';

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

const IconEditStyled = styled(IconEdit)`
  cursor: pointer;
  padding-left: ${GUpx(1)};
`;

const TokenAmountButtonStyled = styled(Button)<{ compact?: boolean }>`
  ${({ compact }) => (compact ? '' : `margin-left: ${GUpx(1)};`)}
  border-radius: 4px;
  font-size: 16px;
  padding: 0 ${GUpx(1)};
  font-weight: bold;
  min-width: 0;
`;

// #endregion

type TokenBadgeProp = {
  className?: string;
  compact?: boolean;
  token?: TokenModel;
  amount?: number | false;
  usdValue?: number | false;
  decimalsCount?: number;
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
    decimalsCount,
  }: TokenBadgeProp) => {
    const copyCode = useCopyToClipboard();
    const label = useMemo(() => {
      let temp = '';
      if (amount !== false && amount !== undefined) {
        temp += `${floorNumber(amount ?? 0, decimalsCount).toLocaleString()} `;
      }
      temp += `${token.symbol}`;
      if (usdValue) {
        const usdFormat = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(usdValue);
        temp += ` (${usdFormat})`;
      }
      return temp;
    }, [token, amount, usdValue]);

    const onBadgeClick = (event: Event) => {
      copyCode(token.token, `${token.symbol} address copied to clipboard`);
      event.stopPropagation();
    };

    return (
      <TokenAmountButtonStyled
        className={className}
        compact={compact}
        mode="strong"
        size="mini"
        label={label}
        title={`Copy : ${token.token}`}
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
  maxDecimals?: number;
  disabled?: boolean;
  wide?: boolean;
  tokenEditable?: boolean;
  reversed?: boolean;
  error?: string | false;
  tagOnly?: boolean;
  showUsd?: boolean;
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
  maxDecimals,
  disabled = false,
  wide = false,
  tokenEditable = false,
  reversed = false,
  tagOnly = false,
  showUsd = false,
  error,
}: Props) {
  let mounted = true;
  const { type } = getNetwork();
  const [decimalsCount, setDecimalsCount] = useState(maxDecimals);
  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [amount, setAmount] = useState<number | undefined>(value?.parsedAmount);
  const [token, setToken] = useState<TokenModel | undefined>(value?.token);
  const [availableTokens, setAvailableTokens] = useState<TokenModel[]>([]);
  const [_hasFocused, _setHasFocused] = useState<boolean>();
  const tokenInputId = tokenEditable ? id : `token-${id}`; // Handle label for
  const amountInputId = !tokenEditable ? id : `amount-${id}`; // Handle label for

  // Needed since the access of state in event handlers is not working
  const hasFocusedRef = React.useRef(_hasFocused);
  const setHasFocused = (data: boolean) => {
    hasFocusedRef.current = data;
    _setHasFocused(data);
  };
  const autoCompleteRef: React.Ref<any> = useRef(null);

  useEffect(() => {
    fetchAvailableTokens();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!token) document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [isEdit, tokenEditable, token]);

  useEffect(() => {
    if (availableTokens.length && _hasFocused) {
      if (searchTerm && isAddress(searchTerm)) {
        setTokens([]);
        getTokenInfo(searchTerm)
          .then((tokenInfo) => {
            if (typeof tokenInfo !== 'string') if (tokenInfo && mounted) setTokens([tokenInfo]);
          })
          .catch(Logger.exception);
      } else {
        setTokens(
          availableTokens.filter(
            (x: TokenModel) =>
              !searchTerm || includesCaseInsensitive([x.name, x.symbol].join('|'), searchTerm),
          ),
        );
      }
    }
  }, [searchTerm, availableTokens, _hasFocused]);

  useEffect(() => {
    if (!isEdit) {
      if (value?.parsedAmount && (!maxDecimals || maxDecimals > 0))
        setDecimalsCount(maxDecimals ?? 4);
    }
  }, [maxDecimals, isEdit, value?.parsedAmount]);

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
    const networkDefaultTokens = (NETWORK_TOKENS[type] as TokenModel[]) ?? [];
    const questsUsedTokens = await fetchRewardTokens();
    if (mounted) {
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
    <FieldInput key={`amountField${amountLabel}`} label={amountLabel} wide={wide} compact={compact}>
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
            floorNumber(amount, decimalsCount).toLocaleString()
          ))}
      </AmountTokenWrapperStyled>
    </FieldInput>
  );

  const tokenField = (
    <FieldInput
      key={`tokenLabel${tokenLabel}`}
      label={tokenLabel}
      wide={wide}
      compact={compact}
      tooltip="Select a token between the list or paste the token address"
    >
      {!isEdit || token?.token ? (
        <TokenAmountBadge
          compact={false}
          token={token}
          amount={tagOnly && amount}
          usdValue={showUsd && value?.usdValue}
          decimalsCount={decimalsCount}
        />
      ) : (
        <AutoCompleteWrapperStyled wide={wide} id={tokenInputId}>
          <AutoComplete
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
          />
        </AutoCompleteWrapperStyled>
      )}
      {tokenEditable && isEdit && token && (
        <div className="btn-link">
          <Button size="mini" onClick={onTokenEditClick} tabIndex="-1">
            <IconEditStyled size="medium" />
          </Button>
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
      compact
      direction={!!amountLabel || !!tokenLabel ? 'column' : 'row'}
      error={error}
      className={!isEdit ? 'fit-content' : ''}
    >
      {reversed ? [tokenField, amountField] : [amountField, tokenField]}
    </FieldInput>
  );
}

const AmountFieldInputFormik = connect(AmountFieldInput);
export default AmountFieldInput;
export { AmountFieldInputFormik };
