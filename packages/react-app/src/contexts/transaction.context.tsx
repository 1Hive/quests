import { uniqueId } from 'lodash';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { TransactionModel } from 'src/models/transaction.model';

type IdentifiableTransactionModel = TransactionModel & { id: string };

type TransactionContextModel = {
  getTransaction: (_id: string) => TransactionModel | undefined;
  transaction: IdentifiableTransactionModel | undefined;
  setTransaction: React.Dispatch<React.SetStateAction<IdentifiableTransactionModel | undefined>>;
  queueTransaction: (_newTransaction: TransactionModel) => string;
  clearCurrentTransaction: () => void;
};

const TransactionContext = createContext<TransactionContextModel | undefined>(undefined);
export const useTransactionContext = () => useContext(TransactionContext)!;

type Props = {
  children: React.ReactNode;
};
export const TransactionContextProvider = ({ children }: Props) => {
  const [transaction, setTransaction] = useState<IdentifiableTransactionModel | undefined>();
  const transactionListRef = useRef([] as IdentifiableTransactionModel[]);

  useEffect(() => {
    if (!transaction) {
      setTransaction(transactionListRef.current.pop());
    }
  }, [transaction]);

  const queueTransaction = (newTransaction: TransactionModel) => {
    const id = uniqueId();
    transactionListRef.current.push({ id, ...newTransaction });
    return id;
  };

  const getTransaction = (id: string) => transactionListRef.current.find((t) => t.id === id);

  return (
    <TransactionContext.Provider
      value={{
        getTransaction,
        transaction,
        setTransaction,
        queueTransaction,
        clearCurrentTransaction: () => setTransaction(undefined),
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
