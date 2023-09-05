import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { Button, IconPlus, IconCross } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { BaseSyntheticEvent, useState } from 'react';
import { FieldInput } from './field-input';
import { AddressFieldInput } from './address-field-input';

// #region StyledComponents

const AddressListWrapperStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  max-width: 425px;
  Button {
    margin-bottom: ${GUpx(1)};
    min-height: 45px;
    border: none;
    background: transparent;
  }
`;
const AddWrapperStyled = styled.div`
  margin-left: ${GUpx(0.5)};
`;

// #endregion

type Props = {
  id: string;
  label: string;
  value: string[] | undefined;
  onChange: Function;
  onBlur?: Function;
  error?: string | false;
  touched?: boolean | undefined;
  isEdit?: boolean;
  isFormik?: boolean;
};

export default function AddressListFieldInput({
  id,
  label,
  value = [],
  onChange = noop,
  onBlur = noop,
  error,
  touched,
  isEdit = false,
  isFormik,
}: Props) {
  const [valueState, setValueState] = useState<{ key: string; value: string }[]>(
    value
      ? value.map((x) => ({ key: Math.random().toString(), value: x }))
      : [{ key: Math.random().toString(), value: '' }],
  );

  const addPlayerToWhitelist = () => {
    setValueState([...valueState, { key: Math.random().toString(), value: '' }]);
    onChange(isFormik ? createEventWithValue() : valueState.map((x) => x.value));
  };

  const removePlayerFromWhitelist = (indexToRemove: number) => {
    setValueState([...valueState.filter((_, index) => index !== indexToRemove)]);
    onChange(isFormik ? createEventWithValue() : valueState.map((x) => x.value));
  };

  const handleChange = (v: string, i: number) => {
    const newList = [...valueState];
    newList[i].value = v;
    setValueState(newList);
    if (isFormik) {
      onChange(createEventWithValue());
    } else {
      onChange(valueState.map((x) => x.value));
    }
  };

  const createEventWithValue = () => {
    const ev = {
      target: {
        value: valueState.map((x) => x.value),
        id,
      },
    } as BaseSyntheticEvent;
    return ev;
  };

  return (
    <FieldInput
      id={id}
      label={label}
      error={touched && error}
      direction="column"
      align="flex-start"
      wide
    >
      {valueState.map((playerAddress, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <AddressListWrapperStyled key={playerAddress.key}>
          <AddressFieldInput
            id={`${id}[${i}]`}
            isEdit={isEdit}
            value={playerAddress.value}
            onChange={(e: BaseSyntheticEvent) => handleChange(e.target.value, i)}
            onBlur={onBlur}
            wide
          />
          {isEdit && (
            <Button
              icon={<IconCross />}
              onClick={() => removePlayerFromWhitelist(i)}
              disabled={i === 0}
            />
          )}
        </AddressListWrapperStyled>
      ))}

      {isEdit && (
        <AddWrapperStyled>
          <Button icon={<IconPlus />} onClick={() => addPlayerToWhitelist()} />
        </AddWrapperStyled>
      )}
    </FieldInput>
  );
}
