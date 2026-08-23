/**
 * Xử lý lỗi tập trung — copy khung từ ADMIN, đổi sang message.error() toast
 * thay vì notification (phù hợp màn hẹp). Xem WEB/PLAN.md §1 #16.
 */
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

interface ResponseStructure {
  success: boolean;
  data: unknown;
  error?: { code: string; message: string };
}

export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      const { success, error } = res as unknown as ResponseStructure;
      if (!success) {
        const err: any = new Error(error?.message ?? 'Lỗi không xác định');
        err.name = 'BizError';
        err.info = error;
        throw err;
      }
    },
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        message.error(error.info?.message ?? 'Có lỗi xảy ra, vui lòng thử lại');
      } else if (error.response) {
        const data: any = error.response.data;
        const bizMessage: string | undefined = data?.error?.message;
        message.error(bizMessage || `Lỗi máy chủ (${error.response.status})`);
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        message.error('Mất kết nối mạng. Vui lòng kiểm tra và thử lại.');
      } else if (error.request) {
        message.error('Không nhận được phản hồi, vui lòng thử lại.');
      } else {
        message.error('Yêu cầu lỗi, vui lòng thử lại.');
      }
    },
  },
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
  responseInterceptors: [],
};
