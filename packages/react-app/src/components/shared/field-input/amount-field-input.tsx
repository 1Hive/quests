import { DropDown, Field, GU, TextInput, TokenBadge } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { toNumber } from 'lodash';
import { noop } from 'lodash-es';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { TokenAmount } from 'src/models/amount';
import styled from 'styled-components';
import { TOKENS } from '../../../constants';

const currencyOptions = Object.values(TOKENS).map((c) => c.symb);

// #region StyledComponents

const LineStyled = styled.div`
  display: flex;
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
  value = { amount: 0, token: TOKENS.honey },
  onChange = noop,
  wide = false,
  formik,
}: Props) {
  if (value?.amount === undefined) value.amount = 0;
  if (value?.token === undefined) value.token = TOKENS.honey;
  const [amount, setAmount] = useState(value.amount);
  const [token, setToken] = useState(value.token);

  const onAmountChange = (e: any) => {
    setAmount(e.target.value);
    value = { ...value, amount: toNumber(amount) };
    formik?.setFieldValue(id, value);
    onChange(value);
  };

  const onTokenChange = (index: number) => {
    setToken(Object.values(TOKENS)[index]);
    value = { ...value, token };
    formik?.setFieldValue(id, value);
    onChange(value);
  };

  let content;
  if (isEdit)
    content = (
      <>
        <TextInput
          id={id}
          wide={wide}
          onChange={onAmountChange}
          placeHolder={placeHolder}
          type="number"
          value={amount}
        />
        <DropDown
          items={currencyOptions}
          selected={currencyOptions.indexOf(token.symb)}
          onChange={onTokenChange}
          renderLabel={({ selectedLabel }: any) => {
            const crypto = Object.values(TOKENS).find((x) => x.symb === selectedLabel);
            return crypto ? `${crypto.symb} - ${crypto.name}` : selectedLabel;
          }}
          wide={wide}
        />
      </>
    );
  else
    content = isLoading ? (
      <Skeleton />
    ) : (
      <LineStyled>
        <AmountStyled>{value.amount}</AmountStyled>
        <TokenBadge symbol={value.token.symb} address={value.token.address} networkType="private" />
      </LineStyled>
    );
  return (
    <Field label={label} key={id}>
      {content}
    </Field>
  );
}

// @ts-ignore
const AmountFieldInputFormik = connect(AmountFieldInput);

export default AmountFieldInput;
export { AmountFieldInputFormik };
