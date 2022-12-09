/* eslint-disable no-unused-vars */
export enum QuestStatus {
  All = 'All',
  Draft = 'Draft', // Not yet saved
  Active = 'Active', // Contract created
  // Played= 'Played', // At least one active claim
  Expired = 'Expired', // When expireTime is past
  Archived = 'Archived', // When no more funds
}
