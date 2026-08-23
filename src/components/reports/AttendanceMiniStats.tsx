import React from 'react';
import type { AttendanceSummary } from '@/typings/report';

const pct = (v?: number) => (v == null ? '—' : `${Math.round(v * 100)}%`);

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{label}</div>
    </div>
  );
}

/** Hàng 3 mini-stat chuyên cần — mirror MOBILE `_Mini` row (Đi đủ/Đúng giờ/Số buổi). */
export default function AttendanceMiniStats({ summary }: { summary: AttendanceSummary }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 12 }}>
      <Mini label="Đi đủ" value={pct(summary.attendanceRate)} />
      <Mini label="Đúng giờ" value={pct(summary.onTimeRate)} />
      <Mini label="Số buổi" value={`${summary.totalSessions}`} />
    </div>
  );
}
