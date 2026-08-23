import React from 'react';

/**
 * Khung dùng chung cho 4 thẻ "Phân tích tự động" (khóa/chương/buổi/bài thi)
 * — mirror `Card` bo góc + viền trái nhấn ở MOBILE `*_analysis_card.dart`.
 * Câu chữ đã ghép sẵn ở BE, các card này chỉ render.
 */
export default function AnalysisCardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: 'var(--card-warm)',
        border: '1px solid var(--line)',
        borderLeft: '3px solid var(--cobalt)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

export function InsightList({ items, heading }: { items: string[]; heading?: string }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 12 }}>
      {heading && <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{heading}</div>}
      {items.map((s) => (
        <div key={s} style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          • {s}
        </div>
      ))}
    </div>
  );
}

export const fmt = (v?: number) => (v == null ? '—' : v.toFixed(2));
