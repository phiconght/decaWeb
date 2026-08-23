import React from 'react';

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
};

/** Ánh xạ `.btn-primary/.btn-outline/.btn-danger-outline` (PLAN §4). */
export function PrimaryButton({ icon, children, style, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--cobalt)',
        color: '#fff',
        border: 'none',
        borderRadius: 999,
        padding: '10px 20px',
        fontSize: 13.5,
        fontWeight: 700,
        boxShadow: '0 6px 16px -6px rgba(46,67,232,0.55)',
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export function OutlineButton({ icon, children, style, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 16px',
        borderRadius: 10,
        border: '1px solid var(--line)',
        background: 'var(--card)',
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--ink)',
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export function DangerOutlineButton({
  icon,
  children,
  style,
  ...rest
}: BtnProps) {
  return (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid var(--coral)',
        color: 'var(--coral)',
        background: '#fff',
        borderRadius: 10,
        padding: '9px 16px',
        fontWeight: 700,
        fontSize: 13.5,
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
