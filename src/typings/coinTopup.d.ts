export type CoinTopupStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface CoinTopupResponse {
  id: number;
  studentId: number;
  studentName?: string;
  username?: string;
  amountVnd: number;
  coinAmount: number;
  paymentCode: string;
  status: CoinTopupStatus;
  confirmedAt?: string;
  note?: string;
  createdAt: string;
  qrPayload?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}
