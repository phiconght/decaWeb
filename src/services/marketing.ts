import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type { HomeMarketingResponse } from '@/typings/marketing';

/** GET /home/marketing — banner khuyến mãi + danh mục theo khối lớp (lọc từ
 * lớp học THẬT, đồng bộ với "Khám phá khóa học") + trust bar + testimonial. */
export async function fetchHomeMarketing() {
  const res = await request<ApiResponse<HomeMarketingResponse>>(
    '/api/v1/home/marketing',
    { method: 'GET' },
  );
  return res.data;
}
