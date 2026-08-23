import { useAccess, useModel } from '@umijs/max';
import { Drawer, message, QRCode, Space, Typography } from 'antd';
import React from 'react';
import { FeeIcon } from '@/components/icons';
import { OutlineButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import { ListCard, ListRow } from '@/components/ui/ListCard';
import { fetchInvoiceQr, fetchMyInvoices } from '@/services/invoice';
import { fetchMyChildren } from '@/services/report';
import { toChipVariant } from '@/theme/tokens';
import type { InvoiceQrResponse, MyInvoiceItem } from '@/typings/invoice';
import type { ChildOption } from '@/typings/report';
import { getStatusMeta } from '@/utils/statusMeta';

/**
 * Tab "Học phí" trong "Tài khoản và học phí" — đợt thu hàng tháng (chuyển
 * khoản) cho các lớp offline (paymentType = POSTPAID_TRANSFER). Nội dung
 * giữ nguyên từ trang /fee cũ (nay gộp vào đây).
 */
export default function FeePanel() {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const [groups, setGroups] = React.useState<
    { child: ChildOption; invoices: MyInvoiceItem[] }[]
  >([]);
  const [ownInvoices, setOwnInvoices] = React.useState<MyInvoiceItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrData, setQrData] = React.useState<InvoiceQrResponse | undefined>();

  React.useEffect(() => {
    setLoading(true);
    if (access.isParent) {
      fetchMyChildren()
        .then(async (children) => {
          const results = await Promise.all(
            children.map(async (child) => ({
              child,
              invoices: await fetchMyInvoices(child.studentId),
            })),
          );
          setGroups(results);
        })
        .finally(() => setLoading(false));
    } else {
      const studentId = Number(initialState?.currentUser?.userid);
      fetchMyInvoices(studentId)
        .then(setOwnInvoices)
        .finally(() => setLoading(false));
    }
  }, [access.isParent, initialState?.currentUser?.userid]);

  const openQr = async (invoiceId: number) => {
    const data = await fetchInvoiceQr(invoiceId);
    setQrData(data);
    setQrOpen(true);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép');
  };

  const renderInvoiceList = (invoices: MyInvoiceItem[]) => (
    <ListCard>
      {invoices.map((item) => {
        const meta = getStatusMeta('invoice', item.status);
        return (
          <ListRow
            key={item.id}
            icon={<FeeIcon width={18} height={18} />}
            title={item.className}
            subtitle={`${item.periodFrom} → ${item.periodTo} · ${item.sessionCount} buổi · ${item.amount.toLocaleString('vi-VN')}đ`}
            right={
              <>
                <Chip variant={toChipVariant(meta.color)}>{meta.label}</Chip>
                {item.status === 'CONFIRMED' && (
                  <OutlineButton onClick={() => openQr(item.id)}>
                    Thanh toán
                  </OutlineButton>
                )}
              </>
            }
          />
        );
      })}
    </ListCard>
  );

  return (
    <>
      {loading ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Đang tải…</div>
      ) : access.isParent ? (
        groups.length === 0 ? (
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
            Chưa liên kết học viên nào.
          </div>
        ) : (
          groups.map(({ child, invoices }) => (
            <div key={child.studentId} style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 10px' }}>
                {child.fullName}
              </h2>
              {invoices.length === 0 ? (
                <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
                  Chưa có khoản học phí nào cần thanh toán.
                </div>
              ) : (
                renderInvoiceList(invoices)
              )}
            </div>
          ))
        )
      ) : ownInvoices.length === 0 ? (
        <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
          Chưa có khoản học phí nào cần thanh toán.
        </div>
      ) : (
        renderInvoiceList(ownInvoices)
      )}

      <Drawer
        title="Thanh toán học phí"
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        width={360}
      >
        {qrData && (
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <QRCode value={qrData.qrPayload} size={220} />
            <Typography.Text strong>
              {qrData.amount.toLocaleString('vi-VN')}đ
            </Typography.Text>
            <Space>
              <Typography.Text>
                {qrData.bankName} · {qrData.accountNumber}
              </Typography.Text>
              <OutlineButton onClick={() => copyText(qrData.accountNumber)}>
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
