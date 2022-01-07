import { IdentityBadge as Badge } from '@1hive/1hive-ui';
import React from 'react';
import { getNetworkType } from '../utils/web3.utils';

type Props = {
  entity: string;
  compact?: boolean;
  children?: React.ReactNode;
  badgeOnly?: boolean;
  connectedAccount?: boolean;
  label?: string;
  labelStyle?: string;
  popoverTitle?: React.ReactNode;
  popoverAction?: any;
  shorten?: boolean;
};

const IdentityBadge = React.memo(({ entity, ...props }: Props) => {
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

export default IdentityBadge;
