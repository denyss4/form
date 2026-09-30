// Seven type styles (MASTER_PROMPT §5.3). Sentence case. Manrope only for display, never for paragraphs, never italic.
import type { TextStyle } from 'react-native';

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

// Every value that changes uses tabular numerals.
export const tabularFigures: TextStyle = { fontVariant: ['tabular-nums'] };

// Below about 20 pt (widgets, watch complications) the display token maps to the system font.
export const systemDisplay = (token: TypeToken): TextStyle => ({
  ...type[token],
  fontFamily: undefined,
  fontWeight: '700',
});

// The score scales with Dynamic Type up to this multiple inside the dial: a number cannot wrap.
export const scoreMaxFontScale = 1.3;

// Navigation chrome has a fixed height, so its labels stop growing here, as the platforms' own tab bars do.
export const chromeMaxFontScale = 1.3;

// A screen title is one short word on some screens ("Progress") and cannot wrap. At 3x it broke mid-word, so it stops growing at 2x.
// [GAP G34: a proposal. The body text and everything else still scales fully.]
export const titleMaxFontScale = 2;
