export interface ClassListItem {
  id: number;
  code?: string;
  name: string;
  subjectId?: number;
  subjectName?: string;
  gradeLevel?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  studentCount: number;
  examCount: number;
  teachers: { id: number; username: string; fullName: string }[];
}

export interface OutlineProgress {
  totalSessions: number;
  doneSessions: number;
  attendanceRate?: number;
  attendanceScope?: 'STUDENT' | 'CLASS';
}

export interface OutlineExam {
  examId: number;
  code?: string;
  name: string;
  type?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  publishAt?: string;
  endAt?: string;
  durationMinutes?: number;
  studentStatus?: string;
  score?: number;
  maxScore?: number;
}

export interface OutlineSession {
  sessionId: number;
  ordinal?: number;
  title?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  roomName?: string;
  teacherName?: string;
  status: string;
  cancelReason?: string;
  attendanceStatus?: string;
  onLeave: boolean;
  materialCount: number;
  exams: OutlineExam[];
}

export interface OutlineTopicGroup {
  topicId?: number;
  topicName?: string;
  sortOrder?: number;
  sessions: OutlineSession[];
  exams: OutlineExam[];
}

export interface ClassOutlineResponse {
  classId: number;
  code?: string;
  name: string;
  subjectName?: string;
  gradeLevel?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  progress: OutlineProgress;
  groups: OutlineTopicGroup[];
}

export interface ClassOutlineQuery {
  studentId?: number;
  onlyDone?: boolean;
}
