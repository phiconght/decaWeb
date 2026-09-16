import { useParams } from '@umijs/max';
import React from 'react';
import TopicReportView from '@/components/reports/TopicReportView';

/** GV xem báo cáo 1 chương ở phạm vi cả lớp (không gắn 1 HV cụ thể). */
export default function ClassTopicReportPage() {
  const { classId, topicId } = useParams<{
    classId: string;
    topicId: string;
  }>();
  return (
    <TopicReportView classId={Number(classId)} topicId={Number(topicId)} />
  );
}
