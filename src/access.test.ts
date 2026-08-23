import { describe, expect, it } from 'vitest';
import access from './access';

function withRoles(roles: string[]) {
  return access({ currentUser: { roles } });
}

describe('access', () => {
  it('STUDENT: xem khóa học, KHÔNG xem báo cáo/chấm công', () => {
    const a = withRoles(['STUDENT']);
    expect(a.isStudent).toBe(true);
    expect(a.canViewCourses).toBe(true);
    expect(a.canViewReports).toBe(false);
    expect(a.canTeacherWork).toBe(false);
  });

  it('PARENT: KHÔNG xem khóa học, xem báo cáo', () => {
    const a = withRoles(['PARENT']);
    expect(a.isParent).toBe(true);
    expect(a.canViewCourses).toBe(false);
    expect(a.canViewReports).toBe(true);
  });

  it('TEACHER: xem khóa học, báo cáo, chấm công', () => {
    const a = withRoles(['TEACHER']);
    expect(a.isTeacher).toBe(true);
    expect(a.canViewCourses).toBe(true);
    expect(a.canViewReports).toBe(true);
    expect(a.canTeacherWork).toBe(true);
    expect(a.canViewClassReport).toBe(true);
  });

  it('ADMIN/EMPLOYEE thuần: isStaffOnly = true', () => {
    const a = withRoles(['ADMIN']);
    expect(a.isStaffOnly).toBe(true);
  });

  it('không có currentUser: mọi cờ đều an toàn (false)', () => {
    const a = access(undefined);
    expect(a.isStudent).toBe(false);
    expect(a.isParent).toBe(false);
    expect(a.isTeacher).toBe(false);
    expect(a.isStaffOnly).toBe(true);
  });
});
