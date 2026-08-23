import { Line } from '@ant-design/plots';
import { history, useParams } from '@umijs/max';
import { Empty, Select } from 'antd';
import React from 'react';
import AttendanceDonut from '@/components/charts/AttendanceDonut';
import BreakdownChart from '@/components/charts/BreakdownChart';
import { DIFFICULTY_LABEL, REPORT_COLORS } from '@/components/charts/colors';
import TopicMasteryChart from '@/components/charts/TopicMasteryChart';
import CourseScoreSpectrum from '@/components/reports/CourseScoreSpectrum';
import ScoreDistributionChart from '@/components/reports/ScoreDistributionChart';
import PageTitle from '@/components/PageTitle';
import EmptyState from '@/components/ui/EmptyState';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import Panel from '@/components/ui/Panel';
import {
  fetchClassAttendance,
  fetchClassBreakdowns,
  fetchClassCourseScoreDistribution,
  fetchClassExamAverages,
  fetchClassExamScoreDistribution,
  fetchClassStudents,
  fetchClassTopicMastery,
} from '@/services/report';
import type {
  BreakdownResponse,
  ClassAttendanceReport,
  ClassExamAverageItem,
  ClassStudentAverageItem,
  ExamScoreDistribution,
  TopicMasteryItem,
} from '@/typings/report';

/**
 * Báo cáo cả lớp cho GV — mirror MOBILE `ClassReportPage`
 * (`reports/view/class_report_page.dart`), 7 mục theo đúng thứ tự.
 */
export default function TeacherClassReportPage() {
  const { classId } = useParams<{ classId: string }>();
  const cid = Number(classId);

  const [averages, setAverages] = React.useState<ClassExamAverageItem[]>([]);
  const [breakdown, setBreakdown] = React.useState<BreakdownResponse | undefined>();
  const [mastery, setMastery] = React.useState<TopicMasteryItem[]>([]);
  const [attendance, setAttendance] = React.useState<ClassAttendanceReport | undefined>();
  const [students, setStudents] = React.useState<ClassStudentAverageItem[]>([]);
  const [spectrum, setSpectrum] = React.useState<ExamScoreDistribution | undefined>();
  const [loading, setLoading] = React.useState(false);

  const [distExamId, setDistExamId] = React.useState<number>();
  const [distribution, setDistribution] = React.useState<ExamScoreDistribution | undefined>();

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchClassExamAverages(cid),
      fetchClassBreakdowns(cid),
      fetchClassTopicMastery(cid),
      fetchClassAttendance(cid),
      fetchClassStudents(cid),
      fetchClassCourseScoreDistribution(cid),
    ])
      .then(([a, b, m, att, s, spec]) => {
        setAverages(a);
        setBreakdown(b);
        setMastery(m);
        setAttendance(att);
        setStudents(s);
        setSpectrum(spec);
        if (a.length > 0) setDistExamId(a[0].examId);
      })
      .finally(() => setLoading(false));
  }, [cid]);

  React.useEffect(() => {
    if (distExamId == null) return;
    fetchClassExamScoreDistribution(cid, distExamId).then(setDistribution);
  }, [cid, distExamId]);

  const avgRows = averages
    .filter((a) => a.avgScore != null && a.maxScore)
    .map((a) => ({
      exam: a.examName,
      value: Math.round(((a.avgScore as number) / (a.maxScore as number)) * 1000) / 10,
    }));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageTitle title="Báo cáo cả lớp" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Báo cáo cả lớp</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Điểm TB lớp qua các đề">
          {avgRows.length === 0 ? (
            <Empty description="Chưa có dữ liệu" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Line
              height={220}
              data={avgRows}
              xField="exam"
              yField="value"
              shapeField="smooth"
              scale={{ y: { domainMin: 0, domainMax: 100 } }}
              style={{ stroke: REPORT_COLORS.self }}
              axis={{ x: { title: false }, y: { title: '%' } }}
              tooltip={{ channel: 'y', valueFormatter: (v: number) => `${v}%` }}
            />
          )}
        </Panel>

        <Panel title="Đúng/sai cả lớp theo độ khó">
          <BreakdownChart buckets={breakdown?.byDifficulty ?? []} labelMap={DIFFICULTY_LABEL} />
        </Panel>

        <Panel title="Phổ điểm toàn khóa (điểm TB HV)">
          <CourseScoreSpectrum data={spectrum} />
        </Panel>

        <Panel title="Phổ điểm theo bài thi">
          {averages.length > 0 && (
            <Select
              style={{ width: '100%', marginBottom: 12 }}
              value={distExamId}
              onChange={setDistExamId}
              options={averages.map((a) => ({ value: a.examId, label: a.examName }))}
            />
          )}
          <ScoreDistributionChart data={distribution} />
        </Panel>

        <Panel title="Nắm chắc kiến thức theo chương (cả lớp)">
          <TopicMasteryChart items={mastery} />
          <div style={{ marginTop: 12 }}>
            {mastery
              .filter((t) => t.topicId != null)
              .map((t) => (
                <div
                  key={t.topicId}
                  onClick={() => history.push(`/reports/classes/${cid}/topics/${t.topicId}`)}
                  style={{
                    padding: '10px 4px',
                    borderBottom: '1px solid var(--line-soft)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13.5,
                  }}
                >
                  <span>{t.topicName}</span>
                  <span style={{ color: 'var(--ink-faint)' }}>›</span>
                </div>
              ))}
          </div>
        </Panel>

        <Panel title="Chuyên cần cả lớp">
          {attendance && <AttendanceDonut summary={attendance.summary} />}
        </Panel>

        <ListCard title="Danh sách học viên">
          {students.length === 0 && !loading ? (
            <EmptyState title="Chưa có học viên" />
          ) : (
            students.map((s) => (
              <ListRow
                key={s.studentId}
                title={s.fullName}
                subtitle={`Điểm TB: ${s.avgScore?.toFixed(2) ?? '—'} · Nộp: ${
                  s.submittedCount
                } · Chuyên cần: ${
                  s.attendanceRate != null ? `${Math.round(s.attendanceRate * 100)}%` : '—'
                }`}
                onClick={() => history.push(`/reports/${s.studentId}/classes/${cid}`)}
              />
            ))
          )}
        </ListCard>
      </div>
    </div>
  );
}
