import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type { TimetableItem, TimetableQuery } from '@/typings/timetable';

/**
 * GET /api/v1/timetable — KHÔNG truyền refId (xác nhận 16/08/2026 đọc
 * MOBILE/lib/schedule/cubit/timetable_cubit.dart: BE tự resolve theo JWT —
 * PARENT nhận sẵn buổi của TẤT CẢ con, lọc theo con ở client qua studentId).
 */
export async function fetchTimetable(
  query: Omit<TimetableQuery, 'refId' | 'branchId'>,
) {
  const res = await request<ApiResponse<TimetableItem[]>>('/api/v1/timetable', {
    method: 'GET',
    params: query,
  });
  return res.data;
}

/** POST /sessions/{id}/self-checkin — điểm danh tự bấm nút cho buổi ONLINE (không cần QR). */
export async function selfCheckin(sessionId: number) {
  await request<ApiResponse<void>>(`/api/v1/sessions/${sessionId}/self-checkin`, {
    method: 'POST',
  });
}
