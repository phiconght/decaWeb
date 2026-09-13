import { history, useAccess, useModel } from '@umijs/max';
import dayjs from 'dayjs';
import React from 'react';
import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  MessageIcon,
} from '@/components/icons';
import MarketingSection from '@/components/marketing/MarketingSection';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import FeedCard from '@/components/ui/FeedCard';
import GreetBar from '@/components/ui/GreetBar';
import Panel from '@/components/ui/Panel';
import { fetchMessageUnreadCount } from '@/services/message';
import { fetchNotificationUnreadCount } from '@/services/notification';
import { fetchPosts } from '@/services/post';
import { fetchTimetable } from '@/services/timetable';
import type { PostItem } from '@/typings/post';
import type { TimetableItem } from '@/typings/timetable';
import { viDate } from '@/utils/date';

const SESSION_VARIANT = {
  PLANNED: 'cobalt',
  DONE: 'sage',
  CANCELLED: 'neutral',
} as const;
const FEED_GRADIENTS = [
  'linear-gradient(155deg,#2E43E8,#5B6CFF)',
  'linear-gradient(155deg,#F2A93B,#F5C877)',
  'linear-gradient(155deg,#2FAE7A,#5FCB9F)',
  'linear-gradient(155deg,#FF5D6C,#FF8A93)',
];

/**
 * Trang chủ cho người ĐÃ ĐĂNG NHẬP — reskin theo ThietKe/Web/files/home.html
 * (GreetBar + Lịch hôm nay + Bảng tin). Tách ra từ `pages/home/index.tsx`
 * cũ (không đổi logic/UI) khi mở Trang chủ công khai cho khách — xem
 * `pages/home/index.tsx` và
 * KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 6.3.
 */
export default function HomeDashboard() {
  const { initialState } = useModel('@@initialState');
  const access = useAccess();
  const view = access.isTeacher
    ? 'TEACHER'
    : access.isParent
      ? 'PARENT'
      : 'STUDENT';
  const currentUser = initialState?.currentUser;

  const [today, setToday] = React.useState<TimetableItem[]>([]);
  const [posts, setPosts] = React.useState<PostItem[]>([]);
  const [notifCount, setNotifCount] = React.useState(0);
  const [msgCount, setMsgCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const todayStr = dayjs().format('YYYY-MM-DD');
    Promise.all([
      fetchTimetable({ view, from: todayStr, to: todayStr }),
      fetchPosts(1, 5),
      fetchNotificationUnreadCount().catch(() => 0),
      fetchMessageUnreadCount().catch(() => 0),
    ])
      .then(([sessions, feed, notifs, msgs]) => {
        setToday(sessions.filter((s) => s.status !== 'CANCELLED'));
        setPosts(feed);
        setNotifCount(notifs);
        setMsgCount(msgs);
      })
      .finally(() => setLoading(false));
  }, [view]);

  const greeting = (() => {
    const h = dayjs().hour();
    if (h < 11) return 'Chào buổi sáng';
    if (h < 14) return 'Chào buổi trưa';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  })();

  return (
    <>
      <GreetBar
        title={`${greeting}, ${currentUser?.name} 👋`}
        subtitle={viDate(dayjs()).format('dddd, DD/MM/YYYY')}
        stats={[
          {
            icon: <CalendarIcon width={16} height={16} />,
            value: today.length,
            label: 'Buổi học hôm nay',
            onClick: () => history.push('/timetable'),
          },
          {
            icon: <BellIcon width={16} height={16} />,
            value: notifCount,
            label: 'Thông báo chưa đọc',
            onClick: () => history.push('/notifications'),
          },
          {
            icon: <MessageIcon width={16} height={16} />,
            value: msgCount,
            label: 'Tin nhắn chưa đọc',
            onClick: () => history.push('/messages'),
          },
        ]}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 22,
          alignItems: 'start',
        }}
      >
        <Panel title="Lịch hôm nay">
          {loading ? (
            <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
              Đang tải…
            </div>
          ) : today.length === 0 ? (
            <EmptyState
              title="Không có buổi học nào"
              description="Hôm nay bạn không có buổi học nào trong lịch."
            />
          ) : (
            today.map((s) => (
              <div
                key={`${s.sessionId}-${s.studentId ?? ''}`}
                onClick={() =>
                  history.push(`/timetable/session/${s.sessionId}`, s)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--line-soft)',
                  cursor: 'pointer',
                }}
              >
                <span className="mono" style={{ fontWeight: 700, width: 88 }}>
                  {s.startTime.slice(0, 5)}–{s.endTime.slice(0, 5)}
                </span>
                <Chip variant={SESSION_VARIANT[s.status] ?? 'neutral'}>
                  {s.status === 'DONE' ? 'Đã học' : 'Sắp diễn ra'}
                </Chip>
                <span style={{ fontWeight: 600 }}>{s.className}</span>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
                  {[s.roomName && `Phòng ${s.roomName}`, s.teacherName]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </div>
            ))
          )}
        </Panel>

        <Panel
          title="Bảng tin"
          extra={
            <button
              type="button"
              onClick={() => history.push('/posts')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--cobalt)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              Xem tất cả <ChevronRightIcon width={14} height={14} />
            </button>
          }
        >
          {loading ? (
            <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
              Đang tải…
            </div>
          ) : posts.length === 0 ? (
            <EmptyState title="Chưa có bài viết" />
          ) : (
            posts.map((p, i) => (
              <FeedCard
                key={p.id}
                title={p.title}
                author="Trung tâm giáo dục DecaMath"
                date={dayjs(p.publishedAt ?? p.createdAt).format('DD/MM/YYYY')}
                pinned={p.pinned}
                gradient={FEED_GRADIENTS[i % FEED_GRADIENTS.length]}
                onClick={() => history.push(`/posts/${p.id}`)}
              />
            ))
          )}
        </Panel>
      </div>

      <MarketingSection />
    </>
  );
}
