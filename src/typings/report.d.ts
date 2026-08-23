export interface ChildOption {
  studentId: number;
  fullName: string;
  username: string;
}

export interface DifficultyCount {
  easy: number;
  medium: number;
  hard: number;
}
export interface TypeCount {
  multipleChoice: number;
  trueFalse: number;
}

export interface PracticeAssignmentResponse {
  assignmentId: number;
  examId: number;
  examCode: string;
  examName: string;
  classId: number;
  className: string;
  topicId?: number;
  topicName?: string;
  numQuestions: number;
  durationMinutes?: number;
  byDifficulty: DifficultyCount;
  byType: TypeCount;
  deadline?: string;
  status: string;
}

export interface AttendanceMonthPoint {
  month: string;
  coMat: number;
  tre: number;
  vang: number;
  coPhep: number;
}

export interface AttendanceSummary {
  totalSessions: number;
  coMat: number;
  tre: number;
  vang: number;
  coPhep: number;
  chuaCheckin: number;
  attendanceRate?: number;
  onTimeRate?: number;
}

export interface StudentAttendanceReport {
  summary: AttendanceSummary;
  byMonth: AttendanceMonthPoint[];
}

export type ClassAttendanceReport = StudentAttendanceReport;

export interface BucketStat {
  key: string;
  correctCount: number;
  incorrectCount: number;
  ungradedCount: number;
  correctPct?: number;
}

export interface BreakdownResponse {
  byDifficulty: BucketStat[];
  byType: BucketStat[];
}

export interface RecentExamItem {
  examStudentId: number;
  examId: number;
  examCode: string;
  examName: string;
  subjectName?: string;
  classId?: number;
  className?: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
}

export interface ScoreTrendPoint {
  examId: number;
  examName: string;
  publishAt?: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  classAverage?: number;
}

export interface ScoreBand {
  index: number;
  fromScore: number;
  toScore: number;
  count: number;
  containsStudent: boolean;
}

export interface ExamScoreDistribution {
  examId?: number;
  examName?: string;
  maxScore?: number;
  bandCount: number;
  bands: ScoreBand[];
  studentScore?: number;
  studentBandIndex?: number;
  percentile?: number;
  classAverage?: number;
  median?: number;
  highest?: number;
  lowest?: number;
  rank?: number;
  submittedCount?: number;
  classSize?: number;
}

export interface ExamReportDetail {
  examId: number;
  examName: string;
  examCode: string;
  submittedAt?: string;
  score?: number;
  maxScore?: number;
  classAverage?: number;
  rank?: number;
  submittedCount?: number;
  classSize?: number;
  topicId?: number;
  topicName?: string;
  sessionId?: number;
  sessionTitle?: string;
  sessionDate?: string;
  breakdown: BreakdownResponse;
  distribution: ExamScoreDistribution;
}

export interface TopicMasteryItem {
  topicId: number;
  topicName: string;
  gradedCount: number;
  correctCount: number;
  ungradedCount: number;
  earned: number;
  max: number;
  masteryPct?: number;
}

export interface ChapterAnalysisResponse {
  chapterLabel: string;
  avgScore?: number;
  rank?: number;
  classSize?: number;
  abilityInsights: string[];
  attendanceInsight?: string;
}

export interface SessionAnalysisResponse {
  avgScore?: number;
  classAverage?: number;
  comparisonInsight?: string;
  abilityInsights: string[];
  examCount: number;
  submittedCount: number;
}

export interface ExamAnalysisResponse {
  score?: number;
  classAverage?: number;
  rank?: number;
  classSize?: number;
  comparisonInsight?: string;
  abilityInsights: string[];
}

export interface StudentClassOption {
  classId: number;
  code?: string;
  name: string;
  subjectName?: string;
  teacherNames?: string;
}

export interface ClassExamAverageItem {
  examId: number;
  examName: string;
  publishAt?: string;
  avgScore?: number;
  maxScore?: number;
  submittedCount: number;
  assignedCount: number;
}

export interface ClassStudentAverageItem {
  studentId: number;
  fullName: string;
  username: string;
  submittedCount: number;
  avgScore?: number;
  avgPct?: number;
  attendanceRate?: number;
}

export interface ChapterAnalysisItem {
  topicId?: number;
  chapterLabel: string;
  avgScore?: number;
  rank?: number;
  classSize?: number;
}

/** Bảng "Phân tích tự động" cấp toàn khóa — câu chữ đã ghép sẵn ở BE, chỉ render. */
export interface ReportAnalysisResponse {
  studentName: string;
  className: string;
  scoreSpectrumLabel?: string;
  courseAverage?: number;
  courseRank?: number;
  classSize?: number;
  chapters: ChapterAnalysisItem[];
  abilityInsights: string[];
  attendanceInsight?: string;
  teacherCommentAuthor?: string;
  teacherCommentContent?: string;
}

export interface AssignPracticeRequest {
  examId?: number;
  topicId?: number;
}

export interface CommentItem {
  id: number;
  studentId: number;
  classId: number;
  examStudentId?: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  content: string;
  visibleToStudent: boolean;
  createdAt: string;
  updatedAt?: string;
}
