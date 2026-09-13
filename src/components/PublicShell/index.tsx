import { history, Link, useLocation } from '@umijs/max';
import React from 'react';
import { PrimaryButton } from '@/components/ui/Buttons';

const NAV_ITEMS = [
  { path: '/home', label: 'Trang chủ' },
  { path: '/catalog', label: 'Khám phá khóa học' },
  { path: '/posts', label: 'Bài viết' },
];

/**
 * Khung trang cho khách CHƯA ĐĂNG NHẬP — thay `AppShell` khi
 * `src/app.tsx` `childrenRender` không có `currentUser`. Không sidebar,
 * không chuông/tin nhắn/avatar (đều cần token) — chỉ header ngang + nút
 * "Đăng nhập" + footer gọn.
 * Xem KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 6.2.
 */
export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();

  return (
    <div className="public-shell">
      <header className="public-header">
        <Link
          to="/home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <img src="/logo-deca.png" alt="DecaMath" width={30} height={30} />
          <span
            style={{
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: '0.01em',
              color: 'var(--ink)',
            }}
          >
            DecaMath
          </span>
        </Link>

        <nav className="public-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="public-nav-link"
              data-active={pathname === item.path || pathname.startsWith(`${item.path}/`)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <PrimaryButton onClick={() => history.push('/login')} style={{ flexShrink: 0 }}>
          Đăng nhập
        </PrimaryButton>
      </header>

      <main className="public-content">{children}</main>

      <footer className="public-footer">
        <span>© {new Date().getFullYear()} Trung tâm giáo dục DecaMath</span>
      </footer>
    </div>
  );
}
