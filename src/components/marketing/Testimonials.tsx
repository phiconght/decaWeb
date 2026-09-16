import React from 'react';
import type { TestimonialItem } from '@/typings/marketing';

const STAR = '★';

/** "Phụ huynh & học sinh nói gì" — đồng bộ Mobile (testimonials_section.dart). */
export default function Testimonials({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 14px' }}>
        Phụ huynh &amp; học sinh nói gì
      </h2>
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 6,
        }}
      >
        {items.map((t) => {
          const initials = t.name
            .trim()
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
          return (
            <div
              key={t.id}
              style={{
                flexShrink: 0,
                width: 260,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--cobalt)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {initials || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                    {t.meta}
                  </div>
                </div>
              </div>
              <div
                style={{ color: 'var(--gold)', fontSize: 12, marginBottom: 6 }}
              >
                {STAR.repeat(5)}
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: 'var(--ink-soft)',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {t.quote}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
