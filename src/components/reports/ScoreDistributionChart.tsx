import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
import { tokens } from '@/theme/tokens';
import type { ExamScoreDistribution } from '@/typings/report';

/** Phổ điểm 1 bài thi (histogram) — mirror MOBILE `ScoreDistributionChart`. */
export default function ScoreDistributionChart({ data }: { data?: ExamScoreDistribution }) {
  if (!data || data.bands.length === 0) {
    return <Empty description="Chưa đủ dữ liệu phổ điểm" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  const rows = data.bands.map((b) => ({
    band: b.toScore.toFixed(0),
    count: b.count,
    mine: b.containsStudent,
  }));
  const caption =
    data.studentScore != null
      ? `Con cao hơn ${data.percentile ?? 0}% các bạn${
          data.rank != null ? ` · hạng ${data.rank}/${data.submittedCount ?? '—'}` : ''
        }`
      : `TB lớp ${data.classAverage ?? '—'} · trung vị ${data.median ?? '—'} · ${
          data.submittedCount ?? 0
        } HV`;

  return (
    <div>
      <Column
        height={220}
        data={rows}
        xField="band"
        yField="count"
        colorField="mine"
        scale={{ color: { domain: [true, false], range: [tokens.cobalt, '#C9C2B4'] } }}
        axis={{ x: { title: false }, y: { title: false } }}
        legend={false}
      />
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-soft)', marginTop: 6 }}>
        {caption}
      </div>
    </div>
  );
}
