import { Field, IconClose, Tag, _AutoComplete as AutoComplete } from '@1hive/1hive-ui';
import { connect } from 'formik';
import { noop } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FaHashtag } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import QuestProvider from '../../../services/QuestService';
import { Outset } from '../Utils/spacer-util';

function TagFieldInput({
  id,
  label = '',
  placeholder = '',
  value = [],
  tagSuggestions = undefined,
  onChange = noop,
  onTagClick = noop,
  isEdit = false,
  isLoading = false,
  formik = null,
}) {
  const [searchTerm, setSearchTerm] = useState(null);
  const autoCompleteRef = useRef(null);

  tagSuggestions = tagSuggestions ?? QuestProvider.getTagSuggestions();

  const onTagAddition = (tag) => {
    if (!value.includes(tag)) {
      value = value.concat(tag);
      formik?.setFieldValue(id, value);
      onChange(value);
    }
  };

  const deleteTag = (i) => {
    value.splice(i, 1);
    value = value.slice(0);
    formik?.setFieldValue(id, value);
    onChange(value);
  };

  return (
    <Field label={label} key={id}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {isEdit && (
            <AutoComplete
              items={
                tagSuggestions?.filter(
                  (name) => searchTerm && name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1,
                ) ?? []
              }
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
                  // @ts-ignore
                  onClick={() => (isEdit ? deleteTag(i) : onTagClick(x))}
                  className="pointer"
                />
              </Outset>
            ))}
        </>
      )}
    </Field>
  );
}

TagFieldInput.propTypes = {
  id: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  tagSuggestions: PropTypes.array,
  value: PropTypes.array,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func,
  }),
};

export default connect(TagFieldInput);
