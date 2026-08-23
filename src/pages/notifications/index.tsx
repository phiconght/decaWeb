import React from 'react';
import { BellIcon } from '@/components/icons';
import PageTitle from '@/components/PageTitle';
import { OutlineButton } from '@/components/ui/Buttons';
import EmptyState from '@/components/ui/EmptyState';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/services/notification';
import type { NotificationItem } from '@/typings/notification';

/** Thông báo — reskin theo tông `.list-card`, giữ nguyên logic gọi API. */
export default function NotificationsPage() {
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchNotifications(1, 30));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleRead = async (id: number) => {
    await markNotificationRead(id);
    load();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    load();
  };

  return (
    <>
      <PageTitle title="Thông báo" />
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
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Thông báo</h1>
        <OutlineButton onClick={handleReadAll}>Đọc tất cả</OutlineButton>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : items.length === 0 ? (
        <ListCard>
          <EmptyState
            icon={<BellIcon width={60} height={60} strokeWidth={1.4} />}
            title="Bạn chưa có thông báo nào"
          />
        </ListCard>
      ) : (
        <ListCard>
          {items.map((item) => (
            <ListRow
              key={item.id}
              icon={<BellIcon width={18} height={18} />}
              iconBg={item.read ? undefined : 'var(--coral-tint)'}
              iconColor={item.read ? undefined : 'var(--coral)'}
              title={
                <span style={{ fontWeight: item.read ? 500 : 800 }}>
                  {item.title}
                </span>
              }
              subtitle={item.body}
              right={
                !item.read && (
                  <OutlineButton onClick={() => handleRead(item.id)}>
                    Đánh dấu đã đọc
                  </OutlineButton>
                )
              }
            />
          ))}
        </ListCard>
      )}
    </>
  );
}
