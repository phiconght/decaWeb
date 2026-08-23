import { history, useModel } from '@umijs/max';
import React from 'react';
import { LogoutIcon } from '@/components/icons';
import { DangerOutlineButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import InfoGrid from '@/components/ui/InfoGrid';
import Panel from '@/components/ui/Panel';
import { logout } from '@/services/auth';

/**
 * Tài khoản — reskin theo ThietKe/Web/files/account.html (avatar tròn +
 * Chip vai trò + InfoGrid), giữ nguyên logic đọc initialState.currentUser.
 */
export default function AccountPage() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const handleLogout = async () => {
    await logout();
    await setInitialState((s) => ({ ...s, currentUser: undefined }));
    history.replace('/login');
  };

  const initials = (currentUser?.name ?? '?')
    .split(' ')
    .slice(-2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Tài khoản</h1>
      </div>

      <Panel style={{ maxWidth: 560 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#5B6CFF,#2E43E8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>
              {currentUser?.name}
            </div>
            <div
              style={{
                marginTop: 6,
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              {(currentUser?.roles ?? []).map((r) => (
                <Chip key={r} variant="cobalt">
                  {r}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <InfoGrid
          columns={1}
          items={[
            { k: 'Email', v: currentUser?.email || '—' },
            { k: 'Vai trò', v: (currentUser?.roles ?? []).join(', ') || '—' },
          ]}
        />

        <DangerOutlineButton
          icon={<LogoutIcon width={17} height={17} />}
          onClick={handleLogout}
        >
          Đăng xuất
        </DangerOutlineButton>
      </Panel>
    </>
  );
}
