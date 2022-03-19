import React, { createContext, useContext, useState } from 'react';
import { TransactionModel } from 'src/models/transaction.model';

type TransactionContextModel = {
  transaction: TransactionModel | undefined;
  setTransaction: React.Dispatch<React.SetStateAction<TransactionModel | undefined>>;
};

const TransactionContext = createContext<TransactionContextModel | undefined>(undefined);
export const useTransactionContext = () => useContext(TransactionContext)!;

type Props = {
  children: React.ReactNode;
};
export const TransactionContextProvider = ({ children }: Props) => {
  const [transaction, setTransaction] = useState<TransactionModel | undefined>();

  return (
    <TransactionContext.Provider
      value={{
        transaction,
        setTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
