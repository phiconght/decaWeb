import React from 'react';
import { scoreColor } from '@/components/charts/colors';
import type { OutlineExam, OutlineSession } from '@/typings/classOutline';
import type { RecentExamItem, TopicMasteryItem } from '@/typings/report';

/** Hàng cuộn ngang chung — mirror mobile `_RecentRow`/`SessionCards`/`ChapterCards`/`ExamCards`. */
function HScrollRow({
  items,
  height,
  emptyText,
  render,
}: {
  items: unknown[];
  height: number;
  emptyText: string;
  render: () => React.ReactNode[];
}) {
  if (items.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{emptyText}</div>;
  }
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', height, paddingBottom: 4 }}>
      {render()}
    </div>
  );
}

function cardStyle(borderColor?: string): React.CSSProperties {
  return {
    flex: '0 0 120px',
    width: 120,
    background: 'var(--card)',
    border: borderColor ? `2px solid ${borderColor}` : '1px solid var(--line)',
    borderRadius: 10,
    padding: '8px 10px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };
}

const ellipsis: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/** Cuộn ngang TẤT CẢ bài thi của lớp, sắp gần nhất trước — tab "Bài thi". */
export function RecentExamCardsRow({
  exams,
  onTap,
}: {
  exams: RecentExamItem[];
  onTap: (e: RecentExamItem) => void;
}) {
  return (
    <HScrollRow
      items={exams}
      height={76}
      emptyText="Chưa có bài thi đã nộp."
      render={() =>
        exams.map((e) => {
          const ratio = e.score != null && e.maxScore ? e.score / e.maxScore : undefined;
          const color = scoreColor(ratio);
          return (
            <div key={e.examStudentId} style={cardStyle()} onClick={() => onTap(e)}>
              <div style={{ fontSize: 18, fontWeight: 800, color }}>
                {e.score != null ? e.score.toFixed(1) : '—'}
              </div>
              <div style={{ fontSize: 11, marginTop: 2, ...ellipsis }}>{e.examName}</div>
              {e.submittedAt && (
                <div style={{ fontSize: 10, color: 'var(--ink-faint)' }}>
                  {new Date(e.submittedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </div>
              )}
            </div>
          );
        })
      }
    />
  );
}

/** Cuộn ngang buổi học — dùng ở tab "Buổi học" và trang báo cáo chương. */
export function SessionCardsRow({
  sessions,
  onTap,
}: {
  sessions: OutlineSession[];
  onTap: (sessionId: number) => void;
}) {
  return (
    <HScrollRow
      items={sessions}
      height={72}
      emptyText="Chưa có buổi học nào."
      render={() =>
        sessions.map((s) => (
          <div key={s.sessionId} style={cardStyle()} onClick={() => onTap(s.sessionId)}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Buổi {s.ordinal ?? '—'}</div>
            <div style={{ fontSize: 11, marginTop: 2, ...ellipsis }}>{s.title ?? 'Chưa đặt tên'}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)' }}>
              {new Date(s.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </div>
          </div>
        ))
      }
    />
  );
}

/** Cuộn ngang chương học — tab "Chương học", tô màu theo % nắm chắc. */
export function ChapterCardsRow({
  topics,
  onTap,
}: {
  topics: TopicMasteryItem[];
  onTap: (topicId: number) => void;
}) {
  const items = topics.filter((t) => t.topicId != null);
  return (
    <HScrollRow
      items={items}
      height={72}
      emptyText="Chưa có chương nào."
      render={() =>
        items.map((t) => {
          const color = t.masteryPct != null ? scoreColor(t.masteryPct) : 'var(--ink-faint)';
          return (
            <div key={t.topicId} style={cardStyle()} onClick={() => onTap(t.topicId as number)}>
              <div style={{ fontSize: 16, fontWeight: 800, color }}>
                {t.masteryPct != null ? `${Math.round(t.masteryPct * 100)}%` : '—'}
              </div>
              <div style={{ fontSize: 11, marginTop: 2, ...ellipsis }}>{t.topicName}</div>
            </div>
          );
        })
      }
    />
  );
}

/** Cuộn ngang bài thi trong 1 chương (viền màu theo điểm) — trang báo cáo chương. */
export function ExamCardsRow({
  exams,
  onTap,
}: {
  exams: OutlineExam[];
  onTap: (e: OutlineExam) => void;
}) {
  return (
    <HScrollRow
      items={exams}
      height={100}
      emptyText="Chưa có đề thi."
      render={() =>
        exams.map((e) => {
          const ratio = e.score != null && e.maxScore ? e.score / e.maxScore : undefined;
          const color = ratio != null ? scoreColor(ratio) : 'var(--ink-faint)';
          return (
            <div
              key={e.examId}
              style={{ ...cardStyle(color), flexBasis: 160, width: 160, padding: 12 }}
              onClick={() => onTap(e)}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color }}>
                {e.score != null ? e.score.toFixed(1) : '—'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {e.name}
              </div>
            </div>
          );
        })
      }
    />
  );
}
