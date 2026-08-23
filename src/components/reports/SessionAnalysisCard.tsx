import React from 'react';
import type { SessionAnalysisResponse } from '@/typings/report';
import AnalysisCardShell, { fmt, InsightList } from './AnalysisCardShell';

/** Bảng "Phân tích tự động" cho 1 BUỔI HỌC — mirror `session_analysis_card.dart`. */
export default function SessionAnalysisCard({ analysis }: { analysis?: SessionAnalysisResponse }) {
  if (!analysis) return null;
  const a = analysis;
  return (
    <AnalysisCardShell title="Phân tích tự động — Buổi học">
      <div style={{ fontSize: 13.5 }}>
        Điểm TB buổi: <b>{fmt(a.avgScore)}</b> — TB lớp: <b>{fmt(a.classAverage)}</b>
      </div>
      <div style={{ fontSize: 13.5, marginTop: 4 }}>
        Số đề: {a.submittedCount}/{a.examCount} đã làm
      </div>
      {a.comparisonInsight && (
        <div style={{ fontSize: 13, marginTop: 8 }}>{a.comparisonInsight}</div>
      )}
      <InsightList heading="Nhận định năng lực:" items={a.abilityInsights} />
    </AnalysisCardShell>
  );
}
