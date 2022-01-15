import { Field, useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { CSSProperties, ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { dateFormat } from '../../utils/date.utils';
import { IconTooltip } from './icon-tooltip';

// #region StyledComponents
const InputStyled = styled.input`
  background-color: ${({ background }: any) => background};
  pointer-events: all;
  border: none;
`;

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;
const FieldHeaderStyled = styled(Field)`
  pointer-events: none;
`;

const LabelStyled = styled.div`
  width: 16px;
  justify-content: center;
  margin-left: 8px;
  display: flex;
  pointer-events: all !important;
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
      background={theme.surface}
    />
  ) : (
    <span>{new Date(value).toDateString()}</span>
  );
  return label ? (
    <FieldHeaderStyled
      label={
        <>
          <span title={tooltip}>{label}</span>
          <LabelStyled>
            {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
          </LabelStyled>
        </>
      }
      key={id}
    >
      {loadableContent}
    </FieldHeaderStyled>
  ) : (
    loadableContent
  );
}
