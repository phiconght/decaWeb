import { CameraOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Input, Modal, message, Space, Typography } from 'antd';
import type QrScannerLib from 'qr-scanner';
import React from 'react';

/**
 * WEB/PLAN.md §7 #2 — bọc `qr-scanner` (npm), xin quyền camera, có nút
 * "Nhập mã thủ công" dự phòng khi bị từ chối quyền hoặc thiết bị không có
 * camera (giống `qr_scan_page.dart._manualEntry`).
 *
 * Chỉ hiểu payload dạng `DECA-ROOM:{roomId}:{code}` (chấm công GV — xem
 * MOBILE/lib/schedule/data/models/qr_payload.dart QrPayload.parse) — trả về
 * `code` (phần sau roomId) qua onScan.
 */
export default function QrScanner({
  open,
  onClose,
  onScan,
}: {
  open: boolean;
  onClose: () => void;
  onScan: (roomCode: string) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const scannerRef = React.useRef<QrScannerLib | null>(null);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualValue, setManualValue] = React.useState('');
  const [cameraError, setCameraError] = React.useState<string | null>(null);

  const parseRoomCode = (raw: string): string | null => {
    const value = raw.trim();
    if (value.startsWith('DECA-ROOM:')) {
      const parts = value.split(':');
      if (parts.length >= 3) return parts.slice(2).join(':');
    }
    return null;
  };

  React.useEffect(() => {
    if (!open || manualMode || !videoRef.current) return;
    let cancelled = false;
    let scanner: QrScannerLib | undefined;
    import('qr-scanner').then(({ default: QrScannerCtor }) => {
      if (cancelled || !videoRef.current) return;
      scanner = new QrScannerCtor(
        videoRef.current,
        (result) => {
          const raw = typeof result === 'string' ? result : result.data;
          const code = parseRoomCode(raw);
          if (code) {
            onScan(code);
          } else {
            message.error('Mã QR không hợp lệ — hãy quét mã dán tại phòng học');
          }
        },
        { highlightScanRegion: true, highlightCodeOutline: true },
      );
      scannerRef.current = scanner;
      scanner.start().catch(() => {
        if (!cancelled) {
          setCameraError(
            'Không truy cập được camera. Bạn có thể nhập mã thủ công.',
          );
          setManualMode(true);
        }
      });
    });
    return () => {
      cancelled = true;
      scanner?.stop();
      scanner?.destroy();
      scannerRef.current = null;
    };
  }, [open, manualMode]);

  const handleManualSubmit = () => {
    const code = parseRoomCode(manualValue) ?? manualValue.trim();
    if (!code) {
      message.error('Vui lòng nhập mã phòng');
      return;
    }
    onScan(code);
  };

  return (
    <Modal
      title="Quét QR phòng"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {!manualMode ? (
        <Space direction="vertical" style={{ width: '100%' }} align="center">
          {/* biome-ignore lint/a11y/useMediaCaption: camera preview trực tiếp, không phải media có lời thoại */}
          <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} />
          {cameraError && (
            <Typography.Text type="danger">{cameraError}</Typography.Text>
          )}
          <Button icon={<EditOutlined />} onClick={() => setManualMode(true)}>
            Nhập mã thủ công
          </Button>
        </Space>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Nhập mã phòng (hoặc dán chuỗi DECA-ROOM:...)"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            onPressEnter={handleManualSubmit}
          />
          <Space>
            <Button type="primary" onClick={handleManualSubmit}>
              Xác nhận
            </Button>
            <Button
              icon={<CameraOutlined />}
              onClick={() => setManualMode(false)}
            >
              Dùng camera
            </Button>
          </Space>
        </Space>
      )}
    </Modal>
  );
}
