import { Field, TextInput, TokenBadge } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import { ReactNode, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_AMOUNT } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { getNetwork } from 'src/networks';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { HelpIcon } from './icon-tooltip';

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
};

function AmountFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = DEFAULT_AMOUNT,
  onChange = noop,
  wide = false,
  formik,
  tooltip,
  tooltipDetail,
  compact = false,
}: Props) {
  const { defaultToken } = getNetwork();
  const [amount, setAmount] = useState(value.parsedAmount);
  useEffect(() => {
    setAmount(value.parsedAmount);
  }, [value.parsedAmount]);

  if (!value.token) value.token = defaultToken;

  const onAmountChange = (e: any) => {
    const newValue = +e.target.value;
    setAmount(newValue);
    value = { ...value, parsedAmount: newValue };
    if (formik) formik.setFieldValue(id, value);
    else onChange(value);
  };

  return (
    <FieldStyled
      label={
        <>
          <span title={tooltip}>{label}</span>
          {tooltip && <HelpIcon tooltip={tooltip} tooltipDetail={tooltipDetail} />}
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
                value={amount}
              />
            ) : (
              amount
            )}
          </AmountStyled>
          <TokenBadgeStyled
            symbol={value.token!.symbol}
            address={value.token!.token}
            networkType="private"
          />
        </LineStyled>
      )}
    </FieldStyled>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
