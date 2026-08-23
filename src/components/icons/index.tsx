import React from 'react';

/**
 * Icon SVG trích nguyên nét vẽ (stroke 1.8, viewBox 24x24) từ
 * ThietKe/Web/files/*.html — xem PLAN_TrienKhai_WEB.md §3.2 A6. Dùng thay
 * @ant-design/icons ở khung Sidebar/Topbar/component thiết kế mới để giữ
 * đúng phong cách hình vẽ (khác bộ icon chuẩn AntD).
 */
type IconProps = React.SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode, props: IconProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={19}
    height={19}
    {...props}
  >
    {children}
  </svg>
);

export const HomeIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
    </>,
    p,
  );

export const CalendarIcon = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3.4M16 3v3.4" />
    </>,
    p,
  );

export const LeaveIcon = (p: IconProps) =>
  base(
    <>
      <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="m9 12.5 2 2 4-4.5" />
    </>,
    p,
  );

export const CatalogIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 6-2-6-6 2 6-2 2-6 2 6 6-2Z" strokeLinejoin="round" />
    </>,
    p,
  );

export const BookIcon = (p: IconProps) =>
  base(
    <>
      <path d="M4 5.2c0-.9.8-1.5 1.7-1.3 2 .4 4.5 1.3 6.3 2.7 1.8-1.4 4.3-2.3 6.3-2.7.9-.2 1.7.4 1.7 1.3v12.6c0 .8-.6 1.4-1.4 1.5-2.1.3-4.7 1.1-6.6 2.5-1.9-1.4-4.5-2.2-6.6-2.5-.8-.1-1.4-.7-1.4-1.5V5.2Z" />
      <path d="M12 6.6v13" />
    </>,
    p,
  );

export const ReportIcon = (p: IconProps) =>
  base(<path d="M4 19V9M10 19V4M16 19v-7M20 19h-1" />, p);

export const FeeIcon = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.2" />
      <path d="M3 10.5h18" />
      <path d="M6.5 14.5h4" />
    </>,
    p,
  );

export const CoinIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="8.3" />
      <path d="M12 8v8M9.3 9.7c0-1 1.1-1.8 2.7-1.8s2.7.7 2.7 1.6c0 2.3-5.4 1-5.4 3.3 0 .9 1.1 1.6 2.7 1.6s2.7-.7 2.7-1.7" />
    </>,
    p,
  );

export const PostIcon = (p: IconProps) =>
  base(
    <>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M14 3.5V8h4.2" />
      <path d="M8.5 12.5h7M8.5 15.8h7M8.5 9.3h3" />
    </>,
    p,
  );

export const UserIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="8.3" r="3.4" />
      <path d="M4.8 20c1-3.2 3.9-5.2 7.2-5.2s6.2 2 7.2 5.2" />
    </>,
    p,
  );

export const QrIcon = (p: IconProps) =>
  base(
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>,
    p,
  );

export const BellIcon = (p: IconProps) =>
  base(
    <>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.4 5.4 1.4 5.4H4.6S6 13.5 6 9.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </>,
    p,
  );

export const MessageIcon = (p: IconProps) =>
  base(<path d="M4 5.5h16v11H8.5L4 20.5Z" />, p);

export const SearchIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.8-3.8" />
    </>,
    p,
  );

export const ChevronDownIcon = (p: IconProps) =>
  base(<path d="m6 9 6 6 6-6" />, p);

export const ChevronRightIcon = (p: IconProps) =>
  base(<path d="m9 6 6 6-6 6" />, p);

export const ChevronLeftIcon = (p: IconProps) =>
  base(<path d="m15 6-6 6 6 6" />, p);

export const MenuIcon = (p: IconProps) =>
  base(<path d="M4 6.5h16M4 12h16M4 17.5h16" />, p);

export const LogoutIcon = (p: IconProps) =>
  base(
    <>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>,
    p,
  );

export const InboxIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3.5 10v9a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-9" />
      <path d="M3.5 10 6 4.5h12L20.5 10" />
      <path d="M3.5 10h5a1 1 0 0 1 1 1v.5a2.5 2.5 0 0 0 5 0V11a1 1 0 0 1 1-1h5" />
    </>,
    p,
  );
