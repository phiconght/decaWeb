import { history } from '@umijs/max';
import dayjs from 'dayjs';
import React from 'react';
import { PrimaryButton } from '@/components/ui/Buttons';
import EmptyState from '@/components/ui/EmptyState';
import Chip from '@/components/ui/Chip';
import { PostIcon } from '@/components/icons';
import CategoryRow from '@/components/marketing/CategoryRow';
import Testimonials from '@/components/marketing/Testimonials';
import { fetchHomeMarketing } from '@/services/marketing';
import { fetchPosts } from '@/services/post';
import type { HomeHeroResponse, HomeMarketingResponse } from '@/typings/marketing';
import type { PostItem } from '@/typings/post';

const FEED_GRADIENTS = [
  'linear-gradient(155deg,#2E43E8,#5B6CFF)',
  'linear-gradient(155deg,#F2A93B,#F5C877)',
  'linear-gradient(155deg,#2FAE7A,#5FCB9F)',
  'linear-gradient(155deg,#FF5D6C,#FF8A93)',
];

/** Hero tĩnh dự phòng — hiện khi chưa cấu hình ở ADMIN hoặc API lỗi, để
 * Trang chủ công khai không bao giờ trắng (KEHOACH... mục 6.3, 8). */
const FALLBACK_HERO: HomeHeroResponse = {
  title: 'Học chắc kiến thức — Tiến bộ từng buổi học',
  subtitle:
    'Trung tâm giáo dục DecaMath — lộ trình học Toán cá nhân hóa cho học viên từ lớp 6 đến lớp 12.',
  primaryCtaLabel: 'Đăng nhập',
  primaryCtaHref: '/login',
  secondaryCtaLabel: 'Khám phá khóa học',
  secondaryCtaHref: '/catalog',
  visible: true,
};

function PostCard({
  post,
  gradient,
  onClick,
}: {
  post: PostItem;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 160,
          position: 'relative',
          flexShrink: 0,
          background: post.coverImageUrl
            ? `url(${post.coverImageUrl}) center/cover`
            : gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!post.coverImageUrl && (
          <PostIcon width={36} height={36} stroke="#fff" style={{ opacity: 0.9 }} />
        )}
        {post.pinned && (
          <span style={{ position: 'absolute', top: 10, left: 10 }}>
            <Chip variant="coral">Ghim</Chip>
          </span>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            lineHeight: 1.35,
            minHeight: 40,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 12,
            color: 'var(--ink-faint)',
          }}
        >
          <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>
            Trung tâm giáo dục DecaMath
          </span>
          <span className="mono">
            {dayjs(post.publishedAt ?? post.createdAt).format('DD/MM/YYYY')}
          </span>
        </div>
      </div>
    </div>
  );
}

function goTo(href?: string) {
  if (!href) return;
  if (/^https?:\/\//.test(href)) {
    window.location.href = href;
  } else {
    history.push(href);
  }
}

function Hero({ hero }: { hero: HomeHeroResponse }) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        padding: '56px 40px',
        marginBottom: 28,
        color: '#fff',
        // Gradient sáng — cùng cặp màu cobalt→cobalt-nhạt đã dùng ở
        // FEED_GRADIENTS/CategoryRow (không dùng cobalt-dark làm nền lớn:
        // quá tối so với tông giấy ấm của phần còn lại trang, phản hồi
        // người dùng 13/09/2026).
        background: hero.backgroundImageUrl
          ? `linear-gradient(rgba(30,40,120,0.4), rgba(30,40,120,0.4)), url(${hero.backgroundImageUrl}) center/cover`
          : 'linear-gradient(135deg, var(--cobalt), #5B6CFF)',
      }}
    >
      {hero.badgeText && (
        <div
          style={{
            display: 'inline-block',
            fontSize: 12.5,
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.18)',
            marginBottom: 16,
          }}
        >
          {hero.badgeText}
        </div>
      )}
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '0 0 12px', maxWidth: 620 }}>
        {hero.title}
      </h1>
      {hero.subtitle && (
        <p style={{ fontSize: 15, opacity: 0.92, maxWidth: 520, margin: '0 0 26px' }}>
          {hero.subtitle}
        </p>
      )}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {hero.primaryCtaLabel && (
          <PrimaryButton
            onClick={() => goTo(hero.primaryCtaHref)}
            style={{ background: '#fff', color: 'var(--cobalt-dark)' }}
          >
            {hero.primaryCtaLabel}
          </PrimaryButton>
        )}
        {hero.secondaryCtaLabel && (
          <button
            type="button"
            onClick={() => goTo(hero.secondaryCtaHref)}
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.7)',
              background: 'transparent',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {hero.secondaryCtaLabel}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Trang chủ công khai — hiện cho khách CHƯA ĐĂNG NHẬP (khác với
 * `HomeDashboard`, dành cho người đã đăng nhập). Hero lấy từ API cấu hình
 * (`GET /api/v1/home/marketing`, sửa được ở màn "Nội Dung" của ADMIN) —
 * KHÔNG hard-code — có fallback tĩnh khi chưa cấu hình/API lỗi. Xem
 * `pages/home/index.tsx` và
 * KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 6.3.
 */
export default function HomeLanding() {
  const [marketing, setMarketing] = React.useState<HomeMarketingResponse>();
  const [posts, setPosts] = React.useState<PostItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadMarketing = React.useCallback(() => {
    fetchHomeMarketing().then(setMarketing);
  }, []);

  React.useEffect(() => {
    Promise.all([fetchHomeMarketing(), fetchPosts(1, 4).catch(() => [])])
      .then(([m, feed]) => {
        setMarketing(m);
        setPosts(feed);
      })
      .finally(() => setLoading(false));
  }, []);

  const hero = marketing?.hero ?? FALLBACK_HERO;

  return (
    <>
      <Hero hero={hero} />

      {/* Bài viết mới nhất — đẩy lên đầu (ngay sau Hero), khung ảnh nổi bật
          thay vì icon nhỏ (phản hồi người dùng 13/09/2026). */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span
            style={{
              width: 4,
              height: 20,
              borderRadius: 4,
              background: 'var(--cobalt)',
            }}
          />
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, flex: 1 }}>
            Bài viết mới nhất
          </h2>
          <button
            type="button"
            onClick={() => history.push('/posts')}
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

        {loading ? (
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
        ) : posts.length === 0 ? (
          <EmptyState title="Chưa có bài viết" />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 18,
            }}
          >
            {posts.map((p, i) => (
              <PostCard
                key={p.id}
                post={p}
                gradient={FEED_GRADIENTS[i % FEED_GRADIENTS.length]}
                onClick={() => history.push(`/posts/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && marketing && marketing.categories.length > 0 && (
        <>
          {marketing.categories.map((c) => (
            <CategoryRow key={c.id} category={c} onEnrolled={loadMarketing} />
          ))}
        </>
      )}

      {!loading && marketing && marketing.testimonials.length > 0 && (
        <Testimonials items={marketing.testimonials} />
      )}
    </>
  );
}
