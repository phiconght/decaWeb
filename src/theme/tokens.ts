/**
 * Bản JS/TS của design token trong src/global.less (:root) — dùng ở nơi
 * không đọc được CSS variable trực tiếp (ConfigProvider theme, inline style
 * tính toán, sau này là màu biểu đồ). Đổi màu thì sửa CẢ HAI file cùng lúc
 * (global.less là nguồn hiển thị, file này là nguồn cho logic JS).
 */
export const tokens = {
  paper: '#F7F4EC',
  card: '#FFFFFF',
  cardWarm: '#FFFDF8',
  ink: '#1C1B2E',
  inkSoft: '#6E6C82',
  inkFaint: '#A7A4B8',
  line: '#E9E4D8',
  lineSoft: '#EFEBE1',
  cobalt: '#2E43E8',
  cobaltDark: '#1E2FB8',
  cobaltTint: '#EBEDFC',
  coral: '#FF5D6C',
  coralTint: '#FFEAEC',
  gold: '#F2A93B',
  goldDark: '#C97F1B',
  sage: '#2FAE7A',
  sageTint: '#E7F7EF',
  radiusLg: 20,
  radiusMd: 14,
  radiusSm: 10,
} as const;

export type ChipVariant = 'sage' | 'gold' | 'cobalt' | 'coral' | 'neutral';

export const chipColors: Record<ChipVariant, { bg: string; fg: string }> = {
  sage: { bg: tokens.sageTint, fg: tokens.sage },
  gold: { bg: '#FBF0DC', fg: tokens.goldDark },
  cobalt: { bg: tokens.cobaltTint, fg: tokens.cobaltDark },
  coral: { bg: tokens.coralTint, fg: tokens.coral },
  neutral: { bg: tokens.lineSoft, fg: tokens.inkSoft },
};

/**
 * `src/utils/statusMeta.ts` trả màu kiểu antd Tag ('gold'/'green'/'blue'/
 * 'red'/'default') — map sang ChipVariant để dùng chung 1 bảng màu thiết kế
 * mới, không phải viết lại bảng trạng thái cho từng module.
 */
export function toChipVariant(antdColor: string): ChipVariant {
  switch (antdColor) {
    case 'green':
      return 'sage';
    case 'gold':
      return 'gold';
    case 'blue':
      return 'cobalt';
    case 'red':
      return 'coral';
    default:
      return 'neutral';
  }
}
