import { history } from '@umijs/max';
import React from 'react';
import EnrollButton from '@/components/EnrollButton';
import { BookIcon, MonitorIcon, PhoneIcon, PinIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';
import type { ClassCatalogItem } from '@/typings/class';

const money = (n: number) => n.toLocaleString('vi-VN') + 'đ';

/**
 * Card khóa học dùng chung cho "Trang chủ" (marketing) VÀ "Khám phá khóa
 * học" — ảnh + tên + giáo viên + nút Đăng ký; khóa mở đăng ký chuyển khoản
 * (fullPrice) hiện thêm hotline (bấm vào card mở trang chi tiết để đăng ký +
 * quét QR thật — không tạo yêu cầu đăng ký chỉ vì card được render).
 */
export default function CourseCard({
  item,
  gradient,
  hotline,
  isStudent,
  isGuest,
  onEnrolled,
}: {
  item: ClassCatalogItem;
  gradient: string;
  hotline?: string;
  isStudent: boolean;
  isGuest?: boolean;
  onEnrolled: () => void;
}) {
  const registrable = !!item.fullPrice && item.fullPrice > 0 && !item.enrolled;

  return (
    <div
      onClick={() => history.push(`/catalog/${item.id}`)}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
      }}
    >
      <div
        style={{
          height: 104,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
          background: item.coverImageUrl ? undefined : gradient,
          overflow: 'hidden',
        }}
      >
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <BookIcon
            width={34}
            height={34}
            stroke="#fff"
            style={{ opacity: 0.9 }}
          />
        )}
        <span
          style={{
            position: 'absolute',
            top: 9,
            left: 9,
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6,
            textTransform: 'uppercase',
            letterSpacing: '.03em',
            background:
              item.status === 'ACTIVE' ? 'var(--sage)' : 'rgba(0,0,0,0.35)',
            color: '#fff',
          }}
        >
          {item.status === 'ACTIVE' ? 'Đang mở' : 'Tạm đóng'}
        </span>
        {item.deliveryMode && (
          <span
            style={{
              position: 'absolute',
              top: 9,
              right: 9,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px 3px 6px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.35)',
              color: '#fff',
            }}
          >
            {item.deliveryMode === 'ONLINE' ? (
              <MonitorIcon width={11} height={11} />
            ) : (
              <PinIcon width={11} height={11} />
            )}
            {item.deliveryMode === 'ONLINE' ? 'Trực tuyến' : 'Trực tiếp'}
          </span>
        )}
      </div>
      <div
        style={{
          padding: '13px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 800,
            lineHeight: 1.35,
            minHeight: 36,
          }}
        >
          {item.name}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>
          {item.code}
        </div>
        {item.teacherNames.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
            {item.teacherNames.join(', ')}
          </div>
        )}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Chip variant="cobalt">
            {item.subjectName} · {item.gradeLevel}
          </Chip>
          <div onClick={(e) => e.stopPropagation()}>
            <EnrollButton
              item={item}
              isStudent={isStudent}
              isGuest={isGuest}
              onEnrolled={onEnrolled}
            />
          </div>
          {registrable && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                paddingTop: 8,
                borderTop: '1px dashed var(--line)',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 11.5, fontWeight: 800 }}
              >
                {money(item.fullPrice as number)}
              </span>
              {hotline && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--cobalt)',
                  }}
                >
                  <PhoneIcon width={11} height={11} />
                  {hotline}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
