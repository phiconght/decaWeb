import React from 'react';
import { ChevronDownIcon } from '@/components/icons';

/** Ánh xạ `.accordion/.accordion-head/.accordion-body`. */
export default function Accordion({
  title,
  icon,
  defaultOpen = true,
  children,
  style,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--card)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: 16,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 20px',
          background: 'var(--card-warm)',
          fontWeight: 700,
          fontSize: 14.5,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--ink)',
        }}
      >
        {icon}
        <span style={{ flex: 1 }}>{title}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          style={{
            color: 'var(--ink-soft)',
            transform: open ? 'rotate(180deg)' : undefined,
            transition: 'transform .2s ease',
          }}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
