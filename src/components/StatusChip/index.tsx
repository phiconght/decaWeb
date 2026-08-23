import { Tag } from 'antd';
import React from 'react';
import { getStatusMeta, type StatusVariant } from '@/utils/statusMeta';

export default function StatusChip({
  status,
  variant,
}: {
  status: string;
  variant: StatusVariant;
}) {
  const meta = getStatusMeta(variant, status);
  return <Tag color={meta.color}>{meta.label}</Tag>;
}
