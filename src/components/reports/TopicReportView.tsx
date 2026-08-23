import { history } from '@umijs/max';
import React from 'react';
import AttendanceDonut from '@/components/charts/AttendanceDonut';
import ScoreTrendChart from '@/components/charts/ScoreTrendChart';
import AssignPracticeButton from '@/components/reports/AssignPracticeButton';
import AttendanceMiniStats from '@/components/reports/AttendanceMiniStats';
import BreakdownToggle from '@/components/reports/BreakdownToggle';
import ChapterAnalysisCard from '@/components/reports/ChapterAnalysisCard';
import { ExamCardsRow, SessionCardsRow } from '@/components/reports/HScrollCards';
import PageTitle from '@/components/PageTitle';
import Panel from '@/components/ui/Panel';
import { fetchClassOutline } from '@/services/classOutline';
import {
  fetchBreakdowns,
  fetchChapterAnalysis,
  fetchClassAttendance,
  fetchClassBreakdowns,
  fetchClassExamAverages,
  fetchScoreTrend,
  fetchStudentAttendance,
} from '@/services/report';
import type { ClassOutlineResponse, OutlineTopicGroup } from '@/typings/classOutline';
import type {
  BreakdownResponse,
  ChapterAnalysisResponse,
  ClassExamAverageItem,
  ScoreTrendPoint,
  StudentAttendanceReport,
} from '@/typings/report';

/**
 * Báo cáo CẤP 2 — theo 1 chương. `studentId` undefined = phạm vi cả lớp
 * (GV xem) — mirror MOBILE `ChapterReportPage` (nullable `studentId`).
 * Dùng chung cho route `/reports/:studentId/classes/:classId/topics/:topicId`
 * và `/reports/classes/:classId/topics/:topicId`.
 */
export default function TopicReportView({
  studentId,
  classId,
  topicId,
  canAssign = false,
}: {
  studentId?: number;
  classId: number;
  topicId: number;
  canAssign?: boolean;
}) {
  const [outline, setOutline] = React.useState<ClassOutlineResponse>();
  const [breakdown, setBreakdown] = React.useState<BreakdownResponse | undefined>();
  const [attendance, setAttendance] = React.useState<StudentAttendanceReport | undefined>();
  const [trend, setTrend] = React.useState<ScoreTrendPoint[]>([]);
  const [classExams, setClassExams] = React.useState<ClassExamAverageItem[]>([]);
  const [analysis, setAnalysis] = React.useState<ChapterAnalysisResponse | undefined>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchClassOutline(classId, { studentId }),
      studentId != null
        ? fetchBreakdowns(studentId, classId, topicId)
        : fetchClassBreakdowns(classId, topicId),
      studentId != null
        ? fetchStudentAttendance(studentId, classId, topicId)
        : fetchClassAttendance(classId, topicId),
      studentId != null ? fetchScoreTrend(studentId, classId, topicId) : Promise.resolve([]),
      studentId == null ? fetchClassExamAverages(classId, topicId) : Promise.resolve([]),
      studentId != null ? fetchChapterAnalysis(studentId, classId, topicId) : Promise.resolve(undefined),
    ])
      .then(([o, b, att, t, ce, an]) => {
        setOutline(o);
        setBreakdown(b);
        setAttendance(att);
        setTrend(t);
        setClassExams(ce);
        setAnalysis(an);
      })
      .finally(() => setLoading(false));
  }, [studentId, classId, topicId]);

  const group: OutlineTopicGroup | undefined = outline?.groups.find((g) => g.topicId === topicId);
  const topicName = group?.topicName ?? 'Chương';

  const sessionsHref = (sessionId: number) =>
    studentId != null
      ? `/reports/${studentId}/classes/${classId}/sessions/${sessionId}`
      : `/reports/classes/${classId}/sessions/${sessionId}`;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageTitle title={`Chương: ${topicName}`} />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Chương: {topicName}</h1>
      </div>
      {loading && (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13, marginBottom: 12 }}>Đang tải…</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {canAssign && studentId != null && (
          <AssignPracticeButton
            studentId={studentId}
            classId={classId}
            topicId={topicId}
            scopeLabel={`chương "${topicName}"`}
          />
        )}

        {studentId != null && <ChapterAnalysisCard analysis={analysis} />}

        {studentId != null ? (
          <Panel title="Xu hướng điểm trong chương">
            <ScoreTrendChart points={trend} />
          </Panel>
        ) : (
          <Panel title="Điểm TB lớp qua các đề trong chương">
            {classExams.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Chưa có dữ liệu</div>
            ) : (
              classExams.map((e) => (
                <div
                  key={e.examId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    fontSize: 13.5,
                  }}
                >
                  <span>{e.examName}</span>
                  <span>{e.avgScore?.toFixed(2) ?? '—'}</span>
                </div>
              ))
            )}
          </Panel>
        )}

        <Panel title="Tỉ lệ đúng/sai trong chương">
          <BreakdownToggle breakdown={breakdown} />
        </Panel>

        <Panel title="Chuyên cần trong chương">
          {attendance && (
            <>
              <AttendanceMiniStats summary={attendance.summary} />
              <AttendanceDonut summary={attendance.summary} />
            </>
          )}
        </Panel>

        <Panel title="Báo cáo theo buổi học">
          <SessionCardsRow
            sessions={group?.sessions ?? []}
            onTap={(sessionId) => history.push(sessionsHref(sessionId))}
          />
        </Panel>

        {studentId != null && (
          <Panel title="Báo cáo theo bài thi trong chương">
            <ExamCardsRow
              exams={group?.exams ?? []}
              onTap={(e) =>
                history.push(`/reports/${studentId}/classes/${classId}/exams/${e.examId}`)
              }
            />
          </Panel>
        )}
      </div>
    </div>
  );
}
