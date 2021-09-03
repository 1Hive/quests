import PropTypes from 'prop-types';
import React from 'react';
import { DropDown } from '@1hive/1hive-ui';

function Filters({ filters }) {
  return (
    <div>
      <DropDown
        items={filters.host.items}
        selected={filters.host.filter}
        onChange={filters.host.onChange}
      />
    </div>
  );
}

Filters.propTypes = {
  filters: PropTypes.shape({
    host: PropTypes.shape({
      filter: PropTypes.number,
      items: PropTypes.array,
      onChange: PropTypes.func,
    }),
  }),
};

export default Filters;
