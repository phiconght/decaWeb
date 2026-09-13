import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, Link, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Spin } from 'antd';
import React from 'react';
import { flushSync } from 'react-dom';
import { logout } from '@/services/auth';

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span>{currentUser?.name}</span>;
};

// Không dùng `children` (avatarChildren mặc định của ProLayout) — tự vẽ UI riêng.
export const AvatarDropdown: React.FC<{ children?: React.ReactNode }> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      flushSync(() =>
        setInitialState((s) => ({ ...s, currentUser: undefined })),
      );
      await logout();
      // Về Trang chủ công khai, không phải /login (quyết định 13/09/2026 —
      // KEHOACH_WEB_TrangChuCongKhai_HeroContent.md mục 2). `PublicShell`
      // hiện đúng ngay nhờ flushSync ở trên đã xoá currentUser trước đó.
      history.replace('/home');
      return;
    }
    if (key === 'account') history.push('/account');
  };

  if (!initialState) {
    return (
      <span>
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
      </span>
    );
  }

  const { currentUser } = initialState;
  if (!currentUser?.name) {
    return <Link to="/login">Đăng nhập</Link>;
  }

  const menuItems: MenuProps['items'] = [
    { key: 'account', icon: <UserOutlined />, label: 'Tài khoản' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
  ];

  return (
    <Dropdown menu={{ items: menuItems, onClick: onMenuClick }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <Avatar size="small" icon={<UserOutlined />} src={currentUser.avatar} />
        <span>{currentUser.name}</span>
      </span>
    </Dropdown>
  );
};
