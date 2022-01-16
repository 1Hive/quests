import { Field, Checkbox } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { IconTooltip } from './icon-tooltip';

// #region StyledComponents

const FieldStyled = styled(Field)`
  ${({ compact }: any) => (compact ? 'margin : 0' : '')}
`;

// #endregion

type Props = {
  id?: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  value?: boolean;
  tooltip?: string;
  tooltipDetail?: ReactNode;
  compact?: boolean;
  disabled?: boolean;
};

export default function CheckboxFieldInput({
  id,
  isEdit = false,
  isLoading = false,
  label = '',
  value = false,
  tooltip,
  tooltipDetail,
  compact = false,
  onChange = noop,
  disabled = false,
}: Props) {
  return (
    <FieldStyled
      label={
        <>
          <span title={tooltip}>{label}</span>
          {tooltip && <IconTooltip tooltip={tooltip} tooltipDetail={tooltipDetail} />}
        </>
      }
      key={id}
      compact={compact}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <Checkbox
          checked={value}
          disabled={disabled || !isEdit}
          onChange={(checked: boolean) =>
            onChange({
              persist: () => {},
              target: {
                type: 'change',
                id,
                value: checked,
              },
            })
          }
        />
      )}
    </FieldStyled>
  );
}
