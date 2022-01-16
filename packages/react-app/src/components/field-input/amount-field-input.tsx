import { Field, TextInput, TokenBadge } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import { ReactNode, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { GUpx } from 'src/utils/css.util';
import { floorNumber } from 'src/utils/math.utils';
import { toBigNumber } from 'src/utils/web3.utils';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

// #region StyledComponents
const FieldHeaderStyled = styled(Field)`
  pointer-events: none;
`;
const DivStyled = styled.div`
  pointer-events: all !important;
`;

const LineStyled = styled.div`
  display: flex;
  align-items: center;
`;
const AmountStyled = styled.div`
  margin-top: 2px;
  margin-right: ${GUpx()};
`;

const TokenBadgeStyled = styled(TokenBadge)`
  width: fit-content;
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
}: Props) {
  const { defaultToken } = getNetwork();
  const [amount, setAmount] = useState(value?.parsedAmount ?? 0);
  const [decimalsCount, setDecimalsCount] = useState(maxDecimals);

  useEffect(() => {
    if (!isEdit) {
      const decimalPos = maxDecimals ? 0 : Math.floor(Math.log10(0.0000002)) * -1;
      if (decimalPos > 0) setDecimalsCount(maxDecimals ?? decimalPos);
    }
  }, [maxDecimals, isEdit]);

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

  return (
    <FieldHeaderStyled
      label={
        <>
          <span title={tooltip}>{label}</span>
          <>{tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}</>
        </>
      }
      key={id}
      compact={compact}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        // <DivStyled>
        <LineStyled>
          <AmountStyled>
            {isEdit ? (
              <DivStyled>
                <TextInput
                  id={id}
                  wide={wide}
                  onChange={onAmountChange}
                  placeHolder={placeHolder}
                  type="number"
                  value={amount}
                />
              </DivStyled>
            ) : (
              floorNumber(amount, decimalsCount)
            )}
          </AmountStyled>
          {value?.token.symbol && (
            <TokenBadgeStyled
              symbol={value.token.symbol}
              address={value.token.token}
              networkType="private"
            />
          )}
        </LineStyled>
      )}
    </FieldHeaderStyled>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
