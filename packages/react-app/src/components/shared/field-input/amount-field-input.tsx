import { Field, GU, TextInput, TokenBadge } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_AMOUNT } from 'src/constants';
import { TokenAmount } from 'src/models/token-amount';
import { getNetwork } from 'src/networks';
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
  const { defaultToken } = getNetwork();
  const [amount, setAmount] = useState(value.amount);
  useEffect(() => {
    setAmount(value.amount);
  }, [value.amount]);

  if (!value.token) value.token = defaultToken;

  const onAmountChange = (e: any) => {
    const newValue = +e.target.value;
    setAmount(newValue);
    value = { ...value, amount: newValue };
    if (formik) formik.setFieldValue(id, value);
    else onChange(value);
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
              amount
            )}
          </AmountStyled>
          <TokenBadge
            symbol={value.token!.symb}
            address={value.token!.address}
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
