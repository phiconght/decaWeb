import React from 'react';

/** Ánh xạ `.panel/.panel-head` — thay thế phần lớn usage ProCard (PLAN §4). */
export default function Panel({
  title,
  extra,
  children,
  style,
  bodyStyle,
}: {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: 22,
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {(title || extra) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          {title && (
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              {title}
            </h2>
          )}
          {extra}
        </div>
      )}
      <div style={bodyStyle}>{children}</div>
    </div>
  );
}
