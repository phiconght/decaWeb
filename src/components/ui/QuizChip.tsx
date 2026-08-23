import React from 'react';
import { PostIcon } from '@/components/icons';
import Chip from '@/components/ui/Chip';
import type { ChipVariant } from '@/theme/tokens';

/** Ánh xạ `.quiz-chip` — 1 dòng đề thi trong buổi/chuyên đề. */
export default function QuizChip({
  label,
  tag,
  tagVariant = 'cobalt',
}: {
  label: React.ReactNode;
  tag?: React.ReactNode;
  tagVariant?: ChipVariant;
}) {
  return (
    <div
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
      }}
    >
      <PostIcon width={14} height={14} stroke="var(--cobalt)" />
      <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
      {tag && (
        <span style={{ marginLeft: 'auto' }}>
          <Chip variant={tagVariant}>{tag}</Chip>
        </span>
      )}
    </div>
  );
}
