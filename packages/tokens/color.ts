// Colour tokens. Dark "Lichen" is the app theme (docs/prompts/REDESIGN-PROMPT.md §1, approved 1 Oct 2026): a muted sage accent on dark
// stone. The light theme is kept for the gallery only and is not maintained (DECISIONS.md, 1 Oct). Re-measure any value you change.
// No imports, so `node --test` can load this file through the adapter.

export type PlanId = 'hard' | 'light' | 'recover' | 'deepwork';
export const planIds: readonly PlanId[] = ['hard', 'light', 'recover', 'deepwork'];

export interface ColorTokens {
  bg: {
    canvas: string;
    raised: string; // the one raised level: sheets, the selected Week column, the tab bar fallback
    sunken: string; // input fill, pressed rows
    scrim: string; // behind a bottom sheet, always darker than the screen
  };
  text: { primary: string; secondary: string };
  stroke: { control: string; hairline: string };
  action: {
    primary: string; // the primary button fill. Sage appears at most once per screen as an action, never as a plan colour or decoration
    pressed: string;
    onPrimary: string; // text and icons on the primary fill
  };
  focus: { ring: string };
  state: { selected: string }; // a chosen option (choice pills), the active tab icon
  status: { success: string; attention: string }; // attention: errors, destructive text, over-limit. Always with an icon and words
  chart: { neutral: string }; // non-plan chart data only, never next to Iris in one chart (tritanopia, REDESIGN Step 1 B)
  plan: Record<PlanId, { base: string; field: string }>;
}

// Light: the previous palette, for the gallery only. New roles reuse existing light values.
export const lightColor: ColorTokens = {
  bg: { canvas: '#F3F6FA', raised: '#FFFFFF', sunken: '#FFFFFF', scrim: '#13263A' },
  text: { primary: '#13263A', secondary: '#4A5B6C' },
  stroke: { control: '#6B7C8D', hairline: '#C9D3DD' },
  action: { primary: '#13263A', pressed: '#4A5B6C', onPrimary: '#F3F6FA' },
  focus: { ring: '#13263A' },
  state: { selected: '#13263A' },
  status: { success: '#1F6280', attention: '#B83A1B' },
  chart: { neutral: '#4A5B6C' },
  plan: {
    hard: { base: '#B83A1B', field: '#FBE8E1' },
    light: { base: '#8A5A10', field: '#FAF0DA' },
    recover: { base: '#1F6280', field: '#E1EEF4' },
    deepwork: { base: '#51479E', field: '#ECE9F7' },
  },
};

// Dark "Lichen". Ratios are WCAG 2.2, verified 1 Oct 2026 (REDESIGN Step 1 B).
export const darkColor: ColorTokens = {
  bg: {
    canvas: '#16181A', // Surface 100
    raised: '#232528', // Surface 200: 1.16:1 vs canvas, so separate with space plus a hairline
    sunken: '#1d1f22', // Text High 15.17:1, Text Muted 5.28:1
    scrim: '#16181A',
  },
  text: {
    primary: '#F5F5F7', // Text High: 16.35:1 on canvas, 14.11:1 on raised, 6.05:1 on glass at its worst case
    secondary: '#8E9298', // Text Muted: 5.69:1 on canvas, 4.91:1 on raised. Never on glass (2.11:1 worst case)
  },
  stroke: {
    control: '#7d828a', // 4.60:1 on canvas, 3.97:1 on raised: input borders, outlined pills, the dial track
    hairline: '#2e3135', // 1.36:1, decorative only
  },
  action: {
    primary: '#b3be8b', // Brand Accent (sage): 9.03:1 on canvas
    pressed: '#9ba47a', // canvas text on it 6.77:1
    onPrimary: '#16181A', // canvas text on sage 9.03:1
  },
  focus: { ring: '#b3be8b' },
  state: { selected: '#b3be8b' },
  status: { success: '#b3be8b', attention: '#C87A65' }, // Status Over: 5.45:1 on canvas
  chart: { neutral: '#94A8B6' }, // Data Muted: 7.24:1 on canvas
  // Fields equal the canvas: there is no field on Today in dark. The plan glow (opacity.glow) is drawn behind the dial instead.
  plan: {
    hard: { base: '#faab3f', field: '#16181A' }, // Marigold 9.29:1 (Q1 accepted 2 Oct after the D0a phone check)
    light: { base: '#eada78', field: '#16181A' }, // Butter 12.54:1 (Q1 accepted 2 Oct)
    recover: { base: '#75d1c5', field: '#16181A' }, // Sea glass 9.90:1
    deepwork: { base: '#b0a6ed', field: '#16181A' }, // Iris 8.07:1
  },
};

export const opacity = {
  disabled: 0.4,
  scrim: 0.4, // behind a bottom sheet, light theme
  scrimDark: 0.72, // dark theme: the canvas colour needs more cover to push bright text and the dial back
  estimated: 0.75, // a plan glyph on an estimated day
  // The one ambient glow on Today: the plan colour at its centre, fading to nothing. 0.16 keeps the dial track at 3.11:1 or more against
  // it for all four plans (0.22 drops it below 3:1) and the score at 11:1 or more (measured 1 Oct 2026).
  glow: 0.16,
  // Glass (expo-blur): the canvas tint over the blur. At 0.70 Text High is 6.05:1 over pure white behind it, the worst case.
  glassTint: 0.7,
} as const;
