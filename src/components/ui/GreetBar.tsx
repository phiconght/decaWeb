import React from 'react';

export interface MiniStat {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  onClick?: () => void;
}

/** Ánh xạ `.greet-bar/.punch-holes/.mini-stats` — thanh chào kiểu "vé xé". */
export default function GreetBar({
  title,
  subtitle,
  stats,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  stats: MiniStat[];
}) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        background: 'var(--card-warm)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 26px 18px 46px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: 22,
        overflow: 'hidden',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 22,
          background: 'var(--card)',
          borderRight: '1px dashed var(--line)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          bottom: 0,
          width: 12,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              background: 'var(--paper)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.18)',
            }}
          />
        ))}
      </div>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 3px' }}>
          {title}
        </h1>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            onClick={s.onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 18px',
              borderLeft: i === 0 ? undefined : '1px solid var(--line)',
              cursor: s.onClick ? 'pointer' : undefined,
            }}
          >
            {s.icon}
            <div>
              <div
                className="mono"
                style={{ fontSize: 17, fontWeight: 700, lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div
                style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
