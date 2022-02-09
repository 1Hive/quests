import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_PAGE } from 'src/constants';

export type PageContextModel = {
  page: string;
  setPage: (_page: string) => void;
};

const PageContext = createContext<PageContextModel | undefined>(undefined);
export const usePageContext = () => useContext(PageContext)!;

type Props = {
  children: React.ReactNode;
};
export const PageContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState(DEFAULT_PAGE);

  return <PageContext.Provider value={{ page, setPage }}>{children}</PageContext.Provider>;
};
