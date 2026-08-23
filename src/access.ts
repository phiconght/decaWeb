/**
 * WEB/PLAN.md §6.3. Role-based (đơn giản hơn ADMIN vốn permission-based) vì
 * đối tượng dùng WEB chỉ có STUDENT/PARENT/TEACHER.
 *
 * Đối chiếu 16/08/2026 với MOBILE/lib/home/view/home_shell.dart._visibleTabs():
 * - PARENT không có lớp nào để xem ở tab "Khóa học" → canViewCourses: !isParent.
 * - STUDENT đã có báo cáo của mình gộp sẵn ở nơi khác (vd "Bài phụ huynh giao")
 *   nên Mobile ẩn hẳn tab "Báo cáo" cho STUDENT → canViewReports: !isStudent
 *   (quyết định 16/08/2026: khớp chính xác hành vi Mobile, xem §12 #11).
 */
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const roles: string[] = initialState?.currentUser?.roles ?? [];
  const isStudent = roles.includes('STUDENT');
  const isParent = roles.includes('PARENT');
  const isTeacher = roles.includes('TEACHER');
  const isStaffOnly = !isStudent && !isParent && !isTeacher;

  return {
    isStudent,
    isParent,
    isTeacher,
    isStaffOnly,
    canViewCourses: !isParent,
    canViewReports: !isStudent,
    canTeacherWork: isTeacher,
    canViewClassReport: isTeacher,
  };
}
