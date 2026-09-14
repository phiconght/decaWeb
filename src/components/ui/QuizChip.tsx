import React from 'react';
import { ChevronRightIcon, DownloadIcon, PostIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';
import type { ChipVariant } from '@/theme/tokens';

/**
 * Ánh xạ `.quiz-chip` — 1 dòng đề thi trong buổi/chuyên đề. Bấm vào cả dòng
 * để vào làm bài khi `onClick` có (đề đã/đang mở); nút tải PDF luôn hiện
 * riêng, không phụ thuộc trạng thái đề (chặn quyền ở BE).
 */
export default function QuizChip({
  label,
  tag,
  tagVariant = 'cobalt',
  onClick,
  onDownload,
  downloading,
}: {
  label: React.ReactNode;
  tag?: React.ReactNode;
  tagVariant?: ChipVariant;
  onClick?: () => void;
  onDownload?: () => void;
  downloading?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12.5,
        color: 'var(--ink-soft)',
        background: 'var(--paper)',
        border: '1px solid var(--line-soft)',
        borderRadius: 10,
        padding: '8px 12px',
        marginTop: 8,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <PostIcon width={14} height={14} stroke="var(--cobalt)" />
      <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
      {tag && <Chip variant={tagVariant}>{tag}</Chip>}
      {onDownload && (
        <button
          type="button"
          title="Tải đề thi PDF"
          disabled={downloading}
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: 4,
            color: 'var(--cobalt)',
            cursor: downloading ? 'default' : 'pointer',
            opacity: downloading ? 0.5 : 1,
          }}
        >
          <DownloadIcon width={16} height={16} />
        </button>
      )}
      {onClick && (
        <ChevronRightIcon width={14} height={14} color="var(--ink-faint)" />
      )}
    </div>
  );
}
