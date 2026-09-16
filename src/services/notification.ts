import { request } from '@umijs/max';
import type { ApiResponse, FlatPageResponse } from '@/typings/common';
import type { NotificationItem } from '@/typings/notification';

export async function fetchNotifications(current = 1, pageSize = 20) {
  const res = await request<FlatPageResponse<NotificationItem>>(
    '/api/v1/notifications/me',
    {
      method: 'GET',
      params: { current, pageSize },
    },
  );
  return res.data;
}

export async function fetchNotificationUnreadCount() {
  const res = await request<ApiResponse<{ count: number }>>(
    '/api/v1/notifications/me/unread-count',
    { method: 'GET' },
  );
  return res.data.count;
}

export async function markNotificationRead(id: number) {
  await request<ApiResponse<void>>(`/api/v1/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsRead() {
  await request<ApiResponse<void>>('/api/v1/notifications/read-all', {
    method: 'PATCH',
  });
}
