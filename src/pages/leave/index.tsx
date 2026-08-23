import { history, useAccess } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import { LeaveIcon } from '@/components/icons';
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import { confirmLeaveByParent, fetchLeaves } from '@/services/leave';
import { toChipVariant } from '@/theme/tokens';
import type { LeaveItem } from '@/typings/leave';
import { getStatusMeta } from '@/utils/statusMeta';

/**
 * Đơn nghỉ — reskin theo ThietKe/Web/files/leave.html (`.page-head` + nút
 * "Tạo đơn" + `.list-card`), giữ nguyên logic gọi API/xác nhận PH.
 */
export default function LeavePage() {
  const access = useAccess();
  const [items, setItems] = React.useState<LeaveItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLeaves();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async (id: number) => {
    await confirmLeaveByParent(id);
    message.success('Đã xác nhận đơn nghỉ');
    load();
  };

  const describe = (item: LeaveItem) => {
    if (item.scope === 'SESSION') {
      return [`Buổi ${item.sessionDate ?? ''}`, item.className]
        .filter(Boolean)
        .join(' · ');
    }
    return `${item.dateFrom} → ${item.dateTo}${item.className ? ` · ${item.className}` : ' · Tất cả lớp'}`;
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 22,
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Đơn nghỉ</h1>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 5 }}>
            Theo dõi các đơn xin nghỉ buổi học
          </div>
        </div>
        <PrimaryButton onClick={() => history.push('/leave/new')}>
          Tạo đơn
        </PrimaryButton>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : items.length === 0 ? (
        <ListCard>
          <EmptyState
            icon={<LeaveIcon width={60} height={60} strokeWidth={1.4} />}
            title="Chưa có đơn nghỉ nào"
          />
        </ListCard>
      ) : (
        <ListCard>
          {items.map((item) => {
            const meta = getStatusMeta('leave', item.status);
            return (
              <ListRow
                key={item.id}
                icon={<LeaveIcon width={18} height={18} />}
                iconBg="#FBF0DC"
                iconColor="var(--gold-dark)"
                title={item.studentName}
                subtitle={describe(item)}
                right={
                  <>
                    <Chip variant={toChipVariant(meta.color)}>
                      {meta.label}
                    </Chip>
                    {access.isParent && !item.parentConfirmedBy && (
                      <OutlineButton onClick={() => handleConfirm(item.id)}>
                        Xác nhận
                      </OutlineButton>
                    )}
                  </>
                }
              />
            );
          })}
        </ListCard>
      )}
    </>
  );
}
