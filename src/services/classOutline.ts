import { request } from '@umijs/max';
import type {
  ClassListItem,
  ClassOutlineQuery,
  ClassOutlineResponse,
} from '@/typings/classOutline';
import type { ApiResponse } from '@/typings/common';

/** GET /api/v1/classes/me — self-scoped (lớp mình học/dạy), KHÔNG phải toàn hệ thống. */
export async function fetchMyClasses() {
  const res = await request<ApiResponse<ClassListItem[]>>(
    '/api/v1/classes/me',
    {
      method: 'GET',
    },
  );
  return res.data;
}

export async function fetchClassOutline(
  classId: number,
  query?: ClassOutlineQuery,
) {
  const res = await request<ApiResponse<ClassOutlineResponse>>(
    `/api/v1/classes/${classId}/outline`,
    { method: 'GET', params: query },
  );
  return res.data;
}
