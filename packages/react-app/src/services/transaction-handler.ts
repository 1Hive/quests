import { ContractReceipt } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import { isDevelopement } from 'src/components/utils/debug-util';
import { ENUM, ENUM_TRANSACTION_STATUS } from 'src/constants';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { TransactionModel } from 'src/models/transaction.model';
import { approveTokenAmount, fundQuest, getAllowanceOf } from './quest.service';

export async function approveTokenTransaction(
  modalId: string,
  token: TokenModel,
  spender: string,
  message: string,
  walletAddress: string,
  setTransaction: Dispatch<SetStateAction<TransactionModel | undefined>>,
) {
  const allowance = await getAllowanceOf(walletAddress, token, spender);

  let approveTxReceipt: ContractReceipt | null = null;
  if (!allowance.isZero()) {
    if (isDevelopement()) {
      return; // Skip only if development mode (having permanent allowance is a security risk see https://kalis.me/unlimited-erc20-allowances/#:~:text=several%20such%20exploits.-,bug%20exploits,-In%20early%202020)
    }
    let txPayload = {
      modalId,
      estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
      message: 'Revoking already existing approval',
      status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
      type: 'TokenApproval',
    } as TransactionModel;
    // Reset approval to 0 before approving again
    setTransaction(txPayload);
    approveTxReceipt = await approveTokenAmount(
      walletAddress,
      spender,
      { ...token, amount: '0' },
      (txHash) => {
        txPayload = { ...txPayload, hash: txHash };
        setTransaction({
          ...txPayload,
          status: ENUM_TRANSACTION_STATUS.Pending,
        });
      },
    );

    if (!approveTxReceipt?.status) {
      setTransaction({
        ...txPayload,
        status: ENUM_TRANSACTION_STATUS.Failed,
      });
      throw new Error(
        `Failed to revoke existing allowance : ${token.name} (${token.symbol}-${token.token})`,
      );
    }
  }

  let txPayload = {
    modalId,
    estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.TokenAproval,
    message,
    status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
    type: 'TokenApproval',
  } as TransactionModel;
  setTransaction(txPayload);
  try {
    approveTxReceipt = await approveTokenAmount(walletAddress, spender, token, (txHash) => {
      txPayload = { ...txPayload, hash: txHash };
      setTransaction({
        ...txPayload,
        status: ENUM_TRANSACTION_STATUS.Pending,
      });
    });
  } finally {
    setTransaction({
      ...txPayload,
      status: approveTxReceipt?.status
        ? ENUM_TRANSACTION_STATUS.Confirmed
        : ENUM_TRANSACTION_STATUS.Failed,
    });
  }

  if (!approveTxReceipt?.status) {
    setTransaction({
      ...txPayload,
      status: ENUM_TRANSACTION_STATUS.Failed,
    });
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
  let txPayload = {
    modalId,
    estimatedDuration: ENUM.ENUM_ESTIMATED_TX_TIME_MS.QuestFunding,
    message,
    status: ENUM_TRANSACTION_STATUS.WaitingForSignature,
    type: 'QuestFund',
    args: { questAddress },
  } as TransactionModel;
  setTransaction(txPayload);
  const txReceipt = await fundQuest(walletAddress, questAddress, funds, (txHash) => {
    txPayload = { ...txPayload, hash: txHash };
    setTransaction({
      ...txPayload,
      status: ENUM_TRANSACTION_STATUS.Pending,
    });
  });
  setTransaction({
    ...txPayload,
    status: txReceipt?.status ? ENUM_TRANSACTION_STATUS.Confirmed : ENUM_TRANSACTION_STATUS.Failed,
  });

  if (!txReceipt) {
    setTransaction({
      ...txPayload,
      status: ENUM_TRANSACTION_STATUS.Failed,
    });
    throw new Error('Failed to fund quest');
  }
}
