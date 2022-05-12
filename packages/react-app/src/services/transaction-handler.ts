import { ContractReceipt } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import { ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { TransactionModel } from 'src/models/transaction.model';
import { approveTokenAmount, fundQuest } from './quest.service';

export async function approveTokenTransaction(
  modalId: string,
  token: TokenModel,
  spender: string,
  message: string,
  walletAddress: string,
  setTransaction: Dispatch<SetStateAction<TransactionModel | undefined>>,
) {
  setTransaction({
    modalId,
    estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
    message,
    status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
    type: 'TokenApproval',
  });
  let approveTxReceipt: ContractReceipt | null;
  try {
    approveTxReceipt = await approveTokenAmount(walletAddress, spender, token, (txHash) => {
      setTransaction(
        (oldTx) =>
          oldTx && {
            ...oldTx,
            hash: txHash,
            status: ENUM_TRANSACTION_STATUS.Pending,
          },
      );
    });
  } finally {
    setTransaction(
      (oldTx) =>
        oldTx && {
          ...oldTx,
          status: approveTxReceipt?.status
            ? ENUM_TRANSACTION_STATUS.Confirmed
            : ENUM_TRANSACTION_STATUS.Failed,
        },
    );
  }

  if (!approveTxReceipt?.status) {
    throw new Error(
      `Failed to approve token allowance : ${token.name} (${token.symbol}-${token.token})`,
    );
  }
}

export async function fundQuestTransaction(
  modalId: string,
  funds: TokenAmountModel,
  questAddress: string,
  message: string,
  walletAddress: string,
  setTransaction: Dispatch<SetStateAction<TransactionModel | undefined>>,
) {
  setTransaction({
    modalId,
    estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
    message,
    status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
    type: 'QuestFund',
    args: { questAddress },
  });
  const txReceipt = await fundQuest(walletAddress, questAddress, funds, (txHash) => {
    setTransaction(
      (oldTx) =>
        oldTx && {
          ...oldTx,
          hash: txHash,
          status: ENUM_TRANSACTION_STATUS.Pending,
        },
    );
  });
  setTransaction(
    (oldTx) =>
      oldTx && {
        ...oldTx,
        status: txReceipt?.status
          ? ENUM_TRANSACTION_STATUS.Confirmed
          : ENUM_TRANSACTION_STATUS.Failed,
      },
  );

  if (!txReceipt) {
    throw new Error('Failed to fund quest');
  }
}
