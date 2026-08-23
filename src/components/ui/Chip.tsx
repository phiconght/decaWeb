import React from 'react';
import { type ChipVariant, chipColors } from '@/theme/tokens';

/** Ánh xạ `.badge` (5 biến thể) — dùng thay antd `<Tag>` ở trang đã reskin. */
export default function Chip({
  variant,
  icon,
  children,
}: {
  variant: ChipVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const c = chipColors[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11.5,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        background: c.bg,
        color: c.fg,
      }}
    >
      {icon}
      {children}
    </span>
  );
}
