import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext<any>(undefined);
export const useTransactionContext = () => useContext(TransactionContext);

type Props = {
  children: React.ReactNode;
};
export const TransactionContextProvider = ({ children }: Props) => {
  const [transaction, setTansaction] = useState();

  return (
    <TransactionContext.Provider value={{ transaction, setTansaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
