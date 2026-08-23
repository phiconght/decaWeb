import { request } from '@umijs/max';
import type { ApiResponse, FlatPageResponse } from '@/typings/common';
import type { CoinBalanceResponse, CoinTransactionItem } from '@/typings/coin';

/** GET /coins/my?studentId= — PARENT bắt buộc truyền, STUDENT tự scope nếu bỏ trống. */
export async function fetchMyCoinBalance(studentId?: number) {
  const res = await request<ApiResponse<CoinBalanceResponse>>('/api/v1/coins/my', {
    method: 'GET',
    params: { studentId },
  });
  return res.data;
}

export async function fetchMyCoinTransactions(
  studentId?: number,
  current = 1,
  pageSize = 20,
) {
  const res = await request<FlatPageResponse<CoinTransactionItem>>(
    '/api/v1/coins/my/transactions',
    { method: 'GET', params: { studentId, current, pageSize } },
  );
  return res.data;
}
