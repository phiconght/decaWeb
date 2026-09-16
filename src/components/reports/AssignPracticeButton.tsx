import { Button, Modal, message, Tooltip } from 'antd';
import React from 'react';
import { assignPractice } from '@/services/report';
import type { PracticeAssignmentResponse } from '@/typings/report';

/**
 * Nút "Giao bài tập" dùng chung cho cấp khóa/chương/buổi — mirror MOBILE
 * `assign_practice_button.dart`. `topicId` null = "toàn khóa" (BE tự chọn
 * chương HV đang yếu nhất).
 */
export default function AssignPracticeButton({
  studentId,
  classId,
  scopeLabel,
  topicId,
  enabled = true,
  disabledReason,
}: {
  studentId: number;
  classId: number;
  scopeLabel: string;
  topicId?: number;
  enabled?: boolean;
  disabledReason?: string;
}) {
  const [assigning, setAssigning] = React.useState(false);

  const showResult = (r: PracticeAssignmentResponse) => {
    Modal.success({
      title: 'Đã giao bài tập',
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

  const onClick = () => {
    Modal.confirm({
      title: 'Giao bài tập',
      content: `Hệ thống sẽ chọn 10 câu trong ${scopeLabel} — độ khó/dạng bài nghiêng về phần con đang yếu.`,
      okText: 'Giao bài',
      cancelText: 'Hủy',
      onOk: async () => {
        setAssigning(true);
        try {
          const r = await assignPractice(studentId, classId, { topicId });
          showResult(r);
        } catch (e) {
          message.error(e instanceof Error ? e.message : 'Không giao được bài');
        } finally {
          setAssigning(false);
        }
      },
    });
  };

  const button = (
    <Button
      type="primary"
      loading={assigning}
      disabled={!enabled}
      onClick={onClick}
    >
      Giao bài tập
    </Button>
  );
  return disabledReason && !enabled ? (
    <Tooltip title={disabledReason}>{button}</Tooltip>
  ) : (
    button
  );
}
