/**
 * Service xác thực — copy nguyên từ ADMIN/src/services/auth.ts (WEB/PLAN.md §1 #6).
 * Đã xác minh khớp 100% với MOBILE/lib/auth/data/auth_repository.dart — cùng
 * /api/v1/auth/login|me|logout, cùng field roles[]/permissions[].
 */
import { request } from '@umijs/max';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

export interface BackendUser {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  fullName?: string;
  status: string;
  roles: string[];
  permissions: string[];
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: BackendUser;
}

/** POST /api/v1/auth/login */
export async function login(body: { username: string; password: string }) {
  const res = await request<ApiResponse<TokenResponse>>('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    skipErrorHandler: true,
  });
  return res.data;
}

/** GET /api/v1/auth/me */
export async function getMe() {
  const res = await request<ApiResponse<BackendUser>>('/api/v1/auth/me', {
    method: 'GET',
    skipErrorHandler: true,
  });
  return res.data;
}

/** POST /api/v1/auth/logout — thu hồi refresh token, xoá token cục bộ */
export async function logout() {
  const refreshToken = tokenStore.getRefresh();
  if (refreshToken) {
    try {
      await request('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { refreshToken },
        skipErrorHandler: true,
      });
    } catch {
      // bỏ qua lỗi mạng khi đăng xuất
    }
  }
  tokenStore.clear();
}

/** Map user của backend sang định dạng CurrentUser mà ProLayout dùng */
export function toCurrentUser(user: BackendUser): API.CurrentUser {
  return {
    name: user.fullName || user.username,
    userid: String(user.id),
    access: user.roles.includes('ADMIN') ? 'admin' : 'user',
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    email: user.email,
    roles: user.roles,
    permissions: user.permissions,
  };
}
