import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CountdownTimer from './index';

describe('CountdownTimer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('gọi onExpire ngay nếu deadline đã ở quá khứ', () => {
    const onExpire = vi.fn();
    const past = new Date(Date.now() - 1000).toISOString();
    render(<CountdownTimer deadline={past} onExpire={onExpire} />);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('KHÔNG gọi onExpire khi deadline còn ở tương lai', () => {
    const onExpire = vi.fn();
    const future = new Date(Date.now() + 60_000).toISOString();
    render(<CountdownTimer deadline={future} onExpire={onExpire} />);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('tính lại khi tab quay về visible (visibilitychange)', () => {
    const onExpire = vi.fn();
    const soon = new Date(Date.now() + 500).toISOString();
    render(<CountdownTimer deadline={soon} onExpire={onExpire} />);
    expect(onExpire).not.toHaveBeenCalled();

    // Giả lập thời gian trôi qua deadline trong lúc tab ẩn (throttle),
    // rồi tab quay lại visible — phải tự phát hiện đã hết giờ.
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 1000);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});
