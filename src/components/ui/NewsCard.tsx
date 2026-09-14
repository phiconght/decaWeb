import { PostIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';

/**
 * Thẻ bảng tin kiểu báo điện tử — ảnh mô tả full-width phía trên, title +
 * excerpt bên dưới. Dùng `coverImageUrl` nếu bài viết có ảnh; nếu không, vẽ
 * banner gradient + icon giấy tờ để khung ảnh không bao giờ để trống xấu.
 */
export default function NewsCard({
  title,
  excerpt,
  author,
  date,
  pinned,
  coverImageUrl,
  gradient,
  onClick,
}: {
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  pinned?: boolean;
  coverImageUrl?: string;
  gradient?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--line-soft)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--card)',
        cursor: onClick ? 'pointer' : undefined,
        height: '100%',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          flexShrink: 0,
          background: gradient ?? 'linear-gradient(155deg,#2E43E8,#5B6CFF)',
        }}
      >
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PostIcon width={32} height={32} stroke="#fff" />
          </div>
        )}
        {pinned && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <Chip variant="coral">Ghim</Chip>
          </div>
        )}
      </div>
      <div
        style={{
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            margin: '0 0 8px',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
        {excerpt && (
          <p
            style={{
              fontSize: 12.5,
              color: 'var(--ink-soft)',
              lineHeight: 1.55,
              margin: '0 0 10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 11.5,
            color: 'var(--ink-faint)',
            marginTop: 'auto',
          }}
        >
          <span style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>
            {author}
          </span>
          <span className="mono">{date}</span>
        </div>
      </div>
    </div>
  );
}
