import React from 'react';
import type { ChapterAnalysisResponse } from '@/typings/report';
import AnalysisCardShell, { fmt, InsightList } from './AnalysisCardShell';

/** Bảng "Phân tích tự động" cho 1 CHƯƠNG — mirror `chapter_analysis_card.dart`. */
export default function ChapterAnalysisCard({ analysis }: { analysis?: ChapterAnalysisResponse }) {
  if (!analysis) return null;
  const a = analysis;
  return (
    <AnalysisCardShell title={`Phân tích tự động — ${a.chapterLabel ?? 'Chương'}`}>
      <div style={{ fontSize: 13.5 }}>
        Điểm TB chương: <b>{fmt(a.avgScore)}</b>
        {a.rank != null ? ` — Hạng ${a.rank}/${a.classSize ?? '—'}` : ''}
      </div>
      <InsightList heading="Nhận định năng lực:" items={a.abilityInsights} />
      {a.attendanceInsight && (
        <div style={{ marginTop: 12, fontSize: 13 }}>
          <b>Chuyên cần: </b>
          {a.attendanceInsight}
        </div>
      )}
    </AnalysisCardShell>
  );
}
