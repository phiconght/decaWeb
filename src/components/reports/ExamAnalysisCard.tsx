import React from 'react';
import type { ExamAnalysisResponse } from '@/typings/report';
import AnalysisCardShell, { fmt, InsightList } from './AnalysisCardShell';

/** Bảng "Phân tích tự động" cho 1 BÀI THI — mirror `exam_analysis_card.dart`. */
export default function ExamAnalysisCard({ analysis }: { analysis?: ExamAnalysisResponse }) {
  if (!analysis) return null;
  const a = analysis;
  return (
    <AnalysisCardShell title="Phân tích tự động — Bài thi">
      <div style={{ fontSize: 13.5 }}>
        Điểm: <b>{fmt(a.score)}</b> — TB lớp: <b>{fmt(a.classAverage)}</b>
        {a.rank != null ? ` — Hạng ${a.rank}/${a.classSize ?? '—'}` : ''}
      </div>
      {a.comparisonInsight && (
        <div style={{ fontSize: 13, marginTop: 8 }}>{a.comparisonInsight}</div>
      )}
      <InsightList heading="Nhận định năng lực:" items={a.abilityInsights} />
    </AnalysisCardShell>
  );
}
