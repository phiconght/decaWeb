import { useAccess, useModel } from '@umijs/max';
import React from 'react';
import { getNavGroups } from './navConfig';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/** Ánh xạ `.shell > .sidebar + .main(.topbar + .content)` — khung trang chính, thay ProLayout. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
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

  if (!initialState?.currentUser) {
    // Đang chờ src/app.tsx `layout.onPageChange` redirect sang /login — không render khung trang.
    return null;
  }

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
