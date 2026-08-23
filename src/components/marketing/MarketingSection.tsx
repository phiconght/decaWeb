import React from 'react';
import CategoryRow from '@/components/marketing/CategoryRow';
import Testimonials from '@/components/marketing/Testimonials';
import { fetchHomeMarketing } from '@/services/marketing';
import type { HomeMarketingResponse } from '@/typings/marketing';

/**
 * Khối nổi bật + đánh giá trên Trang chủ (danh mục theo khối lớp — lọc từ
 * lớp học THẬT, đồng bộ "Khám phá khóa học" — testimonial). Đồng bộ Mobile
 * (home/view/widgets/marketing_section.dart). Đã bỏ banner khuyến mãi +
 * trust bar (yêu cầu người dùng).
 */
export default function MarketingSection() {
  const [data, setData] = React.useState<HomeMarketingResponse | null>(null);

  const load = React.useCallback(() => {
    fetchHomeMarketing().then(setData);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  if (!data) return null;

  return (
    <div style={{ marginTop: 28 }}>
      {data.categories.map((c) => (
        <CategoryRow key={c.id} category={c} onEnrolled={load} />
      ))}
      <Testimonials items={data.testimonials} />
    </div>
  );
}
