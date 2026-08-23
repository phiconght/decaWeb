import { ProCard } from '@ant-design/pro-components';
import { Statistic } from 'antd';
import React from 'react';
import { scoreColor } from '@/components/charts/colors';

/** WEB/PLAN.md §7 #3 — thẻ điểm dùng lại ở Báo cáo và Khóa học. */
export default function ScoreCard({
  score,
  maxScore,
  label,
  onClick,
}: {
  score?: number;
  maxScore?: number;
  label: string;
  onClick?: () => void;
}) {
  const ratio = score != null && maxScore ? score / maxScore : undefined;
  return (
    <ProCard
      hoverable={!!onClick}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Statistic
        title={label}
        value={score != null ? score : '—'}
        suffix={maxScore != null ? `/ ${maxScore}` : undefined}
        valueStyle={{ color: scoreColor(ratio) }}
      />
    </ProCard>
  );
}
