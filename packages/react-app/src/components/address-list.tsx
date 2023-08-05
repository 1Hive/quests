import { GUpx } from 'src/utils/style.util';
import styled from 'styled-components';
import { Button, IconPlus, IconCross } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { QuestModel } from 'src/models/quest.model';
import React, { BaseSyntheticEvent } from 'react';
import { AddressFieldInput } from './field-input/address-field-input';

const PlayerWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  max-width: 425px;
  Button {
    margin-bottom: ${GUpx(1)};
    min-height: 45px;
    border: none;
  }
`;
const AddWrapperStyled = styled.div`
  display: flex;
`;

type Props = {
  id: string;
  label: string;
  values: string[] | undefined;
  onChange: Function;
  onBlur?: Function;
  error?: string | false;
  touched?: boolean | undefined;
  isEdit?: boolean;
  formikValues?: QuestModel;
  setValuesFormik?: (
    _values: React.SetStateAction<any>,
    _shouldValidate?: boolean | undefined,
  ) => void;
};

export default function AddressListFieldInput({
  id,
  label,
  values = [],
  onChange = noop,
  onBlur = noop,
  error,
  touched,
  isEdit = false,
  formikValues,
  setValuesFormik,
}: Props) {
  // const [addressList, setAddressList] = useState<string[]>(values);
  const addPlayerToWhitelist = () => {
    values!.push('');
    setValuesFormik?.(formikValues);
  };
  const removePlayerFromWhitelist = (index: number) => {
    values!.splice(index, 1);
    setValuesFormik?.(formikValues);
  };

  return (
    <>
      {formikValues ? (
        <>
          {values.map((player, i) => (
            <PlayerWrapperStyled>
              <AddressFieldInput
                id={`${id}[${i}]`}
                label={`${label} #${i + 1}`}
                isEdit={isEdit}
                value={player}
                onChange={onChange}
                onBlur={onBlur}
                wide
                error={touched && error && touched[i] && error[i]}
              />
              {isEdit && (
                <Button icon={<IconCross />} onClick={() => removePlayerFromWhitelist(i)} />
              )}
            </PlayerWrapperStyled>
          ))}

          {isEdit && (
            <AddWrapperStyled>
              <Button icon={<IconPlus />} label="Add" onClick={() => addPlayerToWhitelist()} />
            </AddWrapperStyled>
          )}
        </>
      ) : (
        <>
          {values.map((player, i) => (
            <PlayerWrapperStyled>
              <AddressFieldInput
                id={`${id}[${i}]`}
                label={`${label} #${i + 1}`}
                isEdit={isEdit}
                value={player}
                onChange={(event: BaseSyntheticEvent) => onChange(event.target.value, i)}
                wide
              />
              {isEdit && (
                <Button icon={<IconCross />} onClick={() => removePlayerFromWhitelist(i)} />
              )}
            </PlayerWrapperStyled>
          ))}

          {isEdit && (
            <AddWrapperStyled>
              <Button icon={<IconPlus />} label="Add" onClick={() => addPlayerToWhitelist()} />
            </AddWrapperStyled>
          )}
        </>
      )}
    </>
  );
}
