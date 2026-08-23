import { useAccess, useParams } from '@umijs/max';
import React from 'react';
import SessionReportView from '@/components/reports/SessionReportView';

export default function SessionReportPage() {
  const { studentId, classId, sessionId } = useParams<{
    studentId: string;
    classId: string;
    sessionId: string;
  }>();
  const access = useAccess();

  return (
    <SessionReportView
      studentId={Number(studentId)}
      classId={Number(classId)}
      sessionId={Number(sessionId)}
      canAssign={access.isParent || access.isTeacher}
    />
  );
}
