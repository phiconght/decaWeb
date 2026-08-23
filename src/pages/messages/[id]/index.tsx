import { useParams } from '@umijs/max';
import React from 'react';
import PageTitle from '@/components/PageTitle';
import Crumb from '@/components/ui/Crumb';
import Panel from '@/components/ui/Panel';
import { fetchMessageDetail, markMessageRead } from '@/services/message';
import type { MessageDetail } from '@/typings/message';

/** Chi tiết tin nhắn — reskin theo tông `.panel` + `.crumb`. */
export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [msg, setMsg] = React.useState<MessageDetail | undefined>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchMessageDetail(Number(id))
      .then((m) => {
        setMsg(m);
        if (!m.read) markMessageRead(Number(id));
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <PageTitle title={msg?.title ?? 'Chi tiết tin nhắn'} />
      <Crumb label="Tin nhắn" to="/messages" />
      {loading || !msg ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : (
        <>
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
              {msg.title}
            </h1>
          </div>
          <Panel>
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: 'var(--ink-faint)',
                marginBottom: 12,
              }}
            >
              {msg.createdAt.slice(0, 16).replace('T', ' ')}
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </p>
          </Panel>
        </>
      )}
    </>
  );
}
