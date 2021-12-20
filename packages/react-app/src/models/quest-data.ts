export type QuestData = {
  // User defined
  title?: string;
  description?: string;
  expireTimeMs: number;
  fallbackAddress?: string;

  // Computed
  address?: string;
  rewardTokenAddress?: string;
  detailsRefIpfs?: string;
  creatorAddress?: string;
};
