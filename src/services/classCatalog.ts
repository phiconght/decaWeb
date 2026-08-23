import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type { ClassCatalogItem, EnrollResponse } from '@/typings/class';

/** GET /classes/catalog — danh mục toàn hệ thống (đồng bộ với Mobile). */
export async function fetchClassCatalog() {
  const res = await request<ApiResponse<ClassCatalogItem[]>>(
    '/api/v1/classes/catalog',
    { method: 'GET' },
  );
  return res.data;
}

/** POST /classes/{id}/enroll — HS tự đăng ký tham gia lớp bằng Xu. */
export async function enrollClass(classId: number) {
  const res = await request<ApiResponse<EnrollResponse>>(
    `/api/v1/classes/${classId}/enroll`,
    { method: 'POST' },
  );
  return res.data;
}
