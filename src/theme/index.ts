export { colors } from './colors';
export type { ColorName } from './colors';
export { fonts, textVariants, MAX_FONT_SCALE } from './typography';
export type { TextVariant } from './typography';

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

// Android's accessibility guideline is 48dp; most Kayod buttons are larger.
export const TAP_MIN = 48;
export const BUTTON_HEIGHT = 56;
