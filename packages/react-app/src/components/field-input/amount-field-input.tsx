import { Field, TextInput, TokenBadge, _AutoComplete as AutoComplete, Tag } from '@1hive/1hive-ui';
import { parseUnits } from 'ethers/lib/utils';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState, useRef } from 'react';
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
import { IconTooltip } from './icon-tooltip';

// #region StyledComponents

const ColumnStyled = styled.div`
  display: flex;
  align-items: center;
`;

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

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;

const TokenBadgeStyled = styled(TokenBadge)`
  width: fit-content;
`;

const AutoCompleteStyled = styled(AutoComplete)`
  display: block;
`;

const TokenNameStyled = styled.span`
  margin-right: ${GUpx()};
`;

// #endregion

type Props = {
  id: string | number;
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
    setAmount(value?.parsedAmount);
    setToken(value?.token ?? defaultToken);
  }, [value]);

  const onAmountChange = (e: any) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    if (newAmount) {
      const nextValue = {
        token: {
          ...token,
          amount: parseUnits(newAmount.toString(), token.decimals).toString(),
        },
        parsedAmount: +newAmount,
      };
      console.log({ nextValue });
      if (formik) formik.setFieldValue(id, nextValue);
      else onChange(nextValue);
    }
  };

  const onTokenChange = (newToken: TokenModel) => {
    autoCompleteRef.current.value = newToken.symbol;
    setSearchTerm(undefined);
    setToken(newToken);
    if (amount) {
      const nextValue = { token: newToken, parsedAmount: amount };
      if (formik) formik.setFieldValue(id, nextValue);
      else onChange(nextValue);
    }
  };

  return (
    <FieldStyled
      label={
        <>
          <span title={tooltip}>{label}</span>
          {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
        </>
      }
      key={id}
      compact={compact}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <ColumnStyled>
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
          {value?.token.token ? (
            <TokenBadgeStyled
              symbol={value.token.symbol}
              address={value.token.token}
              networkType="private"
            />
          ) : (
            <AutoCompleteStyled
              items={tokens}
              selected={token}
              onChange={setSearchTerm}
              onSelect={onTokenChange}
              ref={autoCompleteRef}
              placeholder="name / symbol / address"
              renderSelected={(x: TokenModel) => `✔️${x.symbol}:${x.name}`}
              renderItem={(x: TokenModel) => (
                <>
                  <TokenNameStyled>{x.name}</TokenNameStyled>
                  <Tag mode="identifier">{x.symbol}</Tag>
                </>
              )}
            />
          )}
        </ColumnStyled>
      )}
    </FieldStyled>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
