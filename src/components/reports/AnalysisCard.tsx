import React from 'react';
import Chip from '@/components/ui/Chip';
import type { ReportAnalysisResponse } from '@/typings/report';
import AnalysisCardShell, { fmt, InsightList } from './AnalysisCardShell';

/** Bảng "Phân tích tự động" cấp toàn khóa — mirror MOBILE `analysis_card.dart`. */
export default function AnalysisCard({
  analysis,
}: {
  analysis?: ReportAnalysisResponse;
}) {
  if (!analysis) return null;
  const a = analysis;
  return (
    <AnalysisCardShell title="Phân tích tự động">
      <div style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
        {a.studentName} · {a.className}
      </div>
      <div style={{ fontSize: 13.5, marginTop: 4 }}>
        Điểm TB toàn khóa: <b>{fmt(a.courseAverage)}</b>
        {a.courseRank != null
          ? ` — Hạng ${a.courseRank}/${a.classSize ?? '—'}`
          : ''}
      </div>

      {a.chapters.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            Điểm TB &amp; xếp hạng theo chương:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {a.chapters.map((c, i) => (
              <Chip key={c.topicId ?? i} variant="neutral">
                {c.chapterLabel}: {fmt(c.avgScore)}
                {c.rank != null
                  ? ` (hạng ${c.rank}/${c.classSize ?? '—'})`
                  : ''}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <InsightList heading="Nhận định năng lực:" items={a.abilityInsights} />

      {a.attendanceInsight && (
        <div style={{ marginTop: 12, fontSize: 13 }}>
          <b>Chuyên cần: </b>
          {a.attendanceInsight}
        </div>
      )}

      {a.teacherCommentAuthor && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            Nhận xét của {a.teacherCommentAuthor} (GV):
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {a.teacherCommentContent}
          </div>
        </div>
      )}
    </AnalysisCardShell>
  );
}
