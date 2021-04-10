import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Field, TextInput, TokenBadge, DropDown, GU } from '@1hive/1hive-ui';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { connect } from 'formik';
import { toNumber } from 'lodash';
import { CRYPTOS } from '../../../constants';
import { emptyFunc } from '../../../utils/class-util';

const currencyOptions = Object.values(CRYPTOS).map((c) => c.symb);

// #region StyledComponents

const LineStyled = styled.div`
  display: flex;
`;
const AmountStyled = styled.div`
  margin-top: 2px;
  margin-right: ${GU}px;
`;

// #endregion
function AmountFieldInput({
  id,
  isEdit = true,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = { amount: 0, token: CRYPTOS.questgold },
  onChange = emptyFunc,
  wide = false,
  formik,
}) {
  if (value?.amount === undefined) value.amount = 0;
  if (value?.token === undefined) value.token = CRYPTOS.questgold;
  const [amount, setAmount] = useState(value.amount);
  const [token, setToken] = useState(value.token);

  const onAmountChange = (e) => {
    setAmount(e.target.value);
    value = { ...value, amount: toNumber(amount) };
    formik.setFieldValue(id, value);
    onChange(value);
  };

  const onTokenChange = (index) => {
    setToken(Object.values(CRYPTOS)[index]);
    value = { ...value, token };
    formik.setFieldValue(id, value);
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
          renderLabel={({ selectedLabel }) => {
            const crypto = Object.values(CRYPTOS).find((x) => x.symb === selectedLabel);
            return crypto ? `${crypto.symb} - ${crypto.name}` : selectedLabel;
          }}
          wide
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

AmountFieldInput.propTypes = {
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func,
  }),
  id: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeHolder: PropTypes.string,
  value: PropTypes.shape({
    amount: PropTypes.number,
    token: PropTypes.shape({
      address: PropTypes.string,
      name: PropTypes.string,
      symb: PropTypes.string,
    }),
  }),
  wide: PropTypes.bool,
};

// @ts-ignore
export default connect(AmountFieldInput);
