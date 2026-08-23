export interface TeacherAttendanceView {
  sessionId: number;
  teacherId: number;
  teacherName: string;
  status: 'CHUA_CHAM' | 'DUNG_GIO' | 'VAO_TRE' | 'VANG';
  checkInAt?: string;
  checkOutAt?: string;
  note?: string;
}

export interface TeacherWorkItem {
  sessionId: number;
  date: string;
  startTime: string;
  endTime: string;
  className: string;
  roomName?: string;
  durationMinutes?: number;
  status: 'CHUA_CHAM' | 'DUNG_GIO' | 'VAO_TRE' | 'VANG';
  checkInAt?: string;
  checkOutAt?: string;
  note?: string;
}

export interface TeacherWorkSummary {
  totalSessions: number;
  dungGio: number;
  vaoTre: number;
  vang: number;
  chuaCham: number;
  totalTaughtMinutes: number;
}

export interface TeacherWorkReport {
  summary: TeacherWorkSummary;
  items: TeacherWorkItem[];
}
