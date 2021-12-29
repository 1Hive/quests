import { Field, useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { CSSProperties, ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { dateFormat } from '../../../utils/date.utils';
import HelpIcon from './help-icon';
// #region StyledComponents
const InputStyled = styled.input`
  background-color: ${({ background }: any) => background};
  border: none;
`;

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;

// #endregion

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  value?: number;
  css?: CSSProperties;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  compact?: boolean;
};

export default function DateFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  value = Date.now(),
  onChange = noop,
  css,
  tooltip,
  tooltipDetail,
  compact = false,
}: Props) {
  const theme = useTheme();

  if (isLoading)
    return (
      <FieldStyled label={label} key={id} compact={compact}>
        <Skeleton />
      </FieldStyled>
    );

  const valFormat = dateFormat(value, 'iso');

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.currentTarget) {
      onChange(e);
    }
  };

  const loadableContent = isEdit ? (
    <InputStyled
      id={id}
      type="date"
      defaultValue={valFormat}
      onChange={handleChange}
      style={css}
      // @ts-ignore
      background={theme.surface}
    />
  ) : (
    <span>{new Date(value).toDateString()}</span>
  );
  return label ? (
    <Field
      label={
        <>
          {label}
          {tooltip && <HelpIcon tooltip={tooltip} tooltipDetail={tooltipDetail} />}
        </>
      }
      key={id}
    >
      {loadableContent}
    </Field>
  ) : (
    loadableContent
  );
}
