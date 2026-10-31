export type DashboardModel = {
  questCount: number;
  totalFunds: number;
  unpricedFunds: { symbol: string; amount: number }[];
};
