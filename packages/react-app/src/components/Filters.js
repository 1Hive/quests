import React from 'react'
import { DropDown } from '@1hive/1hive-ui'

function Filters({ filters }) {
  return (
    <div>
      <DropDown
        items={filters.host.items}
        selected={filters.host.filter}
        onChange={filters.host.onChange}
      />
    </div>
  )
}

export default Filters
