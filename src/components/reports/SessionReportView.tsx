import { history } from '@umijs/max';
import React from 'react';
import AssignPracticeButton from '@/components/reports/AssignPracticeButton';
import BreakdownToggle from '@/components/reports/BreakdownToggle';
import SessionAnalysisCard from '@/components/reports/SessionAnalysisCard';
import PageTitle from '@/components/PageTitle';
import Panel from '@/components/ui/Panel';
import { fetchClassOutline } from '@/services/classOutline';
import {
  fetchClassSessionBreakdowns,
  fetchClassSessionExams,
  fetchSessionAnalysis,
  fetchSessionBreakdowns,
  fetchSessionExams,
} from '@/services/report';
import type { ClassOutlineResponse } from '@/typings/classOutline';
import type {
  BreakdownResponse,
  ClassExamAverageItem,
  RecentExamItem,
  SessionAnalysisResponse,
} from '@/typings/report';

/**
 * Báo cáo CẤP 3 — theo 1 buổi học. `studentId` undefined = phạm vi cả lớp
 * — mirror MOBILE `SessionReportPage` (nullable `studentId`). Dùng chung
 * cho route `/reports/:studentId/classes/:classId/sessions/:sessionId` và
 * `/reports/classes/:classId/sessions/:sessionId`.
 */
export default function SessionReportView({
  studentId,
  classId,
  sessionId,
  canAssign = false,
}: {
  studentId?: number;
  classId: number;
  sessionId: number;
  canAssign?: boolean;
}) {
  const [outline, setOutline] = React.useState<ClassOutlineResponse>();
  const [breakdown, setBreakdown] = React.useState<BreakdownResponse | undefined>();
  const [exams, setExams] = React.useState<RecentExamItem[]>([]);
  const [classExams, setClassExams] = React.useState<ClassExamAverageItem[]>([]);
  const [analysis, setAnalysis] = React.useState<SessionAnalysisResponse | undefined>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchClassOutline(classId, { studentId }),
      studentId != null
        ? fetchSessionBreakdowns(studentId, classId, sessionId)
        : fetchClassSessionBreakdowns(classId, sessionId),
      studentId != null ? fetchSessionExams(studentId, classId, sessionId) : Promise.resolve([]),
      studentId == null ? fetchClassSessionExams(classId, sessionId) : Promise.resolve([]),
      studentId != null
        ? fetchSessionAnalysis(studentId, classId, sessionId)
        : Promise.resolve(undefined),
    ])
      .then(([o, b, e, ce, an]) => {
        setOutline(o);
        setBreakdown(b);
        setExams(e);
        setClassExams(ce);
        setAnalysis(an);
      })
      .finally(() => setLoading(false));
  }, [studentId, classId, sessionId]);

  const group = outline?.groups.find((g) => g.sessions.some((s) => s.sessionId === sessionId));
  const session = group?.sessions.find((s) => s.sessionId === sessionId);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageTitle title="Chi tiết buổi học" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Chi tiết buổi học</h1>
      </div>
      {loading && (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13, marginBottom: 12 }}>Đang tải…</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {canAssign && studentId != null && (
          <AssignPracticeButton
            studentId={studentId}
            classId={classId}
            topicId={group?.topicId}
            enabled={group?.topicId != null}
            disabledReason={
              group?.topicId == null
                ? 'Buổi này chưa gán chuyên đề, không giao bài theo buổi được'
                : undefined
            }
            scopeLabel={`chương "${group?.topicName ?? '—'}" (từ buổi này)`}
          />
        )}

        {studentId != null && <SessionAnalysisCard analysis={analysis} />}

        <Panel
          title={session ? `Buổi ${session.ordinal ?? '—'}: ${session.title ?? 'Chưa đặt tên'}` : 'Buổi học'}
        >
          {session ? (
            <div style={{ fontSize: 13.5, lineHeight: 1.8 }}>
              <div>
                {new Date(session.date).toLocaleDateString('vi-VN')}
                {session.startTime ? ` ${session.startTime} - ${session.endTime ?? ''}` : ''}
              </div>
              {session.roomName && <div>Phòng: {session.roomName}</div>}
              {session.teacherName && <div>Giáo viên: {session.teacherName}</div>}
              {studentId != null && session.attendanceStatus && (
                <div>
                  Điểm danh: {session.attendanceStatus}
                  {session.onLeave ? ' (có phép)' : ''}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>
              Không tìm thấy thông tin buổi học
            </div>
          )}
        </Panel>

        <Panel title="Báo cáo theo bài thi trong buổi">
          {studentId != null ? (
            exams.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Chưa có bài đã nộp</div>
            ) : (
              exams.map((e) => (
                <div
                  key={e.examStudentId}
                  onClick={() =>
                    history.push(`/reports/${studentId}/classes/${classId}/exams/${e.examId}`)
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    fontSize: 13.5,
                    cursor: 'pointer',
                  }}
                >
                  <span>{e.examName}</span>
                  <span>{e.score?.toFixed(2) ?? '—'}</span>
                </div>
              ))
            )
          ) : classExams.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Chưa có dữ liệu</div>
          ) : (
            classExams.map((e) => (
              <div
                key={e.examId}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13.5 }}
              >
                <span>{e.examName}</span>
                <span>{e.avgScore?.toFixed(2) ?? '—'}</span>
              </div>
            ))
          )}
        </Panel>

        <Panel title="Tỉ lệ đúng/sai trong buổi">
          <BreakdownToggle breakdown={breakdown} />
        </Panel>
      </div>
    </div>
  );
}
