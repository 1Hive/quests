import { Field, TextInput, TokenBadge, _AutoComplete as AutoComplete } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { NETWORK_TOKENS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { getNetwork } from 'src/networks';
import { GUpx } from 'src/utils/css.util';
import { floorNumber } from 'src/utils/math.utils';
import { toBigNumber } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

// #region StyledComponents

const LineStyled = styled.div`
  display: flex;
  align-items: center;
`;
const AmountStyled = styled.div`
  margin-top: 2px;
  margin-right: ${GUpx()};
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

// #endregion

type Props = {
  id: string | number;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  placeHolder?: string;
  value?: TokenAmountModel;
  onChange?: Function;
  wide?: boolean;
  formik?: any;
  compact?: boolean;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  maxDecimals?: number;
  disabled?: boolean;
  min?: number;
  max?: number;
};

function AmountFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value,
  onChange = noop,
  wide = false,
  formik,
  tooltip,
  tooltipDetail,
  compact = false,
  maxDecimals,
  disabled = false,
  min,
  max,
}: Props) {
  const { defaultToken, type } = getNetwork();
  const [amount, setAmount] = useState(value?.parsedAmount ?? 0);
  const [decimalsCount, setDecimalsCount] = useState(maxDecimals);
  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>();
  const autoCompleteRef: React.Ref<any> = useRef(null);

  useEffect(() => {
    setTokens(NETWORK_TOKENS[type]);
  }, []);

  useEffect(() => {
    if (!isEdit) {
      if (value?.parsedAmount && (!maxDecimals || maxDecimals > 0))
        setDecimalsCount(maxDecimals ?? Math.floor(Math.log10(value.parsedAmount)) * -1);
    }
  }, [maxDecimals, isEdit, value?.parsedAmount]);

  useEffect(() => {
    setAmount(value?.parsedAmount ?? 0);
    if (value && !value.token) value.token = defaultToken;
  }, [value]);

  const onAmountChange = (e: any) => {
    const newValue = +e.target.value;
    setAmount(newValue);
    value = { token: value?.token ?? defaultToken, parsedAmount: newValue };
    value.token.amount = toBigNumber(value).toString();
    if (formik) formik.setFieldValue(id, value);
    else onChange(value);
  };

  const onTokenSelect = (newValue: TokenModel) => {
    autoCompleteRef.current.value = newValue.symbol;
    setSearchTerm(null);
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
        <LineStyled>
          <AmountStyled>
            {isEdit ? (
              <TextInput
                id={id}
                wide={wide}
                onChange={onAmountChange}
                placeHolder={placeHolder}
                type="number"
                min={min}
                max={max}
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
              items={tokens.filter((x) =>
                new RegExp([x.name, x.symbol].join('|'), 'i').test(searchTerm ?? ''),
              )}
              onChange={setSearchTerm}
              onSelect={onTokenSelect}
              ref={autoCompleteRef}
              placeholder="Search name or paste address"
              renderItem={(x: TokenModel) => (
                <>
                  <span>{x.name}</span>
                  <TokenBadgeStyled symbol={x.symbol} address={x.token} networkType="private" />
                </>
              )}
              wide
            />
          )}
        </LineStyled>
      )}
    </FieldStyled>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
