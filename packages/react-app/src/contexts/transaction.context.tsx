/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from 'react';
import { ENUM_TRANSACTION_STATUS } from 'src/constants';
import { TransactionModel } from 'src/models/transaction.model';

type TransactionContextModel = {
  newTransaction: TransactionModel | undefined;
  pushTransaction: (tx: TransactionModel) => void;
  updatedTransactionStatus: TransactionModel | undefined;
  updateTransactionStatus: (tx: TransactionModel) => void;
  updateLastTransactionStatus: (status: string) => void;
};

const TransactionContext = createContext<TransactionContextModel | undefined>(undefined);
export const useTransactionContext = () => useContext(TransactionContext)!;

type Props = {
  children: React.ReactNode;
};
export const TransactionContextProvider = ({ children }: Props) => {
  const [newTransaction, pushTransaction] = useState<TransactionModel>();
  const [updatedTransactionStatus, updateTransactionStatus] = useState<TransactionModel>();
  const updateLastTransactionStatus = (status: string) => {
    if (newTransaction) newTransaction.status = status;
    updateTransactionStatus(newTransaction);
  };
  return (
    <TransactionContext.Provider
      value={{
        newTransaction,
        pushTransaction,
        updatedTransactionStatus,
        updateTransactionStatus,
        updateLastTransactionStatus,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
