import { useTheme } from '@1hive/1hive-ui';
import { noop } from 'lodash-es';
import { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GUpx } from 'src/utils/css.util';
import styled from 'styled-components';
import { FieldInput } from './field-input';

/**
 * Src : https://www.w3schools.com/howto/howto_css_custom_checkbox.asp
 */

// #region StyledComponents

const CheckboxWrapperStyled = styled.div`
  display: block;
  position: relative;
  margin: ${GUpx()};
  padding-left: ${GUpx(3)};
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  /* Hide the browser's default checkbox */
  & input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    height: 16px;
    width: 16px;
    margin: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: ${(props: any) => props.theme.surfacePressed};
    border: solid 1px ${(props: any) => props.theme.border};
    pointer-events: none;
    border-radius: 2px;
  }

  /* On mouse-over, add a grey background color */
  &:hover input ~ .checkmark {
    background-color: ${(props: any) => props.theme.surfacePressed};
  }

  /* When the checkbox is checked, add a blue background */
  & input:checked ~ .checkmark {
    background-color: ${(props: any) => props.theme.surfacePressed};
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  & input:checked ~ .checkmark:after {
    display: block;
  }
  /* Show the checkmark when checked */
  & input:focus ~ .checkmark {
    border: 1px solid ${(props: any) => props.theme.focus};
  }
  /* Show the checkmark when checked */
  & input:active ~ .checkmark {
    border: 1px solid ${(props: any) => props.theme.contentSecondary};
  }

  /* Style the checkmark/indicator */
  & .checkmark:after {
    left: 5px;
    top: 1px;
    width: 4px;
    height: 10px;
    border: solid ${(props: any) => props.theme.focus};
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    background-color: ${(props: any) => props.theme.surfacePressed};
  }
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
  const theme = useTheme();
  return (
    <FieldInput
      id={id}
      label={label}
      tooltip={tooltip}
      tooltipDetail={tooltipDetail}
      compact={compact}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <CheckboxWrapperStyled theme={theme}>
          <input
            type="checkbox"
            id={id}
            name={id}
            value={id}
            checked={value}
            disabled={disabled || !isEdit}
            onChange={(e) => onChange(e)}
          />
          <span className="checkmark" />
        </CheckboxWrapperStyled>
      )}
    </FieldInput>
  );
}
