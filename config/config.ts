// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { UMI_ENV = 'dev' } = process.env;

export default defineConfig({
  hash: true,
  publicPath: '/',
  routes,
  ignoreMomentLocale: true,
  proxy: proxy[UMI_ENV as keyof typeof proxy],
  fastRefresh: true,
  // Umi build cảnh báo xung đột esbuild helper giữa nhiều async chunk khi có
  // nhiều trang nhỏ dùng chung export — bật cờ này theo đúng gợi ý của Umi.
  esbuildMinifyIIFE: true,
  model: {},
  initialState: {},
  title: false,
  // Logo thương hiệu (logo/V1/logo_deca_png512x512.png, copy vào public/) làm favicon tab.
  favicons: ['/logo-deca.png'],
  // `layout.locale` (không phải cờ ẩn language-switcher như tưởng ban đầu)
  // điều khiển việc ProLayout có dịch tên menu qua intl hay không — PHẢI để
  // true/bỏ trống thì `menu.<name>` trong src/locales/en-US/menu.ts mới được
  // áp dụng. Không có LangDropdown trong actionsRender nên vẫn chỉ 1 ngôn ngữ.
  layout: {
    ...defaultSettings,
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  locale: {
    // 1 locale duy nhất (WEB/PLAN.md §1 #13) — bỏ scaffold đa ngôn ngữ của ADMIN.
    // Đặt tên 'en-US' (không phải 'vi-VN') để khớp đúng convention ADMIN đang
    // dùng thật (xác nhận 16/08/2026: ADMIN không có locale vi-VN, mà nhét
    // thẳng text tiếng Việt vào src/locales/en-US/*.ts) — baseNavigator: false
    // để KHÔNG đổi theo ngôn ngữ trình duyệt (đảm bảo luôn tiếng Việt).
    default: 'en-US',
    antd: true,
    baseNavigator: false,
  },
  antd: {},
  request: {},
  access: {},
  npmClient: 'npm',
  define: {
    // Domain của web Admin — dùng khi chặn ADMIN/EMPLOYEE thuần đăng nhập vào WEB
    // (xem src/app.tsx getInitialState, WEB/PLAN.md §6.4). Đổi qua biến môi
    // trường thật lúc deploy nếu domain Admin khác localhost:8000.
    ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:8000',
  },
});
