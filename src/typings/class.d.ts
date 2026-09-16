/** GET /api/v1/classes/catalog — danh mục TOÀN HỆ THỐNG (đồng bộ với Mobile). */
export interface ClassCatalogItem {
  id: number;
  code: string;
  name: string;
  subjectName: string;
  gradeLevel: string;
  status: string;
  startDate?: string;
  endDate?: string;
  pricePerSession?: number;
  coinPrice?: number;
  /** Giá trọn gói đăng ký bằng chuyển khoản (khác coinPrice) — undefined = chưa mở đăng ký kiểu này. */
  fullPrice?: number;
  paymentType?: 'PREPAID_COIN' | 'POSTPAID_TRANSFER';
  deliveryMode?: 'ONLINE' | 'OFFLINE';
  enrolled: boolean;
  teacherNames: string[];
  coverImageUrl?: string;
}

/** POST /api/v1/classes/{id}/enroll — kết quả HS tự đăng ký bằng Xu. */
export interface EnrollResponse {
  classId: number;
  className: string;
  coinSpent: number;
  newBalance: number;
}

/** GET /api/v1/classes/{id}/public — trang chi tiết khóa học công khai. */
export interface ClassPublicDetail {
  id: number;
  code: string;
  name: string;
  subjectName: string;
  gradeLevel: string;
  status: string;
  startDate?: string;
  endDate?: string;
  pricePerSession?: number;
  coinPrice?: number;
  fullPrice?: number;
  paymentType: 'PREPAID_COIN' | 'POSTPAID_TRANSFER';
  deliveryMode: 'ONLINE' | 'OFFLINE';
  teacherNames: string[];
  /** Tiêu đề hiển thị — undefined = FE tự dùng `name` ở trên. */
  title?: string;
  coverImageUrl?: string;
  contentMd?: string;
  /** HS đang xem đã ở trong lớp chưa — ẩn nút Đăng ký khi đã có rồi. */
  enrolled: boolean;
}

/** POST/GET /api/v1/classes/{id}/register(/my) — đăng ký chuyển khoản thủ công. */
export interface RegistrationResponse {
  id: number;
  classId: number;
  className: string;
  amount: number;
  registrationCode: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  qrPayload: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}
