import { PostIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';

/** Ánh xạ `.feed-card/.feed-thumb/.feed-meta` — 1 dòng bảng tin. */
export default function FeedCard({
  title,
  excerpt,
  author,
  date,
  pinned,
  gradient,
  onClick,
}: {
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  pinned?: boolean;
  gradient?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        borderRadius: 'var(--radius-md)',
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          background: gradient ?? 'linear-gradient(155deg,#2E43E8,#5B6CFF)',
        }}
      >
        <PostIcon width={24} height={24} stroke="#fff" />
      </div>
      <div style={{ minWidth: 0 }}>
        {pinned && (
          <div style={{ marginBottom: 6 }}>
            <Chip variant="coral">Ghim</Chip>
          </div>
        )}
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            margin: '0 0 6px',
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {excerpt && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--ink-soft)',
              lineHeight: 1.6,
              margin: '0 0 8px',
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
            gap: 14,
            fontSize: 12,
            color: 'var(--ink-faint)',
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
