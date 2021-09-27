import { Field, useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import PropTypes from 'prop-types';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { dateFormat } from '../../../utils/date-utils';

const InputStyled = styled.input`
  background-color: ${({ background }) => background};
  border: none;
`;

export default function DateFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  value = Date.now(),
  // eslint-disable-next-line no-unused-vars
  onChange = noop,
  css = undefined,
}) {
  const theme = useTheme();

  if (isLoading)
    return (
      <Field label={label} key={id}>
        <Skeleton />
      </Field>
    );

  const valFormat = dateFormat(value, 'iso');

  const handleChange = (e) => {
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

DateFieldInput.propTypes = {
  id: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number,
};
