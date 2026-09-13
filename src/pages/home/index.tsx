import { useModel } from '@umijs/max';
import HomeDashboard from './HomeDashboard';
import HomeLanding from './HomeLanding';

/**
 * `/home` dùng chung cho khách (Trang chủ công khai) và người đã đăng nhập
 * (Dashboard) — chỉ chọn nhánh theo `currentUser`. Xem
 * KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 6.3.
 */
export default function HomePage() {
  const { initialState } = useModel('@@initialState');
  return initialState?.currentUser ? <HomeDashboard /> : <HomeLanding />;
}
