import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type {
  SessionExamItem,
  SessionVideoItem,
  ZoomLinkItem,
} from '@/typings/session';

export async function fetchSessionVideos(sessionId: number) {
  const res = await request<ApiResponse<SessionVideoItem[]>>(
    `/api/v1/sessions/${sessionId}/videos`,
    { method: 'GET' },
  );
  return res.data;
}

export async function fetchSessionZoomLinks(sessionId: number) {
  const res = await request<ApiResponse<ZoomLinkItem[]>>(
    `/api/v1/sessions/${sessionId}/zoom-links`,
    { method: 'GET' },
  );
  return res.data;
}

export async function fetchSessionExams(sessionId: number) {
  const res = await request<ApiResponse<SessionExamItem[]>>(
    `/api/v1/exams/by-session/${sessionId}`,
    { method: 'GET' },
  );
  return res.data;
}
