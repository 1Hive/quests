import { IconClose, Tag, _AutoComplete as AutoComplete } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import React, { ReactNode, useRef, useState } from 'react';
import { FaHashtag } from 'react-icons/fa';
import { Outset } from '../utils/spacer-util';
import { FieldInput } from './field-input';

type Props = {
  id: string;
  isEdit?: boolean;
  isLoading?: boolean;
  label?: string;
  onChange?: Function;
  onTagClick?: Function;
  placeholder?: string;
  tagSuggestions?: string[];
  value?: string[];
  formik?: any;
  tooltip?: ReactNode;
  compact?: boolean;
};

function TagFieldInput({
  id,
  label,
  placeholder = '',
  value = [],
  tagSuggestions = undefined,
  onChange = noop,
  onTagClick = noop,
  isEdit = false,
  isLoading = false,
  formik,
  tooltip,
  compact = false,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>();
  const autoCompleteRef: React.Ref<any> = useRef(null);

  tagSuggestions = (tagSuggestions ?? [])
    // .concat(QuestService.getTagSuggestions())
    .filter((name) => searchTerm && name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);

  if (!tagSuggestions.length && searchTerm) tagSuggestions.push(searchTerm);

  const onTagAddition = (tag: string) => {
    if (!value.includes(tag)) {
      value = value.concat(tag);
      formik?.setFieldValue(id, value);
      if (autoCompleteRef?.current) autoCompleteRef.current.value = null;
      setSearchTerm(undefined);
      onChange(value);
    }
  };

  const deleteTag = (i: number) => {
    value.splice(i, 1);
    value = value.slice(0);
    formik?.setFieldValue(id, value);
    onChange(value);
  };

  return (
    <FieldInput id={id} label={label} tooltip={tooltip} compact={compact} isLoading={isLoading}>
      <>
        {isEdit && (
          <AutoComplete
            items={tagSuggestions}
            onChange={setSearchTerm}
            onSelect={onTagAddition}
            ref={autoCompleteRef}
            placeholder={placeholder}
            wide
          />
        )}
        {value &&
          value.map((x, i) => (
            <Outset gu4 inline key={x}>
              <Tag
                label={x}
                icon={isEdit ? <IconClose /> : <FaHashtag />}
                onClick={() => (isEdit ? deleteTag(i) : onTagClick(x))}
                className="pointer"
              />
            </Outset>
          ))}
      </>
    </FieldInput>
  );
}

const TagFieldInputFormik = connect(TagFieldInput);

export default TagFieldInput;
export { TagFieldInputFormik };
