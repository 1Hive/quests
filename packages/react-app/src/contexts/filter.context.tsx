import React, { createContext, useContext, useState } from 'react';
import { FilterModel } from 'src/models/filter.model';
import { DEFAULT_FILTER } from '../constants';

type FilterContextModel = {
  filter: FilterModel;
  setFilter: (_filter: FilterModel) => void;
  refreshed: number;
  triggerRefresh: () => void;
  isFilterShown: boolean;
  toggleFilter: (_shown?: boolean) => void;
};

const FilterContext = createContext<FilterContextModel | undefined>(undefined);
export const useFilterContext = () => useContext(FilterContext)!;

type Props = {
  children: React.ReactNode;
};
export const FilterContextProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState<FilterModel>(DEFAULT_FILTER);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isFilterShown, setIsFilterShown] = useState(false); // Only for mobile view

  const toggleFilter = (shown?: boolean) => {
    setIsFilterShown(shown ?? !isFilterShown);
  };

  const triggerRefresh = () => {
    setRefreshCounter(refreshCounter + 1);
  };

  return (
    <FilterContext.Provider
      value={{
        filter,
        setFilter,
        triggerRefresh,
        refreshed: refreshCounter,
        isFilterShown,
        toggleFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
