import { Field, GU, TextInput, TokenBadge } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop, toNumber } from 'lodash-es';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_AMOUNT, TOKENS } from 'src/constants';
import { TokenAmount } from 'src/models/token-amount';
import styled from 'styled-components';

// #region StyledComponents

const LineStyled = styled.div`
  display: flex;
  align-items: center;
`;
const AmountStyled = styled.div`
  margin-top: 2px;
  margin-right: ${GU}px;
`;

// #endregion

type Props = {
  id: string | number;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  placeHolder?: string;
  value?: TokenAmount;
  onChange?: Function;
  wide?: boolean;
  formik?: any;
};

function AmountFieldInput({
  id,
  isEdit = true,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = DEFAULT_AMOUNT,
  onChange = noop,
  wide = false,
  formik,
}: Props) {
  if (value?.amount === undefined) value.amount = 0;
  if (value?.token === undefined) value.token = TOKENS.honey;
  const [amount, setAmount] = useState(value.amount);

  const onAmountChange = (e: any) => {
    setAmount(e.target.value);
    value = { ...value, amount: toNumber(amount) };
    formik?.setFieldValue(id, value);
    onChange(value);
  };

  return (
    <Field label={label} key={id}>
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
              value.amount
            )}
          </AmountStyled>
          <TokenBadge
            symbol={TOKENS.honey.symb}
            address={TOKENS.honey.address}
            networkType="private"
          />
        </LineStyled>
      )}
    </Field>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
