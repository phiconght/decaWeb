import React from 'react';

/** Ánh xạ `.list-card/.section-title` — bọc ngoài 1 nhóm `ListRow`. */
export function ListCard({
  title,
  icon,
  children,
  style,
}: {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            padding: '16px 22px',
            borderBottom: '1px solid var(--line-soft)',
            background: 'var(--card-warm)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--cobalt)',
          }}
        >
          {icon}
          <span style={{ color: 'var(--ink)' }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

/** Ánh xạ `.list-row/.row-left/.row-icon/.row-right` — 1 dòng icon+tiêu đề+phụ đề+badge. */
export function ListRow({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  right,
  onClick,
}: {
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  const clickable = !!onClick;
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 22px',
        borderBottom: '1px solid var(--line-soft)',
        cursor: clickable ? 'pointer' : undefined,
      }}
      onMouseEnter={(e) => {
        if (clickable) e.currentTarget.style.background = 'var(--line-soft)';
      }}
      onMouseLeave={(e) => {
        if (clickable) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}
      >
        {icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: iconBg ?? 'var(--cobalt-tint)',
              color: iconColor ?? 'var(--cobalt)',
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 3 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {right && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
}
