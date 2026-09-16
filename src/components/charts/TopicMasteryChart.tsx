import { Bar, Radar } from '@ant-design/plots';
import { Empty } from 'antd';
import type { TopicMasteryItem } from '@/typings/report';

// Copy từ ADMIN/src/pages/report/components/TopicMasteryChart.tsx (§1 #9).
const TopicMasteryChart = ({
  items,
  height = 320,
}: {
  items: TopicMasteryItem[];
  height?: number;
}) => {
  const withData = items.filter((t) => t.masteryPct != null);
  if (!withData.length) {
    return (
      <Empty
        description="Chưa có dữ liệu"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const rows = withData.map((t) => ({
    topic: t.topicName,
    value: Math.round((t.masteryPct as number) * 1000) / 10,
  }));

  if (rows.length > 8) {
    return (
      <Bar
        height={Math.max(height, rows.length * 32)}
        data={rows}
        xField="topic"
        yField="value"
        scale={{ y: { domainMin: 0, domainMax: 100 } }}
        axis={{ x: { title: false }, y: { title: '%' } }}
        style={{ fill: '#1677ff' }}
        tooltip={{ channel: 'y', valueFormatter: (v: number) => `${v}%` }}
      />
    );
  }

  return (
    <Radar
      height={height}
      data={rows}
      xField="topic"
      yField="value"
      scale={{ y: { domainMin: 0, domainMax: 100 } }}
      area={{ style: { fillOpacity: 0.3 } }}
      style={{ lineWidth: 2 }}
      axis={{ x: { title: false }, y: { title: false } }}
      tooltip={{ channel: 'y', valueFormatter: (v: number) => `${v}%` }}
    />
  );
};

export default TopicMasteryChart;
