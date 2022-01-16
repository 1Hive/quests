import { Field, TextInput, TokenBadge, _AutoComplete as AutoComplete, Tag } from '@1hive/1hive-ui';
import { parseUnits } from 'ethers/lib/utils';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState, useRef, Fragment } from 'react';
import Skeleton from 'react-loading-skeleton';
import { NETWORK_TOKENS } from 'src/constants';
import { useWallet } from 'src/contexts/wallet.context';
import { getTokenInfo } from 'src/hooks/use-contract.hook';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { getNetwork } from 'src/networks';
import { fetchRewardTokens } from 'src/services/quest.service';
import { arrayDistinctBy } from 'src/utils/array.util';
import { GUpx } from 'src/utils/css.util';
import { Logger } from 'src/utils/logger';
import { floorNumber } from 'src/utils/math.utils';
import { includesCaseInsensitive } from 'src/utils/string.util';
import { isAddress } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region StyledComponents

const AmountStyled = styled.div`
  margin-top: 2px;
  margin-right: ${GUpx()};
`;

const AmountTextInputStyled = styled(TextInput)`
  width: 75px;
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

const TokenBadgeStyled = styled(TokenBadge)`
  width: fit-content;
`;

const AutoCompleteStyled = styled(AutoComplete)`
  width: 50%;
`;

const TokenNameStyled = styled.span`
  margin-right: ${GUpx()};
`;

const LineStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  placeHolder?: string;
  value?: TokenAmountModel;
  onChange?: Function;
  formik?: any;
  compact?: boolean;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  maxDecimals?: number;
  disabled?: boolean;
};

function AmountFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value,
  onChange = noop,
  formik,
  tooltip,
  tooltipDetail,
  compact = false,
  maxDecimals,
  disabled = false,
}: Props) {
  const { defaultToken, type } = getNetwork();
  const [decimalsCount, setDecimalsCount] = useState(maxDecimals);
  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [amount, setAmount] = useState<number | undefined>(value?.parsedAmount ?? 0);
  const [token, setToken] = useState<TokenModel>(value?.token ?? defaultToken);
  const [availableTokens, setAvailableTokens] = useState<TokenModel[]>([]);
  const wallet = useWallet();

  const autoCompleteRef: React.Ref<any> = useRef(null);

  useEffect(() => {
    const fetchAvailableTokens = async () => {
      const networkDefaultTokens = (NETWORK_TOKENS[type] as TokenModel[]) ?? [];
      const questsUsedTokens = await fetchRewardTokens();
      setAvailableTokens(
        arrayDistinctBy([...networkDefaultTokens, ...questsUsedTokens], (x) => x.token),
      );
    };

    if (wallet.account && isEdit && !value?.token) fetchAvailableTokens();
  }, [wallet.account]);

  useEffect(() => {
    if (availableTokens.length) {
      if (searchTerm && isAddress(searchTerm)) {
        setTokens([]);
        getTokenInfo(searchTerm)
          .then((tokenInfo: TokenModel) => {
            setTokens([tokenInfo]);
          })
          .catch(Logger.error);
      } else {
        setTokens(
          availableTokens.filter(
            (x: TokenModel) =>
              !searchTerm || includesCaseInsensitive([x.name, x.symbol].join('|'), searchTerm),
          ),
        );
      }
    }
  }, [searchTerm, availableTokens]);

  useEffect(() => {
    if (!isEdit) {
      if (value?.parsedAmount && (!maxDecimals || maxDecimals > 0))
        setDecimalsCount(maxDecimals ?? Math.floor(Math.log10(value.parsedAmount)) * -1);
    }
  }, [maxDecimals, isEdit, value?.parsedAmount]);

  useEffect(() => {
    setAmount(value?.parsedAmount ?? 0);
    setToken(value?.token ?? defaultToken);
  }, [value]);

  const onAmountChange = (e: any) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    if (token) {
      const nextValue = {
        token: {
          ...token,
          amount: parseUnits(newAmount.toString(), token.decimals).toString(),
        },
        parsedAmount: +newAmount,
      };
      if (formik) formik.setFieldValue(id, nextValue);
      else onChange(nextValue);
    }
  };

  const onTokenChange = (i: number) => {
    const newToken = tokens[i];
    autoCompleteRef.current.value = newToken.symbol;
    setSearchTerm(undefined);
    setToken(newToken);
    const nextValue = { token: newToken, parsedAmount: amount };
    if (formik) formik.setFieldValue(id, nextValue);
    else onChange(nextValue);
  };

  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      tooltipDetail={tooltipDetail}
      compact={compact}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <LineStyled>
          {amount !== undefined && (
            <AmountStyled>
              {isEdit ? (
                <AmountTextInputStyled
                  id={id}
                  onChange={onAmountChange}
                  placeHolder={placeHolder}
                  type="number"
                  value={amount}
                  disabled={disabled}
                />
              ) : (
                floorNumber(amount, decimalsCount)
              )}
            </AmountStyled>
          )}
          {value?.token.token ? (
            <TokenBadgeStyled
              symbol={value.token.symbol}
              address={value.token.token}
              networkType="private"
            />
          ) : (
            <AutoCompleteStyled
              items={tokens.map((x, index: number) => index)}
              onChange={setSearchTerm}
              onSelect={onTokenChange}
              ref={autoCompleteRef}
              placeholder="search token"
              wide
              renderSelected={(i: number) => (
                <Fragment key={tokens[i].token}>{tokens[i].name}</Fragment>
              )}
              renderItem={(i: number) => (
                <LineStyled key={tokens[i].symbol}>
                  <TokenNameStyled>{tokens[i].name}</TokenNameStyled>
                  <Tag>{tokens[i].symbol}</Tag>
                </LineStyled>
              )}
            />
          )}
        </LineStyled>
      )}
    </FieldInput>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
