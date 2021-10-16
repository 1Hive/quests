import { Field, useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { CSSProperties } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { dateFormat } from '../../../utils/date-utils';

const InputStyled = styled.input`
  background-color: ${({ background }: any) => background};
  border: none;
`;

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  value?: number;
  css?: CSSProperties;
};

export default function DateFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  value = Date.now(),
  onChange = noop,
  css,
}: Props) {
  const theme = useTheme();

  if (isLoading)
    return (
      <Field label={label} key={id}>
        <Skeleton />
      </Field>
    );

  const valFormat = dateFormat(value, 'iso');

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.currentTarget) {
      const timeValue = new Date(e.currentTarget.value).getTime();
      onChange({ ...e, value: timeValue });
    }
  };

  const loadableContent = isEdit ? (
    <InputStyled
      id={id}
      type="date"
      value={valFormat}
      onChange={handleChange}
      style={css}
      // @ts-ignore
      background={theme.surface}
    />
  ) : (
    <span>{new Date(value).toDateString()}</span>
  );
  return label ? (
    <Field label={label} key={id}>
      {loadableContent}
    </Field>
  ) : (
    loadableContent
  );
}
