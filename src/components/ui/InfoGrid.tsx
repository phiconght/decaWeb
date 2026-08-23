import React from 'react';

/** Ánh xạ `.info-grid/.info-item` — cặp key-value 2 cột. */
export default function InfoGrid({
  items,
  columns = 2,
}: {
  items: { k: string; v: React.ReactNode }[];
  columns?: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '18px 40px',
        marginBottom: 20,
      }}
    >
      {items.map((item) => (
        <div key={item.k}>
          <div
            style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 4 }}
          >
            {item.k}
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{item.v}</div>
        </div>
      ))}
    </div>
  );
}
