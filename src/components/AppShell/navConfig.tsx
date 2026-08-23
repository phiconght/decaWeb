import React from 'react';
import {
  BookIcon,
  CalendarIcon,
  CatalogIcon,
  FeeIcon,
  HomeIcon,
  LeaveIcon,
  PostIcon,
  QrIcon,
  ReportIcon,
  UserIcon,
} from '@/components/icons';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

interface AccessFlags {
  isTeacher: boolean;
  isParent: boolean;
  canViewCourses: boolean;
  canViewReports: boolean;
  canTeacherWork: boolean;
}

/**
 * 3 bộ nav theo vai trò — bám đúng cờ đã implement ở src/access.ts, xem
 * ThietKe/Web/PLAN_TrienKhai_WEB.md §5 (đã đối chiếu chéo, sửa lại so với
 * suy đoán ban đầu: PARENT không có "Khóa học", route không gate theo role
 * thì hiện cho cả 3 vai trò).
 */
export function getNavGroups(access: AccessFlags): NavGroup[] {
  const overview: NavItem[] = [
    { path: '/home', label: 'Trang chủ', icon: <HomeIcon /> },
    { path: '/timetable', label: 'Thời khóa biểu', icon: <CalendarIcon /> },
    { path: '/leave', label: 'Đơn nghỉ', icon: <LeaveIcon /> },
  ];
  if (access.canTeacherWork) {
    overview.push({
      path: '/teacher-work',
      label: 'Điểm danh',
      icon: <QrIcon />,
    });
  }

  const study: NavItem[] = [
    { path: '/catalog', label: 'Khám phá khóa học', icon: <CatalogIcon /> },
  ];
  if (access.canViewCourses) {
    study.push({ path: '/courses', label: 'Khóa học', icon: <BookIcon /> });
  }
  if (access.canViewReports) {
    study.push({ path: '/reports', label: 'Báo cáo', icon: <ReportIcon /> });
  }

  const finance: NavItem[] = [
    { path: '/account-fee', label: 'Tài khoản và học phí', icon: <FeeIcon /> },
  ];

  const personal: NavItem[] = [
    { path: '/posts', label: 'Bài viết', icon: <PostIcon /> },
    { path: '/account', label: 'Tài khoản', icon: <UserIcon /> },
  ];

  return [
    { label: 'Tổng quan', items: overview },
    { label: 'Học tập', items: study },
    { label: 'Tài chính', items: finance },
    { label: 'Cá nhân', items: personal },
  ];
}
