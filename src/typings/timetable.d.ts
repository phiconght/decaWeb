export interface TimetableQuery {
  view: 'STUDENT' | 'TEACHER' | 'ROOM' | 'PARENT';
  refId?: number;
  from: string;
  to: string;
  branchId?: number;
}

export type SessionStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export interface TimetableItem {
  sessionId: number;
  classId: number;
  className: string;
  subjectName: string;
  gradeLevel?: string;
  date: string;
  startTime: string;
  endTime: string;
  roomId?: number;
  roomName?: string;
  branchName?: string;
  teacherId?: number;
  teacherName?: string;
  status: SessionStatus;
  studentId?: number;
  studentName?: string;
  attendanceStatus?: string;
  onLeave: boolean;
  teacherAttendanceStatus?: 'DUNG_GIO' | 'VAO_TRE' | 'VANG';
  /** 'ONLINE' = HS tự bấm nút Điểm danh; 'OFFLINE' = QR xoay vòng / GV điểm danh. */
  deliveryMode?: 'ONLINE' | 'OFFLINE';
}
