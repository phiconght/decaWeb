import { useAccess, useModel } from '@umijs/max';
import {
  Drawer,
  InputNumber,
  message,
  QRCode,
  Segmented,
  Space,
  Typography,
} from 'antd';
import React from 'react';
import { CoinIcon } from '@/components/icons';
import { OutlineButton, PrimaryButton } from '@/components/ui/Buttons';
import DataTable from '@/components/ui/DataTable';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import Panel from '@/components/ui/Panel';
import { fetchMyCoinBalance, fetchMyCoinTransactions } from '@/services/coin';
import { createCoinTopup, fetchMyCoinTopups } from '@/services/coinTopup';
import { fetchMyChildren } from '@/services/report';
import type { CoinBalanceResponse, CoinTransactionItem } from '@/typings/coin';
import type { CoinTopupResponse } from '@/typings/coinTopup';
import type { ChildOption } from '@/typings/report';

const TOPUP_PRESETS = [50000, 100000, 200000, 500000];

/**
 * Tab "Xu của tôi" trong "Tài khoản và học phí" — số dư, nạp Xu bằng chuyển
 * khoản (QR, tỷ lệ 1.000đ = 1 Xu, Admin xác nhận thủ công), lịch sử biến
 * động Xu. Nội dung giữ nguyên từ trang /coin cũ + thêm khối nạp Xu.
 */
export default function CoinPanel() {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const [children, setChildren] = React.useState<ChildOption[]>([]);
  const [studentId, setStudentId] = React.useState<number | undefined>(
    access.isStudent ? Number(initialState?.currentUser?.userid) : undefined,
  );
  const [balance, setBalance] = React.useState<
    CoinBalanceResponse | undefined
  >();
  const [transactions, setTransactions] = React.useState<CoinTransactionItem[]>(
    [],
  );
  const [topups, setTopups] = React.useState<CoinTopupResponse[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [amount, setAmount] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrData, setQrData] = React.useState<CoinTopupResponse | undefined>();

  React.useEffect(() => {
    if (!access.isParent) return;
    fetchMyChildren().then((list) => {
      setChildren(list);
      if (list.length > 0) setStudentId(list[0].studentId);
    });
  }, [access.isParent]);

  const reload = React.useCallback(() => {
    if (!studentId) return;
    setLoading(true);
    Promise.all([
      fetchMyCoinBalance(studentId),
      fetchMyCoinTransactions(studentId),
      fetchMyCoinTopups(studentId),
    ])
      .then(([b, tx, tp]) => {
        setBalance(b);
        setTransactions(tx);
        setTopups(tp);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const handleTopup = async () => {
    if (!amount || amount < 10000) {
      message.error('Số tiền nạp tối thiểu 10.000đ');
      return;
    }
    setSubmitting(true);
    try {
      const topup = await createCoinTopup(amount);
      message.success('Đã tạo yêu cầu nạp Xu — quét mã để chuyển khoản');
      setQrData(topup);
      setQrOpen(true);
      setAmount(null);
      reload();
    } catch {
      message.error('Không tạo được yêu cầu nạp Xu');
    } finally {
      setSubmitting(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép');
  };

  const pendingTopups = topups.filter((t) => t.status === 'PENDING');

  return (
    <>
      {access.isParent && children.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Segmented
            value={String(studentId)}
            onChange={(v) => setStudentId(Number(v))}
            options={children.map((c) => ({
              label: c.fullName,
              value: String(c.studentId),
            }))}
          />
        </div>
      )}

      <Panel
        style={{
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: '50%',
            background: '#FBE3A6',
            border: '1.4px solid var(--gold-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-dark)',
          }}
        >
          <CoinIcon width={28} height={28} />
        </div>
        <div>
          <div
            style={{
              fontSize: 12.5,
              color: 'var(--ink-soft)',
              marginBottom: 4,
            }}
          >
            Số dư
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {loading ? '…' : (balance?.balance ?? 0)}{' '}
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--ink-soft)',
              }}
            >
              xu
            </span>
          </div>
        </div>
      </Panel>

      <Panel style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>
          Nạp Xu bằng chuyển khoản
        </div>
        <div
          style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 12 }}
        >
          Tỷ lệ 1.000đ = 1 Xu. Tối thiểu 10.000đ. Xu được cộng sau khi trung tâm
          đối soát và xác nhận đã nhận chuyển khoản.
        </div>
        <Space wrap style={{ marginBottom: 10 }}>
          {TOPUP_PRESETS.map((p) => (
            <OutlineButton key={p} onClick={() => setAmount(p)}>
              {p.toLocaleString('vi-VN')}đ
            </OutlineButton>
          ))}
        </Space>
        <Space>
          <InputNumber
            value={amount}
            onChange={setAmount}
            min={10000}
            step={10000}
            style={{ width: 180 }}
            placeholder="Số tiền (VND)"
            formatter={(v) =>
              v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
            }
            parser={(v) => Number((v ?? '').replace(/\./g, ''))}
          />
          <PrimaryButton onClick={handleTopup} disabled={submitting}>
            {submitting ? 'Đang xử lý…' : 'Tạo yêu cầu nạp Xu'}
          </PrimaryButton>
        </Space>

        {pendingTopups.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--ink-soft)',
                marginBottom: 8,
              }}
            >
              Yêu cầu đang chờ đối soát
            </div>
            <ListCard>
              {pendingTopups.map((t) => (
                <ListRow
                  key={t.id}
                  icon={<CoinIcon width={16} height={16} />}
                  title={`${t.amountVnd.toLocaleString('vi-VN')}đ · ${t.coinAmount.toLocaleString('vi-VN')} Xu`}
                  subtitle={`Mã CK: ${t.paymentCode}`}
                  right={
                    <OutlineButton
                      onClick={() => {
                        setQrData(t);
                        setQrOpen(true);
                      }}
                    >
                      Xem QR
                    </OutlineButton>
                  }
                />
              ))}
            </ListCard>
          </div>
        )}
      </Panel>

      <ListCard
        title="Lịch sử biến động Xu"
        icon={<CoinIcon width={16} height={16} />}
      >
        <DataTable
          columns={[
            {
              key: 'date',
              title: 'Ngày',
              width: 140,
              render: (r) => (
                <span className="mono">{r.createdAt.slice(0, 10)}</span>
              ),
            },
            {
              key: 'amount',
              title: 'Số xu',
              width: 100,
              render: (r) => (
                <span
                  className="mono"
                  style={{
                    fontWeight: 700,
                    color: r.amount >= 0 ? 'var(--sage)' : 'var(--coral)',
                  }}
                >
                  {r.amount >= 0 ? '+' : ''}
                  {r.amount}
                </span>
              ),
            },
            {
              key: 'balanceAfter',
              title: 'Số dư sau',
              width: 100,
              render: (r) => <span className="mono">{r.balanceAfter}</span>,
            },
            { key: 'reason', title: 'Lý do', render: (r) => r.reason },
          ]}
          dataSource={transactions}
          pageSize={10}
        />
      </ListCard>

      <Drawer
        title="Nạp Xu bằng chuyển khoản"
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        width={360}
      >
        {qrData?.qrPayload && (
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <QRCode value={qrData.qrPayload} size={220} />
            <Typography.Text strong>
              {qrData.amountVnd.toLocaleString('vi-VN')}đ ·{' '}
              {qrData.coinAmount.toLocaleString('vi-VN')} Xu
            </Typography.Text>
            <Space>
              <Typography.Text>
                {qrData.bankName} · {qrData.accountNumber}
              </Typography.Text>
              <OutlineButton
                onClick={() => copyText(qrData.accountNumber ?? '')}
              >
                Sao chép
              </OutlineButton>
            </Space>
            <Typography.Text type="secondary">
              {qrData.accountName}
            </Typography.Text>
            <Space>
              <Typography.Text code>{qrData.paymentCode}</Typography.Text>
              <OutlineButton onClick={() => copyText(qrData.paymentCode)}>
                Sao chép
              </OutlineButton>
            </Space>
          </Space>
        )}
      </Drawer>
    </>
  );
}
