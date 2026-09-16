import { Bar } from '@ant-design/plots';
import { Empty } from 'antd';
import { tokens } from '@/theme/tokens';
import type { ExamScoreDistribution } from '@/typings/report';

/**
 * Phổ điểm TỔNG của khóa — mirror MOBILE `CourseScoreSpectrum` (đó là
 * histogram ngang vẽ tay bằng CustomPaint; ở đây dùng bar chart chuẩn của
 * `@ant-design/plots`, cùng thông tin, khác kỹ thuật vẽ).
 */
export default function CourseScoreSpectrum({
  data,
}: {
  data?: ExamScoreDistribution;
}) {
  if (!data || data.bands.length === 0) {
    return (
      <Empty
        description="Chưa đủ dữ liệu phổ điểm"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }
  const rows = data.bands.map((b) => ({
    band: `${b.fromScore.toFixed(1)}–${b.toScore.toFixed(1)}`,
    count: b.count,
    mine: b.containsStudent,
  }));
  const caption =
    data.studentScore != null
      ? `Con cao hơn ${data.percentile ?? 0}% các bạn · TB khóa ${data.classAverage ?? '—'} · ${
          data.submittedCount ?? 0
        } HV`
      : `TB khóa ${data.classAverage ?? '—'} · trung vị ${data.median ?? '—'} · ${
          data.submittedCount ?? 0
        } HV`;

  return (
    <div>
      <Bar
        height={Math.max(260, rows.length * 24)}
        data={rows}
        xField="band"
        yField="count"
        colorField="mine"
        scale={{
          color: { domain: [true, false], range: [tokens.cobalt, '#B45309'] },
        }}
        axis={{ x: { title: false }, y: { title: false } }}
        legend={false}
      />
      <div
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--ink-soft)',
          marginTop: 6,
        }}
      >
        {caption}
      </div>
    </div>
  );
}
