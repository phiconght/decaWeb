import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * ThietKe/Web/PLAN_TrienKhai_WEB.md §3.2 A4 — ProLayout không còn làm khung
 * hiển thị (xem src/app.tsx `layout` export: menuRender/headerRender/
 * footerRender đều tắt, khung thật do `AppShell` tự viết đảm nhiệm). File
 * này chỉ còn giữ `title` cho `<title>` tag của trình duyệt.
 */
const Settings: ProLayoutProps & { logo?: string } = {
  title: 'DecaMath',
};

export default Settings;
