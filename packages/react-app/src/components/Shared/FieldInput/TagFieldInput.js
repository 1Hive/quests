import PropTypes from 'prop-types';
import { Field, IconClose, Tag, _AutoComplete as AutoComplete } from '@1hive/1hive-ui';
import React, { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { FaHashtag } from 'react-icons/fa';
import { connect } from 'formik';
import { emptyFunc } from '../../../utils/class-util';
import { getTagSuggestions } from '../../../providers/QuestProvider';
import { Spacer4 } from '../Utils/Spacer';

function TagFieldInput({
  id,
  label = '',
  placeholder = '',
  value = [],
  tagSuggestions = undefined,
  onChange = emptyFunc,
  onTagClick = emptyFunc,
  isEdit = false,
  isLoading = false,
  formik,
}) {
  const [tags, setTags] = useState(value ?? []);
  const [searchTerm, setSearchTerm] = useState(null);
  const autoCompleteRef = useRef(null);

  const onTagAddition = (tag) => {
    if (!tags.includes(tag)) {
      value = tags.concat(tag);
      setTags(value);
      formik.setFieldValue(id, value);
      onChange(value);
    }
  };

  const deleteTag = (i) => {
    value = tags.slice(0);
    value.splice(i, 1);
    setTags(value);
    formik.setFieldValue(id, value);
    onChange(value);
  };

  tagSuggestions = tagSuggestions ?? getTagSuggestions();

  return (
    <Field label={label} key={id}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {isEdit && (
            <AutoComplete
              items={tagSuggestions?.filter(
                (name) => searchTerm && name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1,
              )}
              onChange={setSearchTerm}
              onSelect={onTagAddition}
              ref={autoCompleteRef}
              placeholder={placeholder}
              wide
            />
          )}
          {tags.map((x, i) => (
            <Spacer4 inline key={x}>
              <Tag
                label={x}
                icon={isEdit ? <IconClose /> : <FaHashtag />}
                // @ts-ignore
                onClick={() => (isEdit ? deleteTag(i) : onTagClick(x))}
                className="pointer"
              />
            </Spacer4>
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
