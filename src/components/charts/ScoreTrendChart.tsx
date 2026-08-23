import { Line } from '@ant-design/plots';
import { Empty } from 'antd';
import type { ScoreTrendPoint } from '@/typings/report';
import { REPORT_COLORS } from './colors';

// Copy từ ADMIN/src/pages/report/components/ScoreTrendChart.tsx (§1 #9).
const ScoreTrendChart = ({ points, height = 280 }: { points: ScoreTrendPoint[]; height?: number }) => {
  if (!points.length) {
    return <Empty description="Chưa có dữ liệu" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const pct = (v?: number, max?: number) =>
    v != null && max != null && max > 0 ? Math.round((v / max) * 1000) / 10 : null;

  const rows = points.flatMap((p) => {
    const out: { exam: string; series: string; value: number }[] = [];
    const self = pct(p.score, p.maxScore);
    const avg = pct(p.classAverage, p.maxScore);
    if (self != null) out.push({ exam: p.examName, series: 'Điểm của bạn', value: self });
    if (avg != null) out.push({ exam: p.examName, series: 'TB lớp', value: avg });
    return out;
  });

  return (
    <Line
      height={height}
      data={rows}
      xField="exam"
      yField="value"
      colorField="series"
      shapeField="smooth"
      scale={{
        color: { domain: ['Điểm của bạn', 'TB lớp'], range: [REPORT_COLORS.self, REPORT_COLORS.classAvg] },
        y: { domainMin: 0, domainMax: 100 },
      }}
      axis={{ x: { title: false }, y: { title: '%' } }}
      point={{ sizeField: 3 }}
      legend={{ color: { position: 'top' } }}
      tooltip={{ channel: 'y', valueFormatter: (v: number) => `${v}%` }}
    />
  );
};

export default ScoreTrendChart;
