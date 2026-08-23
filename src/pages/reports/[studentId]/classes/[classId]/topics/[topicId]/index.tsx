import { useAccess, useParams } from '@umijs/max';
import React from 'react';
import TopicReportView from '@/components/reports/TopicReportView';

export default function TopicReportPage() {
  const { studentId, classId, topicId } = useParams<{
    studentId: string;
    classId: string;
    topicId: string;
  }>();
  const access = useAccess();

  return (
    <TopicReportView
      studentId={Number(studentId)}
      classId={Number(classId)}
      topicId={Number(topicId)}
      canAssign={access.isParent || access.isTeacher}
    />
  );
}
