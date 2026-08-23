import type { NotifType } from './notification';

/**
 * Khớp thật `com.trungtam.message.dto.response.*` (đọc 16/08/2026) — có thêm
 * `readAt` so với suy đoán ban đầu; `PATCH /messages/{id}/read` CÓ tồn tại
 * (khác nghi ngờ trước đó khi chỉ đọc client Mobile).
 */
export interface MessageItem {
  id: number;
  type: NotifType;
  title: string;
  preview: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface MessageDetail {
  id: number;
  type: NotifType;
  title: string;
  content: string;
  payload?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}
