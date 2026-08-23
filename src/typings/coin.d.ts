export interface CoinBalanceResponse {
  userId: number;
  fullName: string;
  username: string;
  balance: number;
}

export interface CoinTransactionItem {
  id: number;
  amount: number;
  balanceAfter: number;
  reason?: string;
  createdBy?: string;
  createdAt: string;
}
