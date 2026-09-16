import { useParams } from '@umijs/max';
import React from 'react';
import SessionReportView from '@/components/reports/SessionReportView';

/** GV xem báo cáo 1 buổi học ở phạm vi cả lớp (không gắn 1 HV cụ thể). */
export default function ClassSessionReportPage() {
  const { classId, sessionId } = useParams<{
    classId: string;
    sessionId: string;
  }>();
  return (
    <SessionReportView
      classId={Number(classId)}
      sessionId={Number(sessionId)}
    />
  );
}
