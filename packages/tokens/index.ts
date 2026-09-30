// Form design tokens. P0 seed: light colour, spacing, size, type (MASTER_PROMPT §5).
// P1 adds radius, motion, shadow and the dark theme. Hard-coded values are allowed only in this folder.
import type { TextStyle } from 'react-native';

export const color = {
  bg: {
    canvas: '#F3F6FA', // "Dawn"
    raised: '#FFFFFF',
  },
  text: {
    primary: '#13263A', // "Ink"
    secondary: '#4A5B6C',
  },
  stroke: {
    control: '#6B7C8D',
    hairline: '#C9D3DD', // decorative only
  },
  plan: {
    hard: { base: '#B83A1B', field: '#FBE8E1' }, // "Ember"
    light: { base: '#8A5A10', field: '#FAF0DA' }, // "Ochre"
    recover: { base: '#1F6280', field: '#E1EEF4' }, // "Tide"
    deepwork: { base: '#51479E', field: '#ECE9F7' }, // "Iris"
  },
} as const;

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  margin: 20, // documented exception to the scale: horizontal screen margin
} as const;

export const size = {
  touch: 48, // covers 44 pt on iOS and 48 dp on Android
} as const;

// One fontFamily per weight: React Native cannot select weights from the variable files.
export const font = {
  display600: 'Manrope-SemiBold',
  display700: 'Manrope-Bold',
  display800: 'Manrope-ExtraBold',
  body400: 'SourceSans3-Regular',
  body600: 'SourceSans3-SemiBold',
} as const;

export type TypeToken = 'score' | 'title' | 'heading' | 'plan' | 'body' | 'bodyStrong' | 'caption';

export const type: Record<TypeToken, TextStyle> = {
  score: {
    fontFamily: font.display800,
    fontSize: 72,
    lineHeight: 72,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  title: { fontFamily: font.display700, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: font.display600, fontSize: 20, lineHeight: 26 },
  plan: { fontFamily: font.display700, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: font.body400, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: font.body600, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: font.body400, fontSize: 13, lineHeight: 18 },
};
