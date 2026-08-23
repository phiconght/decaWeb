// Đọc trực tiếp com.trungtam.notification.entity.NotificationType (16/08/2026) — đủ 13 giá trị.
export type NotifType =
  | 'MISSING_CHECKIN'
  | 'MISSING_CHECKOUT'
  | 'CHECKIN_OK'
  | 'CHECKOUT_OK'
  | 'LEAVE_SUBMITTED'
  | 'LEAVE_RESULT'
  | 'SCHEDULE_CHANGED'
  | 'SESSION_REMINDER'
  | 'ANNOUNCEMENT'
  | 'FEE_CONFIRMED'
  | 'FEE_PAID'
  | 'PRACTICE_ASSIGNED'
  | 'PRACTICE_SUBMITTED';

export interface NotificationItem {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  payload?: string;
  status: string;
  read: boolean;
  messageId?: number;
  sentAt?: string;
  createdAt: string;
}
