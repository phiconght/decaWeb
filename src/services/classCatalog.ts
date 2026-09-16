import { request } from '@umijs/max';
import type {
  ClassCatalogItem,
  ClassPublicDetail,
  EnrollResponse,
  RegistrationResponse,
} from '@/typings/class';
import type { ApiResponse } from '@/typings/common';

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

/** GET /classes/{id}/public — trang chi tiết khóa học công khai. */
export async function fetchClassPublicDetail(classId: number) {
  const res = await request<ApiResponse<ClassPublicDetail>>(
    `/api/v1/classes/${classId}/public`,
    { method: 'GET' },
  );
  return res.data;
}

/** POST /classes/{id}/register — HS bấm "Đăng ký" (chuyển khoản thủ công). */
export async function registerForClass(classId: number) {
  const res = await request<ApiResponse<RegistrationResponse>>(
    `/api/v1/classes/${classId}/register`,
    { method: 'POST' },
  );
  return res.data;
}

/** GET /classes/{id}/register/my — xem lại yêu cầu đăng ký (nếu có) khi quay lại trang. */
export async function fetchMyRegistration(classId: number) {
  const res = await request<ApiResponse<RegistrationResponse | undefined>>(
    `/api/v1/classes/${classId}/register/my`,
    { method: 'GET' },
  );
  return res.data;
}
