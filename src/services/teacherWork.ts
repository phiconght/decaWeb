import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type {
  TeacherAttendanceView,
  TeacherWorkReport,
} from '@/typings/teacherWork';

export async function teacherCheckin(sessionId: number, roomCode: string) {
  const res = await request<ApiResponse<TeacherAttendanceView>>(
    `/api/v1/sessions/${sessionId}/teacher-checkin`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { roomCode },
    },
  );
  return res.data;
}

export async function teacherCheckout(sessionId: number, roomCode: string) {
  const res = await request<ApiResponse<TeacherAttendanceView>>(
    `/api/v1/sessions/${sessionId}/teacher-checkout`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { roomCode },
    },
  );
  return res.data;
}

export async function fetchMyTeachingAttendance(from: string, to: string) {
  const res = await request<ApiResponse<TeacherWorkReport>>(
    '/api/v1/teachers/me/teaching-attendance',
    { method: 'GET', params: { from, to } },
  );
  return res.data;
}
