import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type {
  AssignPracticeRequest,
  BreakdownResponse,
  ChapterAnalysisResponse,
  ChildOption,
  ClassAttendanceReport,
  ClassExamAverageItem,
  ClassStudentAverageItem,
  CommentItem,
  ExamAnalysisResponse,
  ExamReportDetail,
  ExamScoreDistribution,
  PracticeAssignmentResponse,
  RecentExamItem,
  ReportAnalysisResponse,
  ScoreTrendPoint,
  SessionAnalysisResponse,
  StudentAttendanceReport,
  StudentClassOption,
  TopicMasteryItem,
} from '@/typings/report';

const base = '/api/v1/reports';

async function get<T>(path: string, params?: Record<string, unknown>) {
  const res = await request<ApiResponse<T>>(`${base}${path}`, { method: 'GET', params });
  return res.data;
}

async function post<T>(path: string, data?: unknown) {
  const res = await request<ApiResponse<T>>(`${base}${path}`, { method: 'POST', data });
  return res.data;
}

export const fetchMyChildren = () => get<ChildOption[]>('/my-children');

export const fetchStudentClasses = (studentId: number) =>
  get<StudentClassOption[]>(`/students/${studentId}/classes`);

/** GET /reports/my-classes — tự scope theo STUDENT đang đăng nhập, không cần biết id của mình. */
export const fetchMyReportClasses = () => get<StudentClassOption[]>('/my-classes');

export const fetchPracticeAssignments = (studentId: number) =>
  get<PracticeAssignmentResponse[]>(`/students/${studentId}/practice-assignments`);

export const fetchRecentExams = (studentId: number, limit?: number) =>
  get<RecentExamItem[]>(`/students/${studentId}/recent-exams`, { limit });

export const fetchExamHistory = (studentId: number, classId: number) =>
  get<RecentExamItem[]>(`/students/${studentId}/exam-history`, { classId });

export const fetchExamReportDetail = (studentId: number, examId: number, classId?: number) =>
  get<ExamReportDetail>(`/students/${studentId}/exams/${examId}`, { classId });

export const fetchScoreTrend = (studentId: number, classId: number, topicId?: number) =>
  get<ScoreTrendPoint[]>(`/students/${studentId}/classes/${classId}/score-trend`, { topicId });

export const fetchBreakdowns = (studentId: number, classId: number, topicId?: number) =>
  get<BreakdownResponse>(`/students/${studentId}/classes/${classId}/breakdowns`, { topicId });

export const fetchExamScoreDistribution = (
  studentId: number,
  examId: number,
  classId?: number,
  bandCount?: number,
) =>
  get<ExamScoreDistribution>(`/students/${studentId}/exams/${examId}/score-distribution`, {
    classId,
    bandCount,
  });

/** Phổ điểm toàn khóa (điểm TB HV) — cấp học viên, không phải cấp lớp dù tên hàm cũ gợi ý vậy. */
export const fetchCourseScoreDistribution = (studentId: number, classId: number, bandCount?: number) =>
  get<ExamScoreDistribution>(`/students/${studentId}/classes/${classId}/score-distribution`, {
    bandCount,
  });

export const fetchChapterAnalysis = (studentId: number, classId: number, topicId: number) =>
  get<ChapterAnalysisResponse>(`/students/${studentId}/classes/${classId}/topics/${topicId}/analysis`);

export const fetchSessionAnalysis = (studentId: number, classId: number, sessionId: number) =>
  get<SessionAnalysisResponse>(
    `/students/${studentId}/classes/${classId}/sessions/${sessionId}/analysis`,
  );

/** Bảng "Phân tích tự động" cấp toàn khóa — đầu báo cáo cá nhân. */
export const fetchReportAnalysis = (studentId: number, classId: number) =>
  get<ReportAnalysisResponse>(`/students/${studentId}/classes/${classId}/analysis`);

export const fetchExamAnalysis = (studentId: number, examId: number, classId?: number) =>
  get<ExamAnalysisResponse>(`/students/${studentId}/exams/${examId}/analysis`, { classId });

export const fetchTopicMastery = (studentId: number, classId: number) =>
  get<TopicMasteryItem[]>(`/students/${studentId}/classes/${classId}/topic-mastery`);

export const fetchStudentAttendance = (studentId: number, classId: number, topicId?: number) =>
  get<StudentAttendanceReport>(`/students/${studentId}/classes/${classId}/attendance`, { topicId });

export const fetchSessionExams = (studentId: number, classId: number, sessionId: number) =>
  get<RecentExamItem[]>(`/students/${studentId}/classes/${classId}/sessions/${sessionId}/exams`);

export const fetchSessionBreakdowns = (studentId: number, classId: number, sessionId: number) =>
  get<BreakdownResponse>(
    `/students/${studentId}/classes/${classId}/sessions/${sessionId}/breakdowns`,
  );

// ChapterAnalysisItem[] không có riêng — dùng chung shape với ChapterAnalysisResponse ở nơi gọi.
export const fetchClassExamAverages = (classId: number, topicId?: number) =>
  get<ClassExamAverageItem[]>(`/classes/${classId}/exam-averages`, { topicId });

export const fetchClassAttendance = (classId: number, topicId?: number) =>
  get<ClassAttendanceReport>(`/classes/${classId}/attendance`, { topicId });

export const fetchClassStudents = (classId: number) =>
  get<ClassStudentAverageItem[]>(`/classes/${classId}/students`);

export const fetchComments = (params: {
  studentId?: number;
  classId?: number;
  examStudentId?: number;
}) => get<CommentItem[]>('/comments', params);

export const addComment = (payload: {
  studentId: number;
  classId: number;
  content: string;
  visibleToStudent: boolean;
}) => post<void>('/comments', payload);

export const assignPractice = (studentId: number, classId: number, payload?: AssignPracticeRequest) =>
  post<PracticeAssignmentResponse>(
    `/students/${studentId}/classes/${classId}/assign-practice`,
    payload,
  );

// ---- Cấp lớp (GV xem cả lớp) — mirror hệ hàm student ở trên ----

export const fetchClassBreakdowns = (classId: number, topicId?: number) =>
  get<BreakdownResponse>(`/classes/${classId}/breakdowns`, { topicId });

export const fetchClassTopicMastery = (classId: number) =>
  get<TopicMasteryItem[]>(`/classes/${classId}/topic-mastery`);

export const fetchClassSessionExams = (classId: number, sessionId: number) =>
  get<ClassExamAverageItem[]>(`/classes/${classId}/sessions/${sessionId}/exams`);

export const fetchClassSessionBreakdowns = (classId: number, sessionId: number) =>
  get<BreakdownResponse>(`/classes/${classId}/sessions/${sessionId}/breakdowns`);

export const fetchClassExamScoreDistribution = (classId: number, examId: number) =>
  get<ExamScoreDistribution>(`/classes/${classId}/exams/${examId}/score-distribution`);

export const fetchClassCourseScoreDistribution = (classId: number, bandCount?: number) =>
  get<ExamScoreDistribution>(`/classes/${classId}/score-distribution`, { bandCount });
