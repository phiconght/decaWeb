import { useAccess } from '@umijs/max';
import React from 'react';
import { getNavGroups } from './navConfig';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Ánh xạ `.shell > .sidebar + .main(.topbar + .content)` — khung trang chính
 * cho người ĐÃ ĐĂNG NHẬP, thay ProLayout. `src/app.tsx` `childrenRender` chỉ
 * bọc component này khi có `currentUser` (ngược lại dùng `PublicShell`) nên
 * không cần tự kiểm tra lại ở đây (KEHOACH_WEB_TrangChuCongKhai_HeroContent.md
 * mục 6.1).
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const access = useAccess();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navGroups = React.useMemo(
    () =>
      getNavGroups({
        isTeacher: !!access.isTeacher,
        isParent: !!access.isParent,
        canViewCourses: !!access.canViewCourses,
        canViewReports: !!access.canViewReports,
        canTeacherWork: !!access.canTeacherWork,
      }),
    [access],
  );

  return (
    <div className="app-shell">
      <Sidebar
        navGroups={navGroups}
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div
          className="app-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="app-main">
        <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
