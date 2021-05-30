import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultFilter } from '../constants';

const FilterContext = createContext(null);
export const useFilterContext = () => useContext(FilterContext);

const FilterContextProvider = ({ children }) => {
  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    console.log(filter, 'filter');
  }, [filter]);

  return <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>;
};

export default FilterContextProvider;
