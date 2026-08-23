import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type { CoinTopupResponse } from '@/typings/coinTopup';

/** POST /coin-topups — tạo yêu cầu nạp Xu bằng chuyển khoản (1.000đ = 1 Xu), trả về QR ngay. */
export async function createCoinTopup(amountVnd: number) {
  const res = await request<ApiResponse<CoinTopupResponse>>('/api/v1/coin-topups', {
    method: 'POST',
    data: { amountVnd },
  });
  return res.data;
}

/** GET /coin-topups/my?studentId= — lịch sử yêu cầu nạp Xu của mình/con. */
export async function fetchMyCoinTopups(studentId?: number) {
  const res = await request<ApiResponse<CoinTopupResponse[]>>('/api/v1/coin-topups/my', {
    method: 'GET',
    params: { studentId },
  });
  return res.data;
}
