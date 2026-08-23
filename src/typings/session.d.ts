export interface SessionVideoItem {
  videoId: number;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  sortOrder: number;
}

export interface ZoomLinkItem {
  id: number;
  label?: string;
  zoomUrl: string;
  meetingId?: string;
  passcode?: string;
  sortOrder: number;
}

/** GET /api/v1/exams/by-session/{sessionId} — xem WEB/PLAN.md §4.3 */
export interface SessionExamItem {
  examId: number;
  code: string;
  name: string;
  type: string;
  status: string;
  publishAt?: string;
  endAt?: string;
  durationMinutes?: number;
  studentStatus?: string;
  score?: number;
}
