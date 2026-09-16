import { useAccess, useModel, useParams } from '@umijs/max';
import React from 'react';
import {
  BookIcon,
  CalendarIcon,
  MonitorIcon,
  PinIcon,
  UserIcon,
} from '@/components/icons';
import MathPreview from '@/components/MathPreview';
import PageTitle from '@/components/PageTitle';
import RegisterPanel from '@/components/RegisterPanel';
import Chip from '@/components/ui/Chip';
import Crumb from '@/components/ui/Crumb';
import EmptyState from '@/components/ui/EmptyState';
import { fetchClassPublicDetail } from '@/services/classCatalog';
import type { ClassPublicDetail } from '@/typings/class';

/**
 * Trang chi tiết khóa học (marketing, công khai) — bấm vào Card ở Trang chủ
 * hoặc Khám phá khóa học mở ra. Khác hẳn `courses/[classId]` (dành cho HS đã
 * ghi danh xem nội dung buổi học/đề thi) — trang này chỉ giới thiệu + đăng
 * ký, ai cũng xem được kể cả khách chưa đăng nhập.
 */
export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const isGuest = !initialState?.currentUser;
  const hotline = initialState?.appSettings?.supportHotline;

  const [klass, setKlass] = React.useState<ClassPublicDetail | undefined>();
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchClassPublicDetail(classId)
      .then(setKlass)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) {
    return (
      <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
    );
  }

  if (notFound || !klass) {
    return (
      <EmptyState
        title="Không tìm thấy khóa học"
        description="Khóa học có thể đã tạm đóng hoặc không còn tồn tại."
      />
    );
  }

  const title = klass.title || klass.name;

  return (
    <>
      <PageTitle title={title} />
      <Crumb label="Khám phá khóa học" to="/catalog" />

      <div className="course-detail-grid">
        <div>
          <div
            style={{
              height: 220,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: klass.coverImageUrl
                ? undefined
                : 'linear-gradient(150deg,#2E43E8,#5B6CFF)',
            }}
          >
            {klass.coverImageUrl ? (
              <img
                src={klass.coverImageUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <BookIcon
                width={64}
                height={64}
                stroke="#fff"
                style={{ opacity: 0.85 }}
              />
            )}
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>
            {title}
          </h1>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 18px',
              fontSize: 12.5,
              color: 'var(--ink-soft)',
              marginBottom: 18,
            }}
          >
            {klass.teacherNames.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <UserIcon
                  width={14}
                  height={14}
                  style={{ color: 'var(--ink-faint)' }}
                />
                {klass.teacherNames.join(', ')}
              </span>
            )}
            {klass.startDate && klass.endDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CalendarIcon
                  width={14}
                  height={14}
                  style={{ color: 'var(--ink-faint)' }}
                />
                {klass.startDate} – {klass.endDate}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {klass.deliveryMode === 'ONLINE' ? (
                <MonitorIcon
                  width={14}
                  height={14}
                  style={{ color: 'var(--ink-faint)' }}
                />
              ) : (
                <PinIcon
                  width={14}
                  height={14}
                  style={{ color: 'var(--ink-faint)' }}
                />
              )}
              {klass.deliveryMode === 'ONLINE'
                ? 'Trực tuyến'
                : 'Trực tiếp tại lớp'}
            </span>
            <Chip variant="cobalt">
              {klass.subjectName} · {klass.gradeLevel}
            </Chip>
          </div>

          {klass.contentMd && (
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.05em',
                  color: 'var(--ink-faint)',
                  marginBottom: 10,
                }}
              >
                Giới thiệu khóa học
              </div>
              <MathPreview
                content={klass.contentMd}
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: 'var(--ink-soft)',
                }}
              />
            </div>
          )}
        </div>

        <RegisterPanel
          klass={klass}
          hotline={hotline}
          isStudent={!!access.isStudent}
          isGuest={isGuest}
        />
      </div>
    </>
  );
}
