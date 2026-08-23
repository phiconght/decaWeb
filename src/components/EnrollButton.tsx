import { message, Modal } from 'antd';
import React from 'react';
import { PrimaryButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import { enrollClass } from '@/services/classCatalog';
import { fetchMyCoinBalance } from '@/services/coin';
import type { ClassCatalogItem } from '@/typings/class';

const money = (n: number) => n.toLocaleString('vi-VN');

/**
 * Nút "Đăng ký · X Xu" dùng chung cho Catalog VÀ khối marketing Trang chủ —
 * tránh lặp logic xác nhận/kiểm tra số dư/gọi API ở 2 nơi. Ẩn hẳn nếu lớp
 * không mở bán qua Xu (coinPrice trống/0).
 */
export default function EnrollButton({
  item,
  isStudent,
  onEnrolled,
}: {
  item: ClassCatalogItem;
  isStudent: boolean;
  onEnrolled: () => void;
}) {
  const [enrolling, setEnrolling] = React.useState(false);

  if (!item.coinPrice || item.coinPrice <= 0) return null;
  if (item.enrolled) return <Chip variant="sage">Đã tham gia</Chip>;
  if (!isStudent) return <Chip variant="gold">{money(item.coinPrice)} Xu</Chip>;

  const coinPrice = item.coinPrice;

  const handleEnroll = async () => {
    let balance: number | undefined;
    try {
      balance = (await fetchMyCoinBalance()).balance;
    } catch {
      balance = undefined;
    }
    const notEnough = balance !== undefined && balance < coinPrice;

    Modal.confirm({
      title: `Đăng ký "${item.name}"`,
      content: notEnough
        ? `Cần ${money(coinPrice)} Xu, bạn chỉ có ${money(balance ?? 0)} Xu — không đủ để đăng ký.`
        : `Đăng ký khóa "${item.name}" sẽ trừ ${money(coinPrice)} Xu` +
          (balance !== undefined ? ` (số dư hiện tại: ${money(balance)} Xu).` : '.') +
          ' Bạn có chắc chắn?',
      okText: notEnough ? 'Đã hiểu' : 'Đăng ký',
      cancelText: notEnough ? undefined : 'Hủy',
      okButtonProps: notEnough ? { danger: true } : undefined,
      cancelButtonProps: notEnough ? { style: { display: 'none' } } : undefined,
      onOk: async () => {
        if (notEnough) return;
        setEnrolling(true);
        try {
          const result = await enrollClass(item.id);
          message.success(
            `Đã đăng ký "${result.className}" — còn ${money(result.newBalance)} Xu.`,
          );
          onEnrolled();
        } catch (e) {
          message.error((e as Error).message || 'Đăng ký thất bại');
        } finally {
          setEnrolling(false);
        }
      },
    });
  };

  return (
    <PrimaryButton
      onClick={handleEnroll}
      disabled={enrolling}
      style={{ width: '100%', justifyContent: 'center', padding: '8px 14px' }}
    >
      {enrolling ? 'Đang xử lý…' : `Đăng ký · ${money(coinPrice)} Xu`}
    </PrimaryButton>
  );
}
