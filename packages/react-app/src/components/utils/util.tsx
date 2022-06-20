import { ReactNode } from 'react';

type Props = {
  condition?: boolean;
  wrapper: (_children: ReactNode) => ReactNode;
  children: ReactNode;
};

export const ConditionalWrapper = ({ condition, wrapper, children }: Props) => (
  <>{condition ? wrapper(children) : children}</>
);
