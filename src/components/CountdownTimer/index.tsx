import { Statistic } from 'antd';
import React from 'react';

/**
 * WEB/PLAN.md §7 #4, §12 #2 — làm bài thi trên web dễ bị can thiệp hơn app
 * (throttle tab, DevTools...). KHÔNG tin `setInterval` đếm lùi đơn thuần
 * (trôi giờ nếu tab bị throttle) — tính lại chênh lệch so với `deadline`
 * (từ BE) mỗi khi tab quay lại `visible`, bọc quanh `Statistic.Countdown`
 * bằng cách đổi `key` để buộc remount lấy mốc mới.
 */
export default function CountdownTimer({
  deadline,
  onExpire,
}: {
  deadline: string;
  onExpire: () => void;
}) {
  const [resyncTick, setResyncTick] = React.useState(0);
  const expiredRef = React.useRef(false);

  React.useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setResyncTick((t) => t + 1);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const deadlineMs = new Date(deadline).getTime();

  React.useEffect(() => {
    if (deadlineMs <= Date.now() && !expiredRef.current) {
      expiredRef.current = true;
      onExpire();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resyncTick, deadlineMs]);

  return (
    <Statistic.Countdown
      key={resyncTick}
      value={deadlineMs}
      onFinish={() => {
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpire();
        }
      }}
      format="HH:mm:ss"
    />
  );
}
