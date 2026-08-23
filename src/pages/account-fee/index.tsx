import { Tabs } from 'antd';
import React from 'react';
import CoinPanel from './CoinPanel';
import FeePanel from './FeePanel';

/**
 * "Tài khoản và học phí" — gộp trang /fee (đợt thu chuyển khoản hàng tháng
 * cho lớp offline) và /coin (số dư, nạp Xu, lịch sử biến động Xu) vào 1
 * mục menu duy nhất (yêu cầu người dùng, đồng bộ Mobile AccountFeePage).
 */
export default function AccountFeePage() {
  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
          Tài khoản và học phí
        </h1>
      </div>

      <Tabs
        defaultActiveKey="coin"
        items={[
          { key: 'coin', label: 'Xu của tôi', children: <CoinPanel /> },
          { key: 'fee', label: 'Học phí', children: <FeePanel /> },
        ]}
      />
    </>
  );
}
