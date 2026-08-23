export type LeaveScope = 'SESSION' | 'RANGE';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveItem {
  id: number;
  studentId: number;
  studentName: string;
  scope: LeaveScope;
  sessionId?: number;
  sessionDate?: string;
  classId?: number;
  className?: string;
  dateFrom?: string;
  dateTo?: string;
  reason?: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  parentConfirmedBy?: string;
  parentConfirmedAt?: string;
  createdAt: string;
}

export interface CreateLeaveRequest {
  studentId: number;
  scope: LeaveScope;
  sessionId?: number;
  classId?: number;
  dateFrom?: string;
  dateTo?: string;
  reason?: string;
}
