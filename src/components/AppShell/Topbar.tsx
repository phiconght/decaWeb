import { history, useLocation } from '@umijs/max';
import React from 'react';
import { AvatarDropdown } from '@/components/AvatarDropdown';

import {
  BellIcon,
  MenuIcon,
  MessageIcon,
  SearchIcon,
} from '@/components/icons';
import IconButton from '@/components/ui/IconButton';
import { fetchMessageUnreadCount } from '@/services/message';
import { fetchNotificationUnreadCount } from '@/services/notification';

function Dot() {
  return (
    <span
      style={{
        position: 'absolute',
        top: 6,
        right: 7,
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--coral)',
        border: '1.5px solid var(--card)',
      }}
    />
  );
}

/** Ánh xạ `.topbar` — search pill, chuông/thư, user-chip. */
export default function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const location = useLocation();
  const [notifCount, setNotifCount] = React.useState(0);
  const [msgCount, setMsgCount] = React.useState(0);

  React.useEffect(() => {
    fetchNotificationUnreadCount()
      .then(setNotifCount)
      .catch(() => {});
    fetchMessageUnreadCount()
      .then(setMsgCount)
      .catch(() => {});
  }, [location.pathname]);

  return (
    <header
      style={{
        height: 72,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(247,244,236,0.86)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          className="app-hamburger"
          onClick={onMenuToggle}
          aria-label="Mở menu"
        >
          <MenuIcon width={20} height={20} />
        </IconButton>
        <div
          className="app-search-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '9px 14px',
            width: 280,
            color: 'var(--ink-faint)',
          }}
        >
          <SearchIcon width={16} height={16} />
          <span style={{ fontSize: 13.5 }}>Tìm kiếm khóa học, tin nhắn…</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconButton
          aria-label="Thông báo"
          onClick={() => history.push('/notifications')}
        >
          <BellIcon width={20} height={20} />
          {notifCount > 0 && <Dot />}
        </IconButton>
        <IconButton
          aria-label="Tin nhắn"
          onClick={() => history.push('/messages')}
        >
          <MessageIcon width={20} height={20} />
          {msgCount > 0 && <Dot />}
        </IconButton>
        <div style={{ marginLeft: 6 }}>
          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
}
