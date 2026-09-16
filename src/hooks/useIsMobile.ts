import { useEffect, useState } from 'react';

/**
 * true dưới breakpoint (mặc định 768px, tương đương mốc `md` của Ant Design Grid).
 * Dùng khi 1 màn cần đổi hẳn cấu trúc UI giữa desktop/tablet và điện thoại
 * (ví dụ: bảng lịch tuần → xem theo ngày ở Thời khóa biểu), không chỉ đổi CSS.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
