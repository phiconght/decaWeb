import { history } from '@umijs/max';
import { message } from 'antd';
import QRCode from 'qrcode';
import React from 'react';
import { PhoneIcon } from '@/components/icons';
import { PrimaryButton } from '@/components/ui/Buttons';
import Chip from '@/components/ui/Chip';
import { fetchMyRegistration, registerForClass } from '@/services/classCatalog';
import type { ClassPublicDetail, RegistrationResponse } from '@/typings/class';

const money = (n: number) => n.toLocaleString('vi-VN') + 'đ';

/**
 * Khối "Đăng ký khóa học" trên trang chi tiết — giá trọn gói + QR chuyển
 * khoản thật (khóa ONLINE) hoặc chỉ hotline (khóa OFFLINE, đăng ký qua điện
 * thoại thay vì tự chuyển khoản). Admin đối chiếu sao kê thủ công rồi ghi
 * danh (xem docs/DecaMath/.scratch/course-page-design-plan.html Phần 3).
 */
export default function RegisterPanel({
  klass,
  hotline,
  isStudent,
  isGuest,
}: {
  klass: ClassPublicDetail;
  hotline?: string;
  isStudent: boolean;
  isGuest: boolean;
}) {
  const [registration, setRegistration] = React.useState<
    RegistrationResponse | undefined
  >();
  const [qrDataUrl, setQrDataUrl] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [checkedExisting, setCheckedExisting] = React.useState(false);

  const canSelfRegister =
    isStudent && klass.deliveryMode === 'ONLINE' && !klass.enrolled;

  React.useEffect(() => {
    if (!canSelfRegister) {
      setCheckedExisting(true);
      return;
    }
    fetchMyRegistration(klass.id)
      .then((r) => setRegistration(r ?? undefined))
      .finally(() => setCheckedExisting(true));
  }, [klass.id, canSelfRegister]);

  React.useEffect(() => {
    if (!registration?.qrPayload) {
      setQrDataUrl(undefined);
      return;
    }
    QRCode.toDataURL(registration.qrPayload, { margin: 1, width: 240 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(undefined));
  }, [registration?.qrPayload]);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const r = await registerForClass(klass.id);
      setRegistration(r);
    } catch (e) {
      message.error((e as Error).message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!klass.fullPrice || klass.fullPrice <= 0) return null;

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: 20,
      }}
    >
      <div className="mono" style={{ fontSize: 22, fontWeight: 700 }}>
        {money(klass.fullPrice)}
        <span
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-faint)' }}
        >
          /trọn khóa
        </span>
      </div>

      {klass.deliveryMode === 'OFFLINE' ? (
        <div
          style={{
            fontSize: 12.5,
            color: 'var(--ink-soft)',
            margin: '4px 0 16px',
          }}
        >
          Khóa học trực tiếp — gọi hotline để được tư vấn và đăng ký.
        </div>
      ) : (
        <div
          style={{
            fontSize: 12,
            color: 'var(--ink-faint)',
            margin: '2px 0 16px',
          }}
        >
          Admin đối chiếu chuyển khoản &amp; ghi danh thủ công trong 24h
        </div>
      )}

      {klass.enrolled || registration?.status === 'CONFIRMED' ? (
        <Chip variant="sage">Đã tham gia — vào Khóa học của tôi để học</Chip>
      ) : registration?.qrPayload ? (
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            marginBottom: 14,
          }}
        >
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR chuyển khoản đăng ký"
              width={92}
              height={92}
              style={{ borderRadius: 8, flexShrink: 0 }}
            />
          )}
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--ink-soft)',
              lineHeight: 1.55,
            }}
          >
            <b
              style={{ display: 'block', color: 'var(--ink)', marginBottom: 2 }}
            >
              Quét mã để đăng ký
            </b>
            Chuyển khoản đúng số tiền, giữ nguyên nội dung{' '}
            <span
              className="mono"
              style={{
                color: 'var(--ink)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => {
                navigator.clipboard.writeText(registration.registrationCode);
                message.success('Đã sao chép mã đăng ký');
              }}
            >
              {registration.registrationCode}
            </span>{' '}
            để Admin đối chiếu.
          </div>
        </div>
      ) : null}

      {hotline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'var(--cobalt-tint)',
            marginBottom: 14,
          }}
        >
          <PhoneIcon
            width={18}
            height={18}
            style={{ color: 'var(--cobalt)' }}
          />
          <div>
            <div
              className="mono"
              style={{
                fontWeight: 700,
                fontSize: 14.5,
                color: 'var(--cobalt)',
              }}
            >
              {hotline}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>
              Tổng đài hỗ trợ đăng ký
            </div>
          </div>
        </div>
      )}

      {canSelfRegister &&
        checkedExisting &&
        registration?.status !== 'CONFIRMED' && (
          <PrimaryButton
            onClick={handleRegister}
            disabled={loading || !!registration}
            style={{ width: '100%', justifyContent: 'center', padding: 12 }}
          >
            {loading
              ? 'Đang xử lý…'
              : registration
                ? 'Đã tạo yêu cầu đăng ký'
                : 'Đăng ký khóa học'}
          </PrimaryButton>
        )}

      {isGuest && (
        <PrimaryButton
          onClick={() => history.push(`/login?redirect=/catalog/${klass.id}`)}
          style={{ width: '100%', justifyContent: 'center', padding: 12 }}
        >
          Đăng nhập để đăng ký
        </PrimaryButton>
      )}
    </div>
  );
}
