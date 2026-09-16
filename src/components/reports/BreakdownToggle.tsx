import { Segmented } from 'antd';
import React from 'react';
import BreakdownChart from '@/components/charts/BreakdownChart';
import { DIFFICULTY_LABEL, TYPE_LABEL } from '@/components/charts/colors';
import type { BreakdownResponse } from '@/typings/report';

/** Segmented Độ khó/Loại câu + BreakdownChart — dùng lại ở 4 trang báo cáo. */
export default function BreakdownToggle({
  breakdown,
}: {
  breakdown?: BreakdownResponse;
}) {
  const [byType, setByType] = React.useState(false);
  return (
    <div>
      <Segmented
        value={byType ? 'type' : 'difficulty'}
        onChange={(v) => setByType(v === 'type')}
        options={[
          { label: 'Độ khó', value: 'difficulty' },
          { label: 'Loại câu', value: 'type' },
        ]}
      />
      <div style={{ marginTop: 12 }}>
        <BreakdownChart
          buckets={(byType ? breakdown?.byType : breakdown?.byDifficulty) ?? []}
          labelMap={byType ? TYPE_LABEL : DIFFICULTY_LABEL}
        />
      </div>
    </div>
  );
}
