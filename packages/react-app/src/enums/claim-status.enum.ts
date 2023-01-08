/* eslint-disable no-unused-vars */
export enum ClaimStatus {
  None = 'None',
  Scheduled = 'In review',
  AvailableToExecute = 'Available to execute',
  Challenged = 'Challenged',
  // Final states
  Approved = 'Approved',
  Cancelled = 'Cancelled',
  Executed = 'Executed',
  Vetoed = 'Vetoed',
  Rejected = 'Rejected',
}
