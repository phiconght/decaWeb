import { history, useAccess, useParams } from '@umijs/max';
import { Segmented } from 'antd';
import React from 'react';
import AttendanceDonut from '@/components/charts/AttendanceDonut';
import ScoreTrendChart from '@/components/charts/ScoreTrendChart';
import TopicMasteryChart from '@/components/charts/TopicMasteryChart';
import AnalysisCard from '@/components/reports/AnalysisCard';
import AssignPracticeButton from '@/components/reports/AssignPracticeButton';
import AttendanceMiniStats from '@/components/reports/AttendanceMiniStats';
import BreakdownToggle from '@/components/reports/BreakdownToggle';
import CommentsSection from '@/components/reports/CommentsSection';
import {
  ChapterCardsRow,
  RecentExamCardsRow,
  SessionCardsRow,
} from '@/components/reports/HScrollCards';
import PageTitle from '@/components/PageTitle';
import Panel from '@/components/ui/Panel';
import { fetchClassOutline } from '@/services/classOutline';
import {
  fetchBreakdowns,
  fetchExamHistory,
  fetchReportAnalysis,
  fetchScoreTrend,
  fetchStudentAttendance,
  fetchStudentClasses,
  fetchTopicMastery,
} from '@/services/report';
import type { OutlineSession } from '@/typings/classOutline';
import type {
  BreakdownResponse,
  RecentExamItem,
  ReportAnalysisResponse,
  ScoreTrendPoint,
  StudentAttendanceReport,
  StudentClassOption,
  TopicMasteryItem,
} from '@/typings/report';

type Tab = 'exams' | 'sessions' | 'chapters';

/**
 * Báo cáo 1 học viên trong 1 lớp (HS xem mình / PH xem con / GV xem 1 HV) —
 * mirror MOBILE `StudentReportView` (`reports/view/student_report_view.dart`).
 */
export default function StudentClassReportPage() {
  const { studentId, classId } = useParams<{ studentId: string; classId: string }>();
  const access = useAccess();
  const sid = Number(studentId);
  const cid = Number(classId);
  const canComment = access.isParent || access.isTeacher;

  const [classes, setClasses] = React.useState<StudentClassOption[]>([]);
  const [tab, setTab] = React.useState<Tab>('exams');
  const [loading, setLoading] = React.useState(false);

  const [exams, setExams] = React.useState<RecentExamItem[]>([]);
  const [sessions, setSessions] = React.useState<OutlineSession[]>([]);
  const [trend, setTrend] = React.useState<ScoreTrendPoint[]>([]);
  const [breakdown, setBreakdown] = React.useState<BreakdownResponse | undefined>();
  const [mastery, setMastery] = React.useState<TopicMasteryItem[]>([]);
  const [attendance, setAttendance] = React.useState<StudentAttendanceReport | undefined>();
  const [analysis, setAnalysis] = React.useState<ReportAnalysisResponse | undefined>();

  // GV mở từ 1 lớp cụ thể: chỉ hiện lớp này, tránh 403 lớp khác (mirror `fixedClass`).
  React.useEffect(() => {
    if (access.isTeacher) return;
    fetchStudentClasses(sid).then(setClasses);
  }, [sid, access.isTeacher]);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchScoreTrend(sid, cid),
      fetchBreakdowns(sid, cid),
      fetchTopicMastery(sid, cid),
      fetchStudentAttendance(sid, cid),
      fetchReportAnalysis(sid, cid),
      fetchClassOutline(cid, { studentId: sid, onlyDone: true }),
    ])
      .then(([t, b, m, att, an, outline]) => {
        setTrend(t);
        setBreakdown(b);
        setAttendance(att);
        setAnalysis(an);

        const chapterOrder = outline.groups.filter((g) => g.topicId != null).map((g) => g.topicId);
        setMastery(
          m
            .filter((x) => x.topicId != null && chapterOrder.includes(x.topicId))
            .sort((a, b2) => chapterOrder.indexOf(a.topicId) - chapterOrder.indexOf(b2.topicId)),
        );

        const flatSessions = outline.groups
          .flatMap((g) => g.sessions)
          .sort((a, b2) => b2.date.localeCompare(a.date));
        setSessions(flatSessions);
      })
      .finally(() => setLoading(false));

    fetchExamHistory(sid, cid).then((list) => {
      const sorted = [...list].sort((a, b) =>
        (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''),
      );
      setExams(sorted);
    });
  }, [sid, cid]);

  const activeClasses = access.isTeacher ? [] : classes;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageTitle title="Báo cáo" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Báo cáo</h1>
      </div>

      {loading && (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13, marginBottom: 12 }}>Đang tải…</div>
      )}

      {activeClasses.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
          {activeClasses.map((c) => (
            <div
              key={c.classId}
              onClick={() => c.classId !== cid && history.push(`/reports/${sid}/classes/${c.classId}`)}
              style={{
                flex: '0 0 auto',
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: c.classId === cid ? 'var(--cobalt)' : 'var(--card)',
                color: c.classId === cid ? '#fff' : 'var(--ink)',
                border: '1px solid var(--line)',
              }}
            >
              {c.name}
            </div>
          ))}
        </div>
      )}

      {canComment && (
        <div style={{ marginBottom: 16 }}>
          <AssignPracticeButton studentId={sid} classId={cid} scopeLabel="toàn khóa" />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel
          title={
            <Segmented
              value={tab}
              onChange={(v) => setTab(v as Tab)}
              options={[
                { label: `Bài thi (${exams.length})`, value: 'exams' },
                { label: 'Buổi học', value: 'sessions' },
                { label: 'Chương học', value: 'chapters' },
              ]}
            />
          }
        >
          {tab === 'exams' && (
            <RecentExamCardsRow
              exams={exams}
              onTap={(e) => history.push(`/reports/${sid}/classes/${cid}/exams/${e.examId}`)}
            />
          )}
          {tab === 'sessions' && (
            <SessionCardsRow
              sessions={sessions}
              onTap={(sessionId) =>
                history.push(`/reports/${sid}/classes/${cid}/sessions/${sessionId}`)
              }
            />
          )}
          {tab === 'chapters' && (
            <ChapterCardsRow
              topics={mastery}
              onTap={(topicId) => history.push(`/reports/${sid}/classes/${cid}/topics/${topicId}`)}
            />
          )}
        </Panel>

        <AnalysisCard analysis={analysis} />

        <Panel title="Xu hướng điểm trong khóa">
          <ScoreTrendChart points={trend} />
        </Panel>

        <Panel title="Tỉ lệ đúng/sai">
          <BreakdownToggle breakdown={breakdown} />
        </Panel>

        <Panel title="Nắm chắc kiến thức theo chương">
          <TopicMasteryChart items={mastery} />
        </Panel>

        <Panel title="Chuyên cần">
          {attendance && (
            <>
              <AttendanceMiniStats summary={attendance.summary} />
              <AttendanceDonut summary={attendance.summary} />
            </>
          )}
        </Panel>

        <Panel title="Nhận xét">
          <CommentsSection
            key={`cmt-${sid}-${cid}`}
            studentId={sid}
            classId={cid}
            canComment={canComment}
            showVisibilityToggle={access.isTeacher}
          />
        </Panel>
      </div>
    </div>
  );
}
