import { useAccess, useParams } from '@umijs/max';
import { Button, Modal, message, Select, Tooltip } from 'antd';
import React from 'react';
import BreakdownChart from '@/components/charts/BreakdownChart';
import { DIFFICULTY_LABEL, TYPE_LABEL } from '@/components/charts/colors';
import PageTitle from '@/components/PageTitle';
import ExamAnalysisCard from '@/components/reports/ExamAnalysisCard';
import Chip from '@/components/ui/Chip';
import InfoGrid from '@/components/ui/InfoGrid';
import Panel from '@/components/ui/Panel';
import {
  assignPractice,
  fetchExamAnalysis,
  fetchExamReportDetail,
  fetchTopicMastery,
} from '@/services/report';
import type {
  ExamAnalysisResponse,
  ExamReportDetail,
  PracticeAssignmentResponse,
  TopicMasteryItem,
} from '@/typings/report';

const WHOLE_COURSE = -1;

/**
 * Chi tiết 1 bài thi — mirror MOBILE `StudentExamDetailPage`. Không hiện
 * `ScoreDistributionChart`/"Phổ điểm của lớp" (khớp As-built 13/08/2026).
 */
export default function ExamReportPage() {
  const { studentId, examId, classId } = useParams<{
    studentId: string;
    examId: string;
    classId: string;
  }>();
  const access = useAccess();
  const sid = Number(studentId);
  const eid = Number(examId);
  const cid = Number(classId);
  const canAssign = access.isParent;

  const [data, setData] = React.useState<ExamReportDetail | undefined>();
  const [analysis, setAnalysis] = React.useState<
    ExamAnalysisResponse | undefined
  >();
  const [topics, setTopics] = React.useState<TopicMasteryItem[]>([]);
  const [assignTopicId, setAssignTopicId] = React.useState<number>();
  const [initialized, setInitialized] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchExamReportDetail(sid, eid, cid)
      .then(setData)
      .finally(() => setLoading(false));
    fetchExamAnalysis(sid, eid, cid).then(setAnalysis);
    if (canAssign) fetchTopicMastery(sid, cid).then(setTopics);
  }, [sid, eid, cid, canAssign]);

  React.useEffect(() => {
    if (data && !initialized) {
      setInitialized(true);
      setAssignTopicId(data.topicId);
    }
  }, [data, initialized]);

  if (!data) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {loading ? (
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
            Đang tải…
          </div>
        ) : (
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
            Không tải được chi tiết bài thi
          </div>
        )}
      </div>
    );
  }

  const seen = new Set<number>();
  const topicOptions: { value: number; label: string }[] = [
    { value: WHOLE_COURSE, label: 'Toàn khóa' },
  ];
  const addTopic = (id?: number, name?: string) => {
    if (id != null && !seen.has(id)) {
      seen.add(id);
      topicOptions.push({ value: id, label: name ?? 'Chương' });
    }
  };
  addTopic(data.topicId, data.topicName);
  for (const t of topics) addTopic(t.topicId, t.topicName);
  const currentAssignValue =
    assignTopicId != null && seen.has(assignTopicId)
      ? assignTopicId
      : WHOLE_COURSE;

  const showResult = (r: PracticeAssignmentResponse) => {
    Modal.success({
      title: 'Đã giao bài luyện tập',
      content: (
        <div>
          <div style={{ fontWeight: 700 }}>{r.examName}</div>
          <div>Chuyên đề: {r.topicName ?? '—'}</div>
          <div>
            Số câu: {r.numQuestions} — Dễ {r.byDifficulty.easy}/TB{' '}
            {r.byDifficulty.medium}/Khó {r.byDifficulty.hard}
          </div>
          <div>
            Dạng: TN {r.byType.multipleChoice}/ĐS {r.byType.trueFalse}
          </div>
          {r.deadline && (
            <div>Hạn: {new Date(r.deadline).toLocaleDateString('vi-VN')}</div>
          )}
        </div>
      ),
    });
  };

  const assign = () => {
    if (assignTopicId == null) return;
    const topicName =
      topicOptions.find((t) => t.value === assignTopicId)?.label ?? 'Chương';
    Modal.confirm({
      title: 'Giao bài cho con',
      content: `Hệ thống chọn 10 bài chương "${topicName}" — độ khó/dạng bài nghiêng về phần con đang yếu (số liệu đang hiển thị).`,
      okText: 'Giao bài',
      cancelText: 'Hủy',
      onOk: async () => {
        setAssigning(true);
        try {
          const r = await assignPractice(sid, cid, {
            examId: eid,
            topicId: assignTopicId,
          });
          showResult(r);
        } catch (e) {
          message.error(e instanceof Error ? e.message : 'Không giao được bài');
        } finally {
          setAssigning(false);
        }
      },
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageTitle title={data.examName} />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
          {data.examName}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(data.topicName || data.sessionTitle) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {data.topicName && (
              <Chip variant="cobalt">Chương: {data.topicName}</Chip>
            )}
            {data.sessionTitle && (
              <Chip variant="neutral">
                Buổi: {data.sessionTitle}
                {data.sessionDate
                  ? ` (${new Date(data.sessionDate).toLocaleDateString('vi-VN')})`
                  : ''}
              </Chip>
            )}
          </div>
        )}

        <ExamAnalysisCard analysis={analysis} />

        <Panel>
          <InfoGrid
            columns={3}
            items={[
              { k: 'Điểm', v: data.score?.toFixed(2) ?? '—' },
              { k: 'TB lớp', v: data.classAverage?.toFixed(2) ?? '—' },
              {
                k: 'Xếp hạng',
                v:
                  data.rank != null
                    ? `${data.rank}/${data.submittedCount ?? '—'}`
                    : '—',
              },
            ]}
          />
        </Panel>

        {canAssign && (
          <Panel title="Chương giao bài">
            <Select
              style={{ width: '100%' }}
              value={currentAssignValue}
              onChange={(v) =>
                setAssignTopicId(v === WHOLE_COURSE ? undefined : v)
              }
              options={topicOptions}
            />
            <div style={{ marginTop: 12 }}>
              {assignTopicId == null ? (
                <Tooltip title="Chọn 1 chương để giao bài">
                  <Button disabled>Giao bài cho con</Button>
                </Tooltip>
              ) : (
                <Button type="primary" loading={assigning} onClick={assign}>
                  Giao bài cho con
                </Button>
              )}
            </div>
          </Panel>
        )}

        <Panel title="Năng lực bài thi (chỉ đề này) — độ khó">
          <BreakdownChart
            buckets={data.breakdown.byDifficulty}
            labelMap={DIFFICULTY_LABEL}
          />
        </Panel>
        <Panel title="Năng lực bài thi (chỉ đề này) — loại câu">
          <BreakdownChart
            buckets={data.breakdown.byType}
            labelMap={TYPE_LABEL}
          />
        </Panel>
      </div>
    </div>
  );
}
