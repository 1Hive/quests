import React from 'react'
import { IdentityBadge as Badge } from '@1hive/1hive-ui'

import { getNetworkType } from '../utils/web3-utils'

const IdentityBadge = React.memo(function IdentityBadge({ entity, ...props }) {
  const networkType = getNetworkType()

  return (
    <Badge
      entity={entity}
      networkType={networkType === 'xdai' ? 'private' : networkType}
      {...props}
    />
  )
})

export default IdentityBadge
