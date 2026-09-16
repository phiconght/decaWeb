import { request } from '@umijs/max';
import type { ApiResponse, FlatPageResponse } from '@/typings/common';
import type { MessageDetail, MessageItem } from '@/typings/message';

export async function fetchMessages(current = 1, pageSize = 20) {
  const res = await request<FlatPageResponse<MessageItem>>(
    '/api/v1/messages/me',
    {
      method: 'GET',
      params: { current, pageSize },
    },
  );
  return res.data;
}

export async function fetchMessageUnreadCount() {
  const res = await request<ApiResponse<{ count: number }>>(
    '/api/v1/messages/me/unread-count',
    { method: 'GET' },
  );
  return res.data.count;
}

export async function fetchMessageDetail(id: number) {
  const res = await request<ApiResponse<MessageDetail>>(
    `/api/v1/messages/${id}`,
    {
      method: 'GET',
    },
  );
  return res.data;
}

export async function markMessageRead(id: number) {
  await request<ApiResponse<void>>(`/api/v1/messages/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllMessagesRead() {
  await request<ApiResponse<void>>('/api/v1/messages/read-all', {
    method: 'PATCH',
  });
}
