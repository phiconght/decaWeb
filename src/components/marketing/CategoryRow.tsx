import { history, useAccess, useModel } from '@umijs/max';
import React from 'react';
import CourseCard from '@/components/CourseCard';
import type { MarketingCategoryItem } from '@/typings/marketing';

const GRADIENTS = [
  'linear-gradient(150deg,#2E43E8,#5B6CFF)',
  'linear-gradient(150deg,#F2A93B,#F5C877)',
  'linear-gradient(150deg,#2FAE7A,#5FCB9F)',
  'linear-gradient(150deg,#FF5D6C,#FF8A93)',
];

/**
 * 1 hàng danh mục nổi bật (banner cosmetic + thẻ lớp học THẬT, lọc theo
 * khối lớp — cùng nguồn với "Khám phá khóa học"). Đồng bộ Mobile
 * (marketing_category_row.dart). Dùng chung cho Dashboard (đã đăng nhập)
 * VÀ Trang chủ công khai (khách) — xem
 * KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 6.3/6.4.
 */
export default function CategoryRow({
  category,
  onEnrolled,
}: {
  category: MarketingCategoryItem;
  onEnrolled: () => void;
}) {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const isGuest = !initialState?.currentUser;
  const hotline = initialState?.appSettings?.supportHotline;
  if (category.classes.length === 0) return null;

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 4,
            height: 20,
            borderRadius: 4,
            background: category.accentColor,
          }}
        />
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, flex: 1 }}>
          {category.emoji
            ? `${category.emoji} ${category.title}`
            : category.title}
        </h2>
        <button
          type="button"
          onClick={() => history.push('/catalog')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--cobalt)',
          }}
        >
          Xem tất cả
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 6,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 170,
            borderRadius: 14,
            padding: 16,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `linear-gradient(150deg, ${category.gradientStart}, ${category.gradientEnd})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -20,
              bottom: -20,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
            }}
          />
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              alignSelf: 'flex-start',
              background: 'rgba(255,255,255,0.2)',
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
            }}
          >
            {category.bannerTag}
          </span>
          <h3
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 14,
              fontWeight: 800,
              lineHeight: 1.3,
              margin: '10px 0',
            }}
          >
            {category.bannerHeadline}
          </h3>
          <button
            type="button"
            onClick={() => history.push('/catalog')}
            style={{
              position: 'relative',
              zIndex: 1,
              alignSelf: 'flex-start',
              background: '#fff',
              color: category.accentColor,
              border: 'none',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Xem ngay
          </button>
        </div>

        {category.classes.map((item, i) => (
          <div key={item.id} style={{ flexShrink: 0, width: 190 }}>
            <CourseCard
              item={item}
              gradient={GRADIENTS[i % GRADIENTS.length]}
              hotline={hotline}
              isStudent={!!access.isStudent}
              isGuest={isGuest}
              onEnrolled={onEnrolled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
