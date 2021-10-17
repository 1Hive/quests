import React, { createContext, useContext, useState } from 'react';
import { defaultFilter } from '../constants';

const FilterContext = createContext(undefined);
export const useFilterContext = () => useContext(FilterContext);

type Props = {
  children: React.ReactNode;
};
const FilterContextProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState(defaultFilter);

  return (
    <FilterContext.Provider value={{ filter, setFilter } as any}>{children}</FilterContext.Provider>
  );
};

export default FilterContextProvider;
