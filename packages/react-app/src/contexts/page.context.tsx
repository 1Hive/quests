import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_PAGE } from 'src/constants';

const PageContext = createContext<any>(DEFAULT_PAGE);
export const usePageContext = () => useContext(PageContext);

type Props = {
  children: React.ReactNode;
};
export const PageContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState();

  return <PageContext.Provider value={{ page, setPage }}>{children}</PageContext.Provider>;
};
