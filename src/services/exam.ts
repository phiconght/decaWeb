import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type { ExamGradeResponse, ExamPaperResponse, SubmitExamRequest } from '@/typings/exam';

export async function fetchExamPaper(examId: number) {
  const res = await request<ApiResponse<ExamPaperResponse>>(`/api/v1/exams/${examId}/paper`, {
    method: 'GET',
  });
  return res.data;
}

export async function saveExamDraft(examId: number, body: SubmitExamRequest) {
  await request<ApiResponse<void>>(`/api/v1/exams/${examId}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    skipErrorHandler: true,
  });
}

export async function submitExam(examId: number, body: SubmitExamRequest) {
  const res = await request<ApiResponse<ExamGradeResponse>>(`/api/v1/exams/${examId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
  return res.data;
}
