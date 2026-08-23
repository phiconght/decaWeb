import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';

dayjs.extend(relativeTime);

// Không set dayjs.locale('vi') global ở đây — locale container do Umi sinh
// (locale project tên 'en-US') sẽ tự gọi dayjs.locale('en') lúc mount và ghi
// đè giá trị này. Dùng @/utils/date.viDate() ở từng nơi cần tên thứ/tháng
// tiếng Việt thay vì dựa vào default toàn cục.

import AppShell from '@/components/AppShell';
import { getMe, toCurrentUser } from '@/services/auth';
import { tokens } from '@/theme/tokens';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const loginPath = '/login';

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * WEB/PLAN.md §6.4 — khác ADMIN ở việc chặn ADMIN/EMPLOYEE thuần (không phải
 * đối tượng dùng WEB), chuyển hướng sang trang Admin.
 */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const user = await getMe();
      const cu = toCurrentUser(user);
      const roles = cu.roles ?? [];
      const isStaffOnly = !roles.some((r) =>
        ['STUDENT', 'PARENT', 'TEACHER'].includes(r),
      );
      if (isStaffOnly) {
        window.location.href = ADMIN_URL;
        return undefined;
      }
      return cu;
    } catch {
      const { pathname, search, hash } = history.location;
      if (pathname !== loginPath) {
        history.replace(
          `${loginPath}?redirect=${encodeURIComponent(pathname + search + hash)}`,
        );
      }
    }
    return undefined;
  };

  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

/**
 * ProLayout: https://procomponents.ant.design/components/layout
 * ThietKe/Web/PLAN_TrienKhai_WEB.md §3.2 A1 — KHÔNG dùng ProLayout làm khung
 * hiển thị (sidebar/header/footer mặc định tắt hết), chỉ mượn cơ chế
 * `childrenRender` của Umi (đọc từ Layout.tsx tự sinh) để bọc nội dung trang
 * bằng `AppShell` tự viết theo đúng thiết kế mới. `onPageChange` (redirect
 * khi chưa đăng nhập) vẫn hoạt động độc lập với việc tắt chrome.
 */
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    menuRender: false,
    headerRender: false,
    footerRender: false,
    menuHeaderRender: false,
    childrenRender: (dom: React.ReactNode) => <AppShell>{dom}</AppShell>,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.replace(
          `${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`,
        );
      }
    },
    ...initialState?.settings,
  };
};

/**
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig,
};

/**
 * Bọc antd ConfigProvider ở gốc cây — map token antd sang design token mới
 * (PLAN §3.2 A5) để Input/Select/DatePicker/Drawer/Modal... của antd (vẫn
 * giữ dùng cho phần logic) ra đúng màu/bo góc/font, không lệch tông với
 * phần UI tự vẽ.
 */
export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: tokens.cobalt,
          colorLink: tokens.cobalt,
          colorSuccess: tokens.sage,
          colorWarning: tokens.gold,
          colorError: tokens.coral,
          borderRadius: tokens.radiusSm,
          fontFamily: "'Be Vietnam Pro', sans-serif",
          colorText: tokens.ink,
          colorTextSecondary: tokens.inkSoft,
          colorBorder: tokens.line,
        },
      }}
    >
      {container}
    </ConfigProvider>
  );
}
