import { IdentityBadge as Badge } from '@1hive/1hive-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { getNetworkType } from '../../utils/web3-utils';

const IdentityBadge = React.memo(({ entity, ...props }) => {
  const networkType = getNetworkType();

  return (
    <Badge
      entity={entity}
      networkType={networkType === 'xdai' ? 'private' : networkType}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
});

IdentityBadge.propTypes = {
  entity: PropTypes.string,
};

export default IdentityBadge;
