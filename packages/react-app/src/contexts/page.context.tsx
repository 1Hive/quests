import React, { createContext, useContext, useState } from 'react';

export type PageContextModel = {
  page: string | undefined;
  setPage: (_page: string | undefined) => void;
};

const PageContext = createContext<PageContextModel | undefined>(undefined);
export const usePageContext = () => useContext(PageContext)!;

type Props = {
  children: React.ReactNode;
};
export const PageContextProvider = ({ children }: Props) => {
  const [page, setPage] = useState<string | undefined>(undefined);

  return <PageContext.Provider value={{ page, setPage }}>{children}</PageContext.Provider>;
};
