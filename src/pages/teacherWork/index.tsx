import { message } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { QrIcon } from '@/components/icons';
import PageTitle from '@/components/PageTitle';
import QrScanner from '@/components/QrScanner';
import { OutlineButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import Panel from '@/components/ui/Panel';
import {
  fetchMyTeachingAttendance,
  teacherCheckin,
  teacherCheckout,
} from '@/services/teacherWork';
import type { ChipVariant } from '@/theme/tokens';
import type { TeacherWorkReport } from '@/typings/teacherWork';

const STATUS_LABEL: Record<string, { variant: ChipVariant; label: string }> = {
  CHUA_CHAM: { variant: 'neutral', label: 'Chưa chấm' },
  DUNG_GIO: { variant: 'sage', label: 'Đúng giờ' },
  VAO_TRE: { variant: 'gold', label: 'Vào trễ' },
  VANG: { variant: 'coral', label: 'Vắng' },
};

/**
 * Chấm công giáo viên — reskin theo tông `.panel`/`.list-card`, giữ nguyên
 * luồng quét QR duy nhất còn lại trên Web (WEB/PLAN.md §5.2).
 */
export default function TeacherWorkPage() {
  const [report, setReport] = React.useState<TeacherWorkReport | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [scannerOpen, setScannerOpen] = React.useState(false);
  const [scanMode, setScanMode] = React.useState<'checkin' | 'checkout'>(
    'checkin',
  );
  const [activeSessionId, setActiveSessionId] = React.useState<
    number | undefined
  >();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const from = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
      const to = dayjs().format('YYYY-MM-DD');
      const data = await fetchMyTeachingAttendance(from, to);
      setReport(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const openScanner = (sessionId: number, mode: 'checkin' | 'checkout') => {
    setActiveSessionId(sessionId);
    setScanMode(mode);
    setScannerOpen(true);
  };

  const handleScan = async (roomCode: string) => {
    if (!activeSessionId) return;
    try {
      if (scanMode === 'checkin') {
        await teacherCheckin(activeSessionId, roomCode);
        message.success('Đã chấm công vào');
      } else {
        await teacherCheckout(activeSessionId, roomCode);
        message.success('Đã chấm công ra');
      }
      setScannerOpen(false);
      load();
    } catch {
      // lỗi đã hiện qua requestErrorConfig.ts
    }
  };

  const s = report?.summary;
  const stats: { label: string; value: number }[] = [
    { label: 'Đúng giờ', value: s?.dungGio ?? 0 },
    { label: 'Vào trễ', value: s?.vaoTre ?? 0 },
    { label: 'Vắng', value: s?.vang ?? 0 },
    { label: 'Chưa chấm', value: s?.chuaCham ?? 0 },
  ];

  return (
    <>
      <PageTitle title="Chấm công giáo viên" />
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Chấm công giáo viên
        </h1>
      </div>

      <Panel style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700 }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--ink-soft)',
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <ListCard
        title="Buổi dạy 7 ngày gần đây"
        icon={<QrIcon width={16} height={16} />}
      >
        {loading ? (
          <div style={{ padding: 22, color: 'var(--ink-faint)', fontSize: 13 }}>
            Đang tải…
          </div>
        ) : (
          (report?.items ?? []).map((item) => (
            <ListRow
              key={item.sessionId}
              icon={<QrIcon width={18} height={18} />}
              title={`${item.date} · ${item.startTime.slice(0, 5)}–${item.endTime.slice(0, 5)} · ${item.className}`}
              subtitle={item.roomName ?? undefined}
              right={
                <>
                  <Chip
                    variant={STATUS_LABEL[item.status]?.variant ?? 'neutral'}
                  >
                    {STATUS_LABEL[item.status]?.label ?? item.status}
                  </Chip>
                  <OutlineButton
                    disabled={!!item.checkInAt}
                    onClick={() => openScanner(item.sessionId, 'checkin')}
                  >
                    Vào
                  </OutlineButton>
                  <OutlineButton
                    disabled={!item.checkInAt || !!item.checkOutAt}
                    onClick={() => openScanner(item.sessionId, 'checkout')}
                  >
                    Ra
                  </OutlineButton>
                </>
              }
            />
          ))
        )}
      </ListCard>

      <QrScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
    </>
  );
}
