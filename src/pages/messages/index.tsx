import { history } from '@umijs/max';
import React from 'react';
import { MessageIcon } from '@/components/icons';
import PageTitle from '@/components/PageTitle';
import { OutlineButton } from '@/components/ui/Buttons';
import EmptyState from '@/components/ui/EmptyState';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import { fetchMessages, markAllMessagesRead } from '@/services/message';
import type { MessageItem } from '@/typings/message';

/** Tin nhắn — reskin theo tông `.list-card`, giữ nguyên logic gọi API. */
export default function MessagesPage() {
  const [items, setItems] = React.useState<MessageItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchMessages(1, 30));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleReadAll = async () => {
    await markAllMessagesRead();
    load();
  };

  return (
    <>
      <PageTitle title="Tin nhắn" />
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
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Tin nhắn</h1>
        <OutlineButton onClick={handleReadAll}>Đọc tất cả</OutlineButton>
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : items.length === 0 ? (
        <ListCard>
          <EmptyState
            icon={<MessageIcon width={60} height={60} strokeWidth={1.4} />}
            title="Bạn chưa có tin nhắn nào"
          />
        </ListCard>
      ) : (
        <ListCard>
          {items.map((item) => (
            <ListRow
              key={item.id}
              icon={<MessageIcon width={18} height={18} />}
              iconBg={item.read ? undefined : 'var(--coral-tint)'}
              iconColor={item.read ? undefined : 'var(--coral)'}
              title={
                <span style={{ fontWeight: item.read ? 500 : 800 }}>
                  {item.title}
                </span>
              }
              subtitle={item.preview}
              onClick={() => history.push(`/messages/${item.id}`)}
            />
          ))}
        </ListCard>
      )}
    </>
  );
}
