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
  enrolled: boolean;
  teacherNames: string[];
}

/** POST /api/v1/classes/{id}/enroll — kết quả HS tự đăng ký bằng Xu. */
export interface EnrollResponse {
  classId: number;
  className: string;
  coinSpent: number;
  newBalance: number;
}
