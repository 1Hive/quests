import React, { createContext, useContext, useState } from 'react';
import { Filter } from 'src/models/filter';
import { defaultFilter } from '../constants';

const FilterContext = createContext<Filter | undefined>(undefined);
export const useFilterContext = () => useContext(FilterContext);

type Props = {
  children: React.ReactNode;
};
export default ({ children }: Props) => {
  const [filter, setFilter] = useState(defaultFilter);

  return (
    <FilterContext.Provider value={{ filter, setFilter } as any}>{children}</FilterContext.Provider>
  );
};
