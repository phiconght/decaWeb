import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';
import React from 'react';

/**
 * Placeholder tạm cho các trang chưa code (sẽ thay dần theo lộ trình Đợt 1-8,
 * xem WEB/PLAN.md §13). Chỉ dùng để routes.ts có component hợp lệ ở Đợt 0.
 */
export default function Placeholder({ title }: { title: string }) {
  return (
    <PageContainer title={title}>
      <Empty description={`${title} — đang phát triển`} />
    </PageContainer>
  );
}
