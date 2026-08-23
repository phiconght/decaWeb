import { BellOutlined, MessageOutlined } from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';
import { Badge, Space } from 'antd';
import React from 'react';
import { fetchMessageUnreadCount } from '@/services/message';
import { fetchNotificationUnreadCount } from '@/services/notification';

/**
 * WEB/PLAN.md §5.7b — Thông báo + Tin nhắn KHÔNG lên menu ngang, vào qua 2
 * icon-badge ở header (đúng pattern AppBar Mobile + RightContent ADMIN).
 * Tự làm mới khi đổi route (không polling phức tạp, xem §12 #3).
 */
export default function HeaderBadges() {
  const location = useLocation();
  const [notifCount, setNotifCount] = React.useState(0);
  const [msgCount, setMsgCount] = React.useState(0);

  React.useEffect(() => {
    fetchNotificationUnreadCount().then(setNotifCount).catch(() => {});
    fetchMessageUnreadCount().then(setMsgCount).catch(() => {});
  }, [location.pathname]);

  return (
    <Space size="middle" style={{ marginRight: 8 }}>
      <Badge count={notifCount} size="small">
        <BellOutlined
          style={{ fontSize: 18, cursor: 'pointer' }}
          onClick={() => history.push('/notifications')}
        />
      </Badge>
      <Badge count={msgCount} size="small">
        <MessageOutlined
          style={{ fontSize: 18, cursor: 'pointer' }}
          onClick={() => history.push('/messages')}
        />
      </Badge>
    </Space>
  );
}
