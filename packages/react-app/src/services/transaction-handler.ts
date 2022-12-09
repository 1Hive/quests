import { Dispatch, SetStateAction } from 'react';
import { isDevelopement } from 'src/components/utils/debug-util';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TokenAmountModel } from 'src/models/token-amount.model';
import { TokenModel } from 'src/models/token.model';
import { TransactionModel } from 'src/models/transaction.model';
import { Logger } from 'src/utils/logger';
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

  let success = false;
  // (having permanent allowance is a security risk see https://kalis.me/unlimited-erc20-allowances/#:~:text=several%20such%20exploits.-,bug%20exploits,-In%20early%202020)
  if (allowance.eq(token.amount) || (allowance.gt(token.amount) && isDevelopement())) {
    Logger.info(`${token.symbol} allowance is already ${token.amount}`);
    return; // Skip only if development mode or allowance is already the required amount
  }

  if (!allowance.isZero()) {
    let revokeTxPayload = {
      modalId,
      message: 'Revoking already existing approval',
      status: TransactionStatus.WaitingForSignature,
      type: 'TokenApproval',
    } as TransactionModel;
    // Reset approval to 0 before approving again
    setTransaction(revokeTxPayload);
    success = await approveTokenAmount(
      walletAddress,
      spender,
      { ...token, amount: '0' },
      (txHash) => {
        revokeTxPayload = { ...revokeTxPayload, hash: txHash };
        setTransaction({
          ...revokeTxPayload,
          status: TransactionStatus.Pending,
        });
      },
    );

    if (!success) {
      setTransaction({
        ...revokeTxPayload,
        status: TransactionStatus.Failed,
      });
      throw new Error(
        `Failed to revoke existing allowance : ${token.name} (${token.symbol}-${token.token})`,
      );
    }
  }

  let txPayload = {
    modalId,
    message,
    status: TransactionStatus.WaitingForSignature,
    type: 'TokenApproval',
  } as TransactionModel;
  setTransaction(txPayload);
  try {
    success = await approveTokenAmount(walletAddress, spender, token, (txHash) => {
      txPayload = { ...txPayload, hash: txHash };
      setTransaction({
        ...txPayload,
        status: TransactionStatus.Pending,
      });
    });
  } finally {
    setTransaction({
      ...txPayload,
      status: success ? TransactionStatus.Confirmed : TransactionStatus.Failed,
    });
  }

  if (!success) {
    setTransaction({
      ...txPayload,
      status: TransactionStatus.Failed,
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
    message,
    status: TransactionStatus.WaitingForSignature,
    type: 'QuestFund',
    args: { questAddress },
  } as TransactionModel;
  setTransaction(txPayload);
  const txReceipt = await fundQuest(walletAddress, questAddress, funds, (txHash) => {
    txPayload = { ...txPayload, hash: txHash };
    setTransaction({
      ...txPayload,
      status: TransactionStatus.Pending,
    });
  });
  setTransaction({
    ...txPayload,
    status: txReceipt?.status ? TransactionStatus.Confirmed : TransactionStatus.Failed,
  });

  if (!txReceipt) {
    setTransaction({
      ...txPayload,
      status: TransactionStatus.Failed,
    });
    throw new Error('Failed to fund quest');
  }
}
