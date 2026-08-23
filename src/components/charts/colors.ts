import { tokens } from '@/theme/tokens';

/**
 * Bảng màu biểu đồ báo cáo — đổi theo token thiết kế mới (cobalt/coral/gold/
 * sage) thay vì palette antd mặc định cũ (xem ThietKe/Web/PLAN_TrienKhai_WEB.md
 * §4, dòng `charts/*`). Tên field giữ nguyên để không phải sửa các chart
 * component đang tiêu thụ (`ScoreTrendChart`, `BreakdownChart`,
 * `AttendanceMonthChart`, `TopicMasteryChart`, `AttendanceDonut`).
 */
export const REPORT_COLORS = {
  correct: tokens.sage,
  incorrect: tokens.coral,
  ungraded: tokens.lineSoft,
  coMat: tokens.sage,
  tre: tokens.gold,
  vang: tokens.coral,
  coPhep: tokens.cobalt,
  self: tokens.cobalt,
  classAvg: tokens.gold,
};

export const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
};

export const TYPE_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: 'Trắc nghiệm',
  TRUE_FALSE: 'Đúng/Sai',
  ESSAY: 'Tự luận',
};

export const RESULT_LABEL = {
  correct: 'Đúng',
  incorrect: 'Sai',
  ungraded: 'Chờ chấm',
};

export function scoreColor(ratio: number | null | undefined): string {
  if (ratio == null) return tokens.inkFaint;
  if (ratio >= 0.8) return tokens.sage;
  if (ratio >= 0.5) return tokens.gold;
  return tokens.coral;
}
