import { Field, TextInput } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import HelpIcon from './help-icon';
// #region StyledComponents

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin:0' : '')}
`;

// #endregion

type Props = {
  id?: string;
  isEdit?: boolean;
  isLoading?: boolean;
  isRequired?: boolean;
  label?: string;
  max?: number;
  min?: number;
  onChange?: Function;
  placeHolder?: string;
  value?: number;
  wide?: boolean;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  suffix?: string;
  compact?: boolean;
};

export default function NumberFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  placeHolder = '',
  value = 0,
  onChange = noop,
  wide = false,
  max,
  min,
  isRequired = false,
  tooltip,
  tooltipDetail,
  suffix = '',
  compact = false,
}: Props) {
  let content;
  if (isEdit)
    content = (
      <TextInput
        id={id}
        type="number"
        wide={wide}
        onChange={onChange}
        placeHolder={placeHolder}
        max={max}
        min={min}
        isRequired={isRequired}
      />
    );
  else content = value + suffix;
  return (
    <FieldStyled
      label={
        <>
          {label}
          {tooltip && <HelpIcon tooltip={tooltip} tooltipDetail={tooltipDetail} />}
        </>
      }
      key={id}
      compact={compact}
    >
      {isLoading ? <Skeleton /> : content}
    </FieldStyled>
  );
}
