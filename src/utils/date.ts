import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/vi';

/**
 * antd's ConfigProvider locale container (Umi generated, non-editable) gọi
 * `dayjs.locale('en')` mỗi lần mount vì locale project tên là 'en-US' (xem
 * WEB/PLAN.md — không có locale vi-VN thật) — nó ghi đè `dayjs.locale('vi')`
 * gọi global ở app.tsx. Nên PHẢI gọi `.locale('vi')` cục bộ mỗi lần format
 * ngày tháng cần tên thứ/tháng tiếng Việt, không dựa vào global default.
 */
export function viDate(input: string | Dayjs) {
  return dayjs(input).locale('vi');
}
