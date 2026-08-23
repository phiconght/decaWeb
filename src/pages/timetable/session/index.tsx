import { history, useAccess, useParams } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import { CalendarIcon, PostIcon } from '@/components/icons';
import PageTitle from '@/components/PageTitle';
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import Crumb from '@/components/ui/Crumb';
import EmptyState from '@/components/ui/EmptyState';
import InfoGrid from '@/components/ui/InfoGrid';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import {
  fetchSessionExams,
  fetchSessionVideos,
  fetchSessionZoomLinks,
} from '@/services/session';
import { fetchTimetable, selfCheckin } from '@/services/timetable';
import { toChipVariant } from '@/theme/tokens';
import type {
  SessionExamItem,
  SessionVideoItem,
  ZoomLinkItem,
} from '@/typings/session';
import type { TimetableItem } from '@/typings/timetable';
import { getStatusMeta } from '@/utils/statusMeta';

/** Trích video ID từ mọi dạng URL YouTube phổ biến (watch/short/embed/youtu.be). */
function youtubeEmbedUrl(url: string): string | undefined {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return undefined;
}

/**
 * Chi tiết buổi học — reskin theo tông `.panel/.info-grid/.list-card`. Không
 * có GET /sessions/{id} riêng — lấy từ router state hoặc refetch /timetable
 * (giữ nguyên logic cũ). HS bấm nút "Điểm danh" cho buổi ONLINE (đồng bộ
 * Mobile session_detail_page.dart) — buổi OFFLINE vẫn chỉ điểm danh qua
 * QR/GV trên Mobile, không có trên Web.
 */
export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const access = useAccess();
  const view = access.isTeacher
    ? 'TEACHER'
    : access.isParent
      ? 'PARENT'
      : 'STUDENT';

  const [item, setItem] = React.useState<TimetableItem | undefined>(
    (history.location.state as TimetableItem | undefined)?.sessionId ===
      sessionId
      ? (history.location.state as TimetableItem)
      : undefined,
  );
  const [videos, setVideos] = React.useState<SessionVideoItem[]>([]);
  const [openVideoId, setOpenVideoId] = React.useState<number | undefined>();
  const [zoomLinks, setZoomLinks] = React.useState<ZoomLinkItem[]>([]);
  const [exams, setExams] = React.useState<SessionExamItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [checkingIn, setCheckingIn] = React.useState(false);

  const handleCheckin = async () => {
    setCheckingIn(true);
    try {
      await selfCheckin(sessionId);
      message.success('Đã điểm danh');
      setItem((prev) => (prev ? { ...prev, attendanceStatus: 'CO_MAT' } : prev));
    } catch {
      message.error('Điểm danh thất bại');
    } finally {
      setCheckingIn(false);
    }
  };

  const isToday = item ? item.date === new Date().toISOString().slice(0, 10) : false;
  const canCheckin =
    view === 'STUDENT' &&
    !!item &&
    item.deliveryMode === 'ONLINE' &&
    item.status === 'PLANNED' &&
    isToday &&
    (!item.attendanceStatus || item.attendanceStatus === 'CHUA_CHECKIN');

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [v, z, e] = await Promise.all([
        fetchSessionVideos(sessionId),
        fetchSessionZoomLinks(sessionId),
        fetchSessionExams(sessionId),
      ]);
      if (cancelled) return;
      setVideos(v);
      setZoomLinks(z);
      setExams(e);
      if (!item) {
        const today = new Date();
        const from = new Date(today.getTime() - 30 * 86400000)
          .toISOString()
          .slice(0, 10);
        const to = new Date(today.getTime() + 30 * 86400000)
          .toISOString()
          .slice(0, 10);
        const list = await fetchTimetable({ view, from, to });
        const found = list.find((x) => x.sessionId === sessionId);
        if (found && !cancelled) setItem(found);
      }
      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <>
      <PageTitle
        title={item ? `${item.className} · ${item.date}` : 'Chi tiết buổi học'}
      />
      <Crumb label="Thời khóa biểu" to="/timetable" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Chi tiết buổi học
        </h1>
      </div>

      {loading && !item ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : (
        item && (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              padding: 22,
              marginBottom: 18,
            }}
          >
            <InfoGrid
              items={[
                { k: 'Lớp', v: item.className },
                { k: 'Môn', v: item.subjectName },
                { k: 'Ngày', v: item.date },
                {
                  k: 'Giờ',
                  v: `${item.startTime.slice(0, 5)}–${item.endTime.slice(0, 5)}`,
                },
                { k: 'Phòng', v: item.roomName ?? '—' },
                { k: 'Giáo viên', v: item.teacherName ?? '—' },
              ]}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {(() => {
                const meta = getStatusMeta('session', item.status);
                return (
                  <Chip variant={toChipVariant(meta.color)}>{meta.label}</Chip>
                );
              })()}
              {item.attendanceStatus === 'CO_MAT' ||
              item.attendanceStatus === 'TRE' ? (
                <Chip variant="sage">Đã điểm danh</Chip>
              ) : (
                canCheckin && (
                  <PrimaryButton onClick={handleCheckin} disabled={checkingIn}>
                    {checkingIn ? 'Đang xử lý…' : 'Điểm danh'}
                  </PrimaryButton>
                )
              )}
            </div>
          </div>
        )
      )}

      <ListCard
        title="Video bài giảng"
        icon={<PostIcon width={16} height={16} />}
        style={{ marginBottom: 18 }}
      >
        {videos.length === 0 ? (
          <EmptyState title="Chưa có video" />
        ) : (
          videos.map((v) => {
            const isOpen = openVideoId === v.videoId;
            const embedUrl = youtubeEmbedUrl(v.youtubeUrl);
            return (
              <div key={v.videoId}>
                <ListRow
                  icon={<PostIcon width={18} height={18} />}
                  title={v.title}
                  right={
                    <OutlineButton
                      type="button"
                      onClick={() =>
                        setOpenVideoId(isOpen ? undefined : v.videoId)
                      }
                    >
                      {isOpen ? 'Ẩn video' : 'Xem bài giảng'}
                    </OutlineButton>
                  }
                />
                {isOpen && (
                  <div style={{ padding: '0 22px 18px' }}>
                    {embedUrl ? (
                      <div
                        style={{
                          position: 'relative',
                          paddingTop: '56.25%',
                          borderRadius: 12,
                          overflow: 'hidden',
                        }}
                      >
                        <iframe
                          src={`${embedUrl}?autoplay=1`}
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                          }}
                        />
                      </div>
                    ) : (
                      <EmptyState title="Không đọc được link video" />
                    )}
                    <a
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: 10,
                        fontSize: 12.5,
                        color: 'var(--cobalt)',
                        fontWeight: 600,
                      }}
                    >
                      Mở trên YouTube
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </ListCard>

      <ListCard
        title="Link Zoom"
        icon={<CalendarIcon width={16} height={16} />}
        style={{ marginBottom: 18 }}
      >
        {zoomLinks.length === 0 ? (
          <EmptyState title="Chưa có link Zoom" />
        ) : (
          zoomLinks.map((z) => (
            <ListRow
              key={z.id}
              icon={<CalendarIcon width={18} height={18} />}
              title={z.label || 'Link Zoom'}
              subtitle={[
                z.meetingId && `ID: ${z.meetingId}`,
                z.passcode && `Mật khẩu: ${z.passcode}`,
              ]
                .filter(Boolean)
                .join(' · ')}
              right={
                <a href={z.zoomUrl} target="_blank" rel="noreferrer">
                  <OutlineButton type="button">Tham gia</OutlineButton>
                </a>
              }
            />
          ))
        )}
      </ListCard>

      <ListCard
        title="Đề thi buổi học"
        icon={<PostIcon width={16} height={16} />}
      >
        {exams.length === 0 ? (
          <EmptyState title="Buổi học chưa có đề thi" />
        ) : (
          exams.map((e) => (
            <ListRow
              key={e.examId}
              icon={<PostIcon width={18} height={18} />}
              title={e.name}
              subtitle={e.code}
              right={
                e.studentStatus && (
                  <OutlineButton
                    onClick={() => history.push(`/exams/${e.examId}`)}
                  >
                    {e.studentStatus === 'DA_LAM' ? 'Xem lại' : 'Làm bài'}
                  </OutlineButton>
                )
              }
            />
          ))
        )}
      </ListCard>
    </>
  );
}
