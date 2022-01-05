/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from 'react';
import { FilterModel } from 'src/models/filter.model';
import { DEFAULT_FILTER } from '../constants';

type FilterContextModel = {
  filter: FilterModel;
  setFilter: (filter: FilterModel) => void;
};

const FilterContext = createContext<FilterContextModel | undefined>(undefined);
export const useFilterContext = () => useContext(FilterContext)!;

type Props = {
  children: React.ReactNode;
};
export const FilterContextProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState<FilterModel>(DEFAULT_FILTER);

  return <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>;
};
