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

// GET /api/v1/exams/{id}/pdf?variant=DE → tải file đề thi PDF (bản không đáp
// án — HS/PH chỉ được phép variant này, xem ExamPdfService#guardAccess ở BE).
// BE trả application/pdf khi thành công; khi lỗi trả JSON ApiResponse.fail —
// với responseType 'blob' lỗi cũng thành Blob nên PHẢI kiểm blob.type.
export async function downloadExamPdf(examId: number) {
  const res = await request<Blob>(`/api/v1/exams/${examId}/pdf`, {
    params: { variant: 'DE' },
    responseType: 'blob',
    getResponse: true,
  });
  const blob = res.data;

  if (blob.type.includes('json')) {
    const body = JSON.parse(await blob.text()) as {
      error?: { message?: string };
    };
    throw new Error(body.error?.message ?? 'Tải PDF thất bại');
  }

  const disposition: string = res.headers?.['content-disposition'] ?? '';
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  const asciiMatch = disposition.match(/filename="([^"]+)"/i);
  const filename = utf8Match
    ? decodeURIComponent(utf8Match[1])
    : (asciiMatch?.[1] ?? `De-thi_${examId}.pdf`);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
