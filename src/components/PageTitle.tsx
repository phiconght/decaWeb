import React from 'react';

/**
 * Bỏ `PageContainer` (ProComponents) khi reskin theo thiết kế mới làm mất
 * tiêu đề tab cho các trang không có `name` trong `routes.ts` (vd
 * `/courses/:classId`, `/timetable/session/:id`) — `ProLayout` chỉ tự đặt
 * `document.title` cho route CÓ `name`.
 *
 * KHÔNG dùng `<Helmet>`: `ProLayout` (`useDocumentTitle` nội bộ, xem
 * `node_modules/@ant-design/pro-components/.../useDocumentTitle`) tự gán
 * thẳng `document.title = ...` bằng 1 `useEffect` riêng — không qua Helmet
 * context nên `<Helmet>` của mình không ăn thua. Effect đó nằm ở component
 * cha (`ProLayout` bọc ngoài `AppShell`) nên LUÔN chạy sau effect con trên
 * cùng 1 lần mount (React chạy effect con trước, cha sau) → đè mất giá trị
 * mình set nếu gán cùng tick. Dùng `setTimeout(0)` để đẩy việc gán của mình
 * ra sau, đảm bảo luôn thắng bất kể thứ tự effect gốc.
 */
export default function PageTitle({ title }: { title?: string }) {
  React.useEffect(() => {
    if (!title) return;
    const timer = setTimeout(() => {
      document.title = `${title} - DecaMath`;
    }, 0);
    return () => clearTimeout(timer);
  }, [title]);
  return null;
}
