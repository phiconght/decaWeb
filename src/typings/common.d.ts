export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
  timestamp?: string;
}

/** GET /posts, /notifications/me, /leaves, /coins/.../transactions, /messages/me — PHẲNG, không bọc ApiResponse */
export interface FlatPageResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  error?: ApiError;
  timestamp?: string;
}
