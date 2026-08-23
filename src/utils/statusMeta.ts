/**
 * Bảng màu/nhãn trạng thái TẬP TRUNG 1 chỗ (WEB/PLAN.md §7 #1) — mỗi variant
 * khớp đúng enum tương ứng ở §4. Thêm variant mới khi cần, không lặp lại ở
 * từng trang.
 */
export type StatusVariant = 'leave' | 'session' | 'invoice' | 'exam';

interface StatusMeta {
  color: string;
  label: string;
}

const LEAVE: Record<string, StatusMeta> = {
  PENDING: { color: 'gold', label: 'Chờ duyệt' },
  APPROVED: { color: 'green', label: 'Đã duyệt' },
  REJECTED: { color: 'red', label: 'Từ chối' },
};

const SESSION: Record<string, StatusMeta> = {
  PLANNED: { color: 'blue', label: 'Sắp diễn ra' },
  DONE: { color: 'green', label: 'Đã học' },
  CANCELLED: { color: 'red', label: 'Đã huỷ' },
};

const INVOICE: Record<string, StatusMeta> = {
  DRAFT: { color: 'default', label: 'Nháp' },
  CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
  PAID: { color: 'green', label: 'Đã thanh toán' },
  CANCELLED: { color: 'red', label: 'Đã huỷ' },
};

const EXAM: Record<string, StatusMeta> = {
  ACTIVE: { color: 'blue', label: 'Đang mở' },
  INACTIVE: { color: 'default', label: 'Đã đóng' },
};

const TABLES: Record<StatusVariant, Record<string, StatusMeta>> = {
  leave: LEAVE,
  session: SESSION,
  invoice: INVOICE,
  exam: EXAM,
};

export function getStatusMeta(
  variant: StatusVariant,
  status: string,
): StatusMeta {
  return TABLES[variant][status] ?? { color: 'default', label: status };
}
