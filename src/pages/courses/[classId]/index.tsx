import { history, useParams } from '@umijs/max';
import React from 'react';
import { BookIcon, ChevronRightIcon } from '@/components/icons';
import PageTitle from '@/components/PageTitle';
import Accordion from '@/components/ui/Accordion';
import Chip from '@/components/ui/Chip';
import Crumb from '@/components/ui/Crumb';
import InfoGrid from '@/components/ui/InfoGrid';
import Panel from '@/components/ui/Panel';
import ProgressBar from '@/components/ui/ProgressBar';
import QuizChip from '@/components/ui/QuizChip';
import { fetchClassOutline } from '@/services/classOutline';
import { toChipVariant } from '@/theme/tokens';
import type {
  ClassOutlineResponse,
  OutlineExam,
  OutlineSession,
} from '@/typings/classOutline';
import { getStatusMeta } from '@/utils/statusMeta';

/**
 * Chi tiết khóa học — reskin theo ThietKe/Web/files/course-detail.html
 * (Panel info + progress + `Accordion` theo chuyên đề), giữ nguyên logic gọi
 * API/quy tắc chỉ buổi DONE mới bấm được.
 */
export default function CourseOutlinePage() {
  const { classId } = useParams<{ classId: string }>();
  const [outline, setOutline] = React.useState<
    ClassOutlineResponse | undefined
  >();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchClassOutline(Number(classId), { onlyDone: false })
      .then(setOutline)
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading || !outline) {
    return (
      <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
    );
  }

  const percent = outline.progress.totalSessions
    ? Math.round(
        (outline.progress.doneSessions / outline.progress.totalSessions) * 100,
      )
    : 0;

  return (
    <>
      <PageTitle title={outline.name} />
      <Crumb label="Khóa học" to="/courses" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          {outline.name}
        </h1>
      </div>

      <Panel style={{ marginBottom: 20 }}>
        <InfoGrid
          items={[
            { k: 'Môn', v: outline.subjectName ?? '—' },
            { k: 'Khối', v: outline.gradeLevel ?? '—' },
            { k: 'Bắt đầu', v: outline.startDate ?? '—' },
            { k: 'Kết thúc', v: outline.endDate ?? '—' },
          ]}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
            Tiến độ khóa học
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>
            {outline.progress.doneSessions}/{outline.progress.totalSessions}{' '}
            buổi
          </span>
        </div>
        <ProgressBar percent={percent} />
        {outline.progress.attendanceRate != null && (
          <div
            style={{ marginTop: 10, fontSize: 12.5, color: 'var(--ink-soft)' }}
          >
            Chuyên cần{' '}
            {outline.progress.attendanceScope === 'CLASS'
              ? '(cả lớp)'
              : '(của bạn)'}
            :{' '}
            <strong style={{ color: 'var(--ink)' }}>
              {Math.round(outline.progress.attendanceRate * 100)}%
            </strong>
          </div>
        )}
      </Panel>

      {outline.groups.map((g) => (
        <Accordion
          key={g.topicId ?? 'none'}
          title={g.topicName ?? 'Chưa phân chuyên đề'}
          icon={<BookIcon width={16} height={16} />}
        >
          {g.sessions.map((s) => (
            <SessionRow key={s.sessionId} session={s} />
          ))}
          {g.exams.length > 0 && (
            <div style={{ padding: '0 20px 16px' }}>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  marginBottom: 4,
                }}
              >
                Đề thi chung chuyên đề
              </div>
              {g.exams.map((e) => (
                <ExamRow key={e.examId} exam={e} />
              ))}
            </div>
          )}
        </Accordion>
      ))}
    </>
  );
}

function SessionRow({ session: s }: { session: OutlineSession }) {
  const clickable = s.status === 'DONE';
  const meta = getStatusMeta('session', s.status);
  return (
    <div
      style={{ padding: '16px 20px', borderTop: '1px solid var(--line-soft)' }}
    >
      <div
        onClick={
          clickable
            ? () => history.push(`/timetable/session/${s.sessionId}`)
            : undefined
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          cursor: clickable ? 'pointer' : 'default',
          opacity: clickable ? 1 : 0.75,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {s.ordinal ? `Buổi ${s.ordinal} · ` : ''}
            {s.title ?? s.date}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>
            {[s.date, s.roomName, s.teacherName].filter(Boolean).join(' · ')}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {s.onLeave && <Chip variant="gold">Đã xin nghỉ</Chip>}
          <Chip variant={toChipVariant(meta.color)}>{meta.label}</Chip>
          {clickable && <ChevronRightIcon width={14} height={14} />}
        </div>
      </div>
      {s.exams.map((e) => (
        <ExamRow key={e.examId} exam={e} />
      ))}
    </div>
  );
}

function ExamRow({ exam: e }: { exam: OutlineExam }) {
  return (
    <QuizChip
      label={e.name}
      tag={
        e.score != null
          ? `${e.score}${e.maxScore != null ? `/${e.maxScore}` : ''}`
          : (e.studentStatus ?? undefined)
      }
      tagVariant={e.score != null ? 'sage' : 'cobalt'}
    />
  );
}
