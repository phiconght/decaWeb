export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'PAID' | 'CANCELLED';

export interface MyInvoiceItem {
  id: number;
  studentId: number;
  classId: number;
  className: string;
  periodFrom: string;
  periodTo: string;
  sessionCount: number;
  amount: number;
  status: InvoiceStatus;
  paidAt?: string;
}

export interface InvoiceQrResponse {
  qrPayload: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  paymentCode: string;
}
