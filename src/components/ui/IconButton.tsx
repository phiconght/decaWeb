import React from 'react';

/** Ánh xạ `.icon-btn` (topbar, 40px) / `.icon-btn-sm` (36px, có viền). */
export default function IconButton({
  size = 'md',
  badge,
  children,
  ...rest
}: {
  size?: 'md' | 'sm';
  badge?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const dim = size === 'sm' ? 36 : 40;
  return (
    <button
      type="button"
      style={{
        position: 'relative',
        width: dim,
        height: dim,
        borderRadius: size === 'sm' ? 10 : 12,
        border: size === 'sm' ? '1px solid var(--line)' : 'none',
        background: size === 'sm' ? 'var(--card)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-soft)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      {children}
      {badge}
    </button>
  );
}
