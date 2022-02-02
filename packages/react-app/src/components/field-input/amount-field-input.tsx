import {
  TextInput,
  TokenBadge,
  _AutoComplete as AutoComplete,
  Tag,
  IconEdit,
  Button,
} from '@1hive/1hive-ui';
import { parseUnits } from 'ethers/lib/utils';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useEffect, useState, useRef, Fragment } from 'react';
import { NETWORK_TOKENS } from 'src/constants';
import { useWallet } from 'src/contexts/wallet.context';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { getNetwork } from 'src/networks';
import { fetchRewardTokens } from 'src/services/quest.service';
import { arrayDistinctBy } from 'src/utils/array.util';
import { getTokenInfo } from 'src/utils/contract.util';
import { GUpx } from 'src/utils/css.util';
import { Logger } from 'src/utils/logger';
import { floorNumber } from 'src/utils/math.utils';
import { includesCaseInsensitive } from 'src/utils/string.util';
import { isAddress } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { FieldInput } from './field-input';

// #region StyledComponents

const AmountTextInputStyled = styled(TextInput)`
  flex-grow: 1;
  ${({ wide }: any) => (wide ? '' : `max-width: 200px;`)}
`;

const TokenBadgeStyled = styled(TokenBadge)`
  width: fit-content;
`;

const AutoCompleteWrapperStyled = styled.div`
  flex-grow: 3;
  input {
    & + div {
      pointer-events: none;
      ${({ wide }: any) => (wide ? 'justify-content: end;' : '')}
    }
  }
  ul[role='listbox'] {
    max-height: 200px;
    overflow-y: auto;
  }
`;

const TokenNameStyled = styled.span`
  margin-right: ${GUpx()};
`;

const LineStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AmountTokenWrapperStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  ${({ wide, isEdit }: any) => (wide && isEdit ? '' : `padding-right:${GUpx()};`)}
  ${({ wide }: any) => (wide ? `width:100%;` : 'max-width:100%;')}
`;

const IconEditStyled = styled(IconEdit)`
  cursor: pointer;
  padding-left: ${GUpx()};
`;

const SpacerStyled = styled.div`
  padding-right: ${GUpx()};
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  amountLabel?: string;
  tokenLabel?: string;
  placeHolder?: string;
  value?: TokenAmountModel;
  onChange?: Function;
  formik?: any;
  compact?: boolean;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  maxDecimals?: number;
  disabled?: boolean;
  wide?: boolean;
  tokenEditable?: boolean;
  reversed?: boolean;
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
  tooltipDetail,
  compact = false,
  maxDecimals,
  disabled = false,
  wide = false,
  tokenEditable = false,
  reversed = false,
}: Props) {
  const { type } = getNetwork();
  const [decimalsCount, setDecimalsCount] = useState(maxDecimals);
  const [tokens, setTokens] = useState<TokenModel[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [amount, setAmount] = useState<number | undefined>(value?.parsedAmount);
  const [token, setToken] = useState<TokenModel | undefined>(value?.token);
  const [availableTokens, setAvailableTokens] = useState<TokenModel[]>([]);
  const { walletAddress } = useWallet();
  const tokenInputId = `token-${id}`;
  const amountInputId = `amount-${id}`;

  const autoCompleteRef: React.Ref<any> = useRef(null);

  useEffect(() => {
    if (!token)
      document.addEventListener(
        'focusin',
        () => {
          if (
            document.activeElement === autoCompleteRef.current &&
            walletAddress &&
            isEdit &&
            tokenEditable
          )
            fetchAvailableTokens();
        },
        true,
      );
  }, [walletAddress, isEdit, tokenEditable, token]);

  useEffect(() => {
    if (availableTokens.length) {
      if (searchTerm && isAddress(searchTerm)) {
        setTokens([]);
        getTokenInfo(searchTerm)
          .then((tokenInfo) => {
            if (typeof tokenInfo !== 'string') if (tokenInfo) setTokens([tokenInfo]);
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
  }, [searchTerm, availableTokens]);

  useEffect(() => {
    if (!isEdit) {
      if (value?.parsedAmount && (!maxDecimals || maxDecimals > 0))
        setDecimalsCount(maxDecimals ?? 4);
    }
  }, [maxDecimals, isEdit, value?.parsedAmount]);

  useEffect(() => {
    setAmount(value?.parsedAmount ?? 0);
    setToken(value?.token);
  }, [value]);

  const fetchAvailableTokens = async () => {
    const networkDefaultTokens = (NETWORK_TOKENS[type] as TokenModel[]) ?? [];
    const questsUsedTokens = await fetchRewardTokens();
    setAvailableTokens(
      arrayDistinctBy([...networkDefaultTokens, ...questsUsedTokens], (x) => x.token),
    );
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

  const amountField = (
    <FieldInput label={amountLabel} isLoading={isLoading} wide={wide} compact={compact}>
      <AmountTokenWrapperStyled isEdit={isEdit} wide={wide}>
        {amount !== undefined &&
          (isEdit ? (
            <AmountTextInputStyled
              id={amountInputId}
              title={!token ? 'Set token first' : undefined}
              onChange={onAmountChange}
              placeHolder={placeHolder}
              type="number"
              value={amount}
              wide={wide}
              disabled={!token ? true : disabled}
            />
          ) : (
            floorNumber(amount, decimalsCount)
          ))}
      </AmountTokenWrapperStyled>
    </FieldInput>
  );

  const tokenField = (
    <FieldInput
      label={tokenLabel}
      isLoading={isLoading}
      wide={wide}
      compact={compact}
      tooltip="Token"
      tooltipDetail="Select a token between the list or paste the token address"
    >
      {token?.token ? (
        <TokenBadgeStyled symbol={token?.symbol} address={token?.token} networkType="private" />
      ) : (
        <AutoCompleteWrapperStyled wide={wide} id={tokenInputId}>
          <AutoComplete
            items={tokens.map((x, index: number) => index)}
            onChange={setSearchTerm}
            onSelect={onTokenChange}
            ref={autoCompleteRef}
            placeholder="Search name or paste address"
            wide={wide}
            renderSelected={(i: number) => (
              <Fragment key={tokens[i].token}>{tokens[i].name}</Fragment>
            )}
            renderItem={(i: number) => (
              <LineStyled key={tokens[i].symbol}>
                <TokenNameStyled>{tokens[i].name}</TokenNameStyled>
                <Tag>{tokens[i].symbol}</Tag>
              </LineStyled>
            )}
            tabindex="-1"
          />
        </AutoCompleteWrapperStyled>
      )}
      {tokenEditable && isEdit && token && (
        <div className="btn-link">
          <Button size="mini" onClick={onTokenEditClick} tabindex="-2">
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
      tooltipDetail={tooltipDetail}
      isLoading={false}
      wide={wide}
      compact
      direction={!!amountLabel || !!tokenLabel ? 'column' : 'row'}
    >
      {reversed ? [tokenField, amountField] : [amountField, tokenField]}
    </FieldInput>
  );
}

const AmountFieldInputFormik = connect(AmountFieldInput);
export default AmountFieldInput;
export { AmountFieldInputFormik };
