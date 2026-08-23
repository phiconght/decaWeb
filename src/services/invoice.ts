import { request } from '@umijs/max';
import type { ApiResponse } from '@/typings/common';
import type { InvoiceQrResponse, MyInvoiceItem } from '@/typings/invoice';

/** GET /invoices/my?studentId= — studentId BẮT BUỘC (kể cả STUDENT tự xem, xác nhận 16/08/2026). */
export async function fetchMyInvoices(studentId: number) {
  const res = await request<ApiResponse<MyInvoiceItem[]>>('/api/v1/invoices/my', {
    method: 'GET',
    params: { studentId },
  });
  return res.data;
}

export async function fetchInvoiceQr(invoiceId: number) {
  const res = await request<ApiResponse<InvoiceQrResponse>>(`/api/v1/invoices/${invoiceId}/qr`, {
    method: 'GET',
  });
  return res.data;
}
