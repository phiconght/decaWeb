import { request } from '@umijs/max';
import type { ApiResponse, FlatPageResponse } from '@/typings/common';
import type { CreateLeaveRequest, LeaveItem } from '@/typings/leave';

/**
 * GET /api/v1/leaves — không truyền studentId thì BE tự scope theo JWT
 * (STUDENT: đơn của mình; PARENT: đơn của mọi con; TEACHER: đơn lớp mình dạy)
 * — xem MOBILE/lib/schedule/data/leave_repository.dart.
 */
export async function fetchLeaves(params?: {
  studentId?: number;
  status?: string;
}) {
  const res = await request<FlatPageResponse<LeaveItem>>('/api/v1/leaves', {
    method: 'GET',
    params: { current: 1, pageSize: 50, ...params },
  });
  return res.data;
}

export async function createLeave(body: CreateLeaveRequest) {
  const res = await request<ApiResponse<LeaveItem>>('/api/v1/leaves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
  return res.data;
}

export async function approveLeave(id: number) {
  const res = await request<ApiResponse<LeaveItem>>(
    `/api/v1/leaves/${id}/approve`,
    {
      method: 'PATCH',
    },
  );
  return res.data;
}

export async function rejectLeave(id: number) {
  const res = await request<ApiResponse<LeaveItem>>(
    `/api/v1/leaves/${id}/reject`,
    {
      method: 'PATCH',
    },
  );
  return res.data;
}

export async function confirmLeaveByParent(id: number) {
  const res = await request<ApiResponse<LeaveItem>>(
    `/api/v1/leaves/${id}/parent-confirm`,
    { method: 'PATCH' },
  );
  return res.data;
}
