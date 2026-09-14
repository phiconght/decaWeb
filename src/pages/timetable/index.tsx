import { history, useAccess } from '@umijs/max';
import { Segmented, Tooltip } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import React from 'react';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/components/icons';
import { OutlineButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import IconButton from '@/components/ui/IconButton';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import { fetchTimetable } from '@/services/timetable';
import type { TimetableItem } from '@/typings/timetable';
import { viDate } from '@/utils/date';
import { getStatusMeta } from '@/utils/statusMeta';

function mondayOf(d: Dayjs) {
  const day = d.day();
  const diff = day === 0 ? -6 : 1 - day;
  return d.add(diff, 'day').startOf('day');
}

const STATUS_CHIP = {
  PLANNED: { variant: 'cobalt', color: 'var(--cobalt)' },
  IN_PROGRESS: { variant: 'cobalt', color: 'var(--cobalt)' },
  DONE: { variant: 'sage', color: 'var(--sage)' },
  CANCELLED: { variant: 'neutral', color: 'var(--ink-faint)' },
} as const;

type Period = 'Sáng' | 'Chiều' | 'Tối';
const PERIODS: Period[] = ['Sáng', 'Chiều', 'Tối'];

function periodOf(startTime: string): Period {
  const h = Number(startTime.slice(0, 2));
  if (h < 12) return 'Sáng';
  if (h < 18) return 'Chiều';
  return 'Tối';
}

function SessionChip({
  item,
  showWho,
}: {
  item: TimetableItem;
  showWho?: string;
}) {
  const meta = STATUS_CHIP[item.status] ?? STATUS_CHIP.CANCELLED;
  return (
    <Tooltip
      title={
        <>
          {item.className} · {item.subjectName}
          {showWho ? ` · ${showWho}` : ''}
          {item.roomName ? ` · P.${item.roomName}` : ''}
        </>
      }
    >
      <div
        onClick={() =>
          history.push(`/timetable/session/${item.sessionId}`, item)
        }
        style={{
          cursor: 'pointer',
          background: `${meta.color}14`,
          borderLeft: `3px solid ${meta.color}`,
          borderRadius: 8,
          padding: '7px 9px',
          marginBottom: 4,
          fontSize: 11.5,
        }}
      >
        <span
          className="mono"
          style={{ fontWeight: 700, display: 'block', marginBottom: 2 }}
        >
          {item.startTime.slice(0, 5)}
        </span>
        <span>{item.className}</span>
      </div>
    </Tooltip>
  );
}

/**
 * Thời khóa biểu — reskin theo ThietKe/Web/files/timetable.html
 * (`.tt-grid`/`.tt-table` + `.list-card` danh sách tuần), giữ nguyên logic
 * gọi API/lọc theo con của bản trước.
 */
export default function TimetablePage() {
  const access = useAccess();
  const view = access.isTeacher
    ? 'TEACHER'
    : access.isParent
      ? 'PARENT'
      : 'STUDENT';

  const [weekStart, setWeekStart] = React.useState(() => mondayOf(dayjs()));
  const [items, setItems] = React.useState<TimetableItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [childFilter, setChildFilter] = React.useState<string>('all');

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTimetable({
        view,
        from: weekStart.format('YYYY-MM-DD'),
        to: weekStart.add(6, 'day').format('YYYY-MM-DD'),
      });
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [view, weekStart]);

  React.useEffect(() => {
    load();
  }, [load]);

  const children = React.useMemo(() => {
    const seen = new Map<number, string>();
    for (const it of items) {
      if (it.studentId != null && !seen.has(it.studentId)) {
        seen.set(it.studentId, it.studentName ?? 'Học viên');
      }
    }
    return Array.from(seen, ([studentId, studentName]) => ({
      studentId,
      studentName,
    }));
  }, [items]);

  const filtered = React.useMemo(() => {
    const list =
      access.isParent && childFilter !== 'all'
        ? items.filter((it) => String(it.studentId) === childFilter)
        : items;
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [items, access.isParent, childFilter]);

  const agenda = React.useMemo(
    () =>
      [...filtered].sort((a, b) =>
        a.date === b.date
          ? a.startTime.localeCompare(b.startTime)
          : a.date.localeCompare(b.date),
      ),
    [filtered],
  );

  const days = React.useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day')),
    [weekStart],
  );

  const grid = React.useMemo(() => {
    const map = new Map<Period, Map<string, TimetableItem[]>>(
      PERIODS.map((p) => [p, new Map()]),
    );
    for (const it of filtered) {
      const byDate = map.get(periodOf(it.startTime));
      if (!byDate) continue;
      const bucket = byDate.get(it.date);
      if (bucket) bucket.push(it);
      else byDate.set(it.date, [it]);
    }
    return map;
  }, [filtered]);

  const isEmpty = filtered.length === 0;
  const today = dayjs().format('YYYY-MM-DD');
  const cellWidth = 150;

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Thời khóa biểu
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton
            size="sm"
            onClick={() => setWeekStart((d) => d.subtract(7, 'day'))}
          >
            <ChevronLeftIcon width={13} height={13} />
          </IconButton>
          <span
            className="mono"
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              padding: '8px 14px',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 10,
            }}
          >
            {weekStart.format('DD/MM')} –{' '}
            {weekStart.add(6, 'day').format('DD/MM/YYYY')}
          </span>
          <IconButton
            size="sm"
            onClick={() => setWeekStart((d) => d.add(7, 'day'))}
          >
            <ChevronRightIcon width={13} height={13} />
          </IconButton>
          <OutlineButton onClick={() => setWeekStart(mondayOf(dayjs()))}>
            Hôm nay
          </OutlineButton>
        </div>
      </div>

      {access.isParent && children.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <Segmented
            value={childFilter}
            onChange={(v) => setChildFilter(String(v))}
            options={[
              { label: 'Tất cả', value: 'all' },
              ...children.map((c) => ({
                label: c.studentName,
                value: String(c.studentId),
              })),
            ]}
          />
        </div>
      )}

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          marginBottom: 22,
        }}
      >
        {isEmpty && !loading ? (
          <EmptyState
            icon={<CalendarIcon width={60} height={60} strokeWidth={1.4} />}
            title="Không có buổi học trong tuần này"
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                minWidth: 7 * cellWidth + 64,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: 64,
                      borderBottom: '1px solid var(--line)',
                      borderRight: '1px solid var(--line-soft)',
                      background: 'var(--card-warm)',
                    }}
                  />
                  {days.map((d) => {
                    const dateStr = d.format('YYYY-MM-DD');
                    const isToday = dateStr === today;
                    return (
                      <th
                        key={dateStr}
                        style={{
                          width: cellWidth,
                          padding: '14px 8px',
                          textAlign: 'center',
                          borderBottom: '1px solid var(--line)',
                          borderRight: '1px solid var(--line-soft)',
                          background: isToday
                            ? 'var(--cobalt-tint)'
                            : 'var(--card-warm)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            color: isToday
                              ? 'var(--cobalt-dark)'
                              : 'var(--ink-soft)',
                          }}
                        >
                          {viDate(d).format('dd')}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontWeight: 600,
                            color: 'var(--ink-faint)',
                            fontSize: 11,
                            marginTop: 2,
                          }}
                        >
                          {d.format('DD/MM')}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period) => (
                  <tr key={period}>
                    <td
                      style={{
                        padding: '7px',
                        borderBottom: '1px solid var(--line-soft)',
                        borderRight: '1px solid var(--line-soft)',
                        background: 'var(--card-warm)',
                        textAlign: 'left',
                        paddingLeft: 14,
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--ink-soft)',
                        verticalAlign: 'top',
                      }}
                    >
                      {period}
                    </td>
                    {days.map((d) => {
                      const dateStr = d.format('YYYY-MM-DD');
                      const isToday = dateStr === today;
                      const cellItems = grid.get(period)?.get(dateStr) ?? [];
                      return (
                        <td
                          key={dateStr}
                          style={{
                            padding: 7,
                            borderBottom: '1px solid var(--line-soft)',
                            borderRight: '1px solid var(--line-soft)',
                            verticalAlign: 'top',
                            height: 72,
                            background: isToday ? '#fbfbf6' : undefined,
                          }}
                        >
                          {cellItems.map((item) => (
                            <SessionChip
                              key={`${item.sessionId}-${item.studentId ?? ''}`}
                              item={item}
                              showWho={
                                view === 'PARENT'
                                  ? item.studentName
                                  : item.teacherName
                              }
                            />
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isEmpty && (
        <ListCard
          title="Danh sách buổi học trong tuần"
          icon={<CalendarIcon width={16} height={16} />}
        >
          {agenda.map((item) => (
            <ListRow
              key={`${item.sessionId}-${item.studentId ?? ''}`}
              icon={<CalendarIcon width={18} height={18} />}
              title={`${viDate(item.date).format('dddd')}, ${item.date.split('-').reverse().join('/')} · ${item.startTime.slice(0, 5)}–${item.endTime.slice(0, 5)} · ${item.className}`}
              subtitle={[
                item.subjectName,
                item.roomName && `Phòng ${item.roomName}`,
                view === 'PARENT' ? item.studentName : item.teacherName,
              ]
                .filter(Boolean)
                .join(' · ')}
              right={
                <Chip variant={STATUS_CHIP[item.status]?.variant ?? 'neutral'}>
                  {getStatusMeta('session', item.status).label}
                </Chip>
              }
              onClick={() =>
                history.push(`/timetable/session/${item.sessionId}`, item)
              }
            />
          ))}
        </ListCard>
      )}
    </>
  );
}
