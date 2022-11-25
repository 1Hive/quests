/* eslint-disable no-unused-vars */
export enum TransactionStatus {
  Confirmed = 'TX_STATUS_CONFIRMED',
  Failed = 'TX_STATUS_FAILED',
  Pending = 'TX_STATUS_PENDING',
  SignatureFailed = 'TX_STATUS_SIGNATURE_FAILED',
  Signed = 'TX_STATUS_SIGNED',
  WaitingForSignature = 'TX_WAITING_FOR_SIGNATURE',
}
