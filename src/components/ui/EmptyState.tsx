import React from 'react';
import { InboxIcon } from '@/components/icons';

/** Ánh xạ `.empty-state` — dùng ở mọi danh sách rỗng. */
export default function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '38px 20px 24px',
      }}
    >
      <div
        style={{ width: 60, height: 60, color: 'var(--line)', marginBottom: 6 }}
      >
        {icon ?? <InboxIcon width={60} height={60} strokeWidth={1.4} />}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, margin: '6px 0 4px' }}>
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: 13,
            color: 'var(--ink-soft)',
            marginBottom: action ? 18 : 0,
            maxWidth: 280,
            lineHeight: 1.55,
          }}
        >
          {description}
        </div>
      )}
      {action}
    </div>
  );
}
