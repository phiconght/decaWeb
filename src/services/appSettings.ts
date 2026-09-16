import { request } from '@umijs/max';
import type { AppSettings } from '@/typings/appSettings';
import type { ApiResponse } from '@/typings/common';

/** GET /app-settings — công khai, gọi 1 lần lúc mở app (xem app.tsx#getInitialState). */
export async function fetchAppSettings() {
  const res = await request<ApiResponse<AppSettings>>('/api/v1/app-settings', {
    method: 'GET',
    skipErrorHandler: true,
  });
  return res.data;
}
