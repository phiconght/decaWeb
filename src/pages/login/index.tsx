import {
  ArrowLeftOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, Link, useModel } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import { getMe, login, toCurrentUser, tokenStore } from '@/services/auth';

/**
 * Đăng nhập — reskin nền/thẻ theo token thiết kế mới (`--paper`/`--card`/
 * `--radius-lg`), giữ nguyên `LoginForm`/`ProFormText` của ProComponents
 * (đã theo theme qua ConfigProvider ở app.tsx) và 100% logic xác thực cũ.
 * route `layout: false` — không có AppShell bao quanh.
 */
export default function LoginPage() {
  const { setInitialState } = useModel('@@initialState');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setSubmitting(true);
    try {
      const tokenRes = await login(values);
      tokenStore.set(tokenRes.accessToken, tokenRes.refreshToken);
      const user = await getMe();
      const cu = toCurrentUser(user);
      const roles = cu.roles ?? [];
      const isStaffOnly = !roles.some((r) =>
        ['STUDENT', 'PARENT', 'TEACHER'].includes(r),
      );
      if (isStaffOnly) {
        window.location.href = ADMIN_URL;
        return;
      }
      await setInitialState((s) => ({ ...s, currentUser: cu }));
      const redirect = new URLSearchParams(history.location.search).get(
        'redirect',
      );
      history.push(redirect || '/home');
    } catch {
      message.error('Sai tài khoản hoặc mật khẩu');
      tokenStore.clear();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--paper)',
        gap: 16,
      }}
    >
      <Link
        to="/home"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13.5,
          fontWeight: 600,
          color: 'var(--ink-soft)',
        }}
      >
        <ArrowLeftOutlined /> Về trang chủ
      </Link>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: '12px 8px',
        }}
      >
        <LoginForm
          logo="/logo-deca.png"
          title="DecaMath"
          subTitle="Trung tâm giáo dục DecaMath — Cổng học viên, phụ huynh & giáo viên"
          submitter={{ submitButtonProps: { loading: submitting } }}
          onFinish={handleSubmit}
        >
          <ProFormText
            name="username"
            fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
            placeholder="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
            placeholder="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          />
        </LoginForm>
      </div>
    </div>
  );
}
