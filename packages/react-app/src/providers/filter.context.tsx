import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_FILTER } from '../constants';

const FilterContext = createContext<any>(undefined);
export const useFilterContext = () => useContext(FilterContext);

type Props = {
  children: React.ReactNode;
};
export const FilterContextProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <FilterContext.Provider value={{ filter, setFilter } as any}>{children}</FilterContext.Provider>
  );
};
