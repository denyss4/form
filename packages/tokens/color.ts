// Colour tokens (MASTER_PROMPT §5.1). Dark is the app theme since 1 Oct 2026 (user decision); light stays defined. A new colour needs the user's approval.
// No imports, so `node --test` can load this file through the adapter.

export type PlanId = 'hard' | 'light' | 'recover' | 'deepwork';
export const planIds: readonly PlanId[] = ['hard', 'light', 'recover', 'deepwork'];

export interface ColorTokens {
  bg: { canvas: string; raised: string; scrim: string }; // scrim: behind a bottom sheet, always darker than the screen
  text: { primary: string; secondary: string };
  stroke: { control: string; hairline: string };
  plan: Record<PlanId, { base: string; field: string }>;
}

export const lightColor: ColorTokens = {
  bg: {
    canvas: '#F3F6FA', // "Dawn"
    raised: '#FFFFFF',
    scrim: '#13263A', // Ink
  },
  text: {
    primary: '#13263A', // "Ink"; also the primary button fill
    secondary: '#4A5B6C',
  },
  stroke: {
    control: '#6B7C8D', // needs >= 3:1
    hairline: '#C9D3DD', // decorative only
  },
  plan: {
    hard: { base: '#B83A1B', field: '#FBE8E1' }, // "Ember"
    light: { base: '#8A5A10', field: '#FAF0DA' }, // "Ochre"
    recover: { base: '#1F6280', field: '#E1EEF4' }, // "Tide"
    deepwork: { base: '#51479E', field: '#ECE9F7' }, // "Iris"
  },
};

// Dark theme: the app theme (user decision, 1 Oct 2026), minimalist: one flat canvas.
// No colour field on Today in dark (user decision, 1 Oct 2026): every field equals the canvas, so the plan shows only in the title,
// its glyph and the dial arc. The dial's reveal cover is drawn in the field colour, so the field must equal what is behind the dial.
// [GAP G8: the dark hairline is not specified. It reuses `raised`; no new colour.]
// [GAP G9, closed in P5: the spec value #5C7189 was 2.91:1 on `raised`. The light control stroke is reused: 4.05:1 on canvas, 3.40:1 on raised.]
export const darkColor: ColorTokens = {
  bg: {
    canvas: '#0E1B2A',
    raised: '#172A3E',
    scrim: '#0E1B2A', // the dark canvas: Ink would lighten a dark screen
  },
  text: {
    primary: '#E8EEF5',
    secondary: '#9DB0C3',
  },
  stroke: {
    control: '#6B7C8D',
    hairline: '#172A3E',
  },
  plan: {
    hard: { base: '#FF8A66', field: '#0E1B2A' },
    light: { base: '#F2BE5C', field: '#0E1B2A' },
    recover: { base: '#6FB9DB', field: '#0E1B2A' },
    deepwork: { base: '#A99BF2', field: '#0E1B2A' },
  },
};

// [GAP G20: the Master gives no opacity values. These are proposals; revisit at Review 1.]
export const opacity = {
  disabled: 0.4,
  track: 0.16, // ScoreDial track: the plan colour, faint
  scrim: 0.4, // behind a bottom sheet, light theme
  scrimDark: 0.72, // dark theme: the canvas colour needs more cover to push bright text and the dial back
  estimated: 0.75, // a plan glyph on an estimated day: the plan colour, muted. At least 3.3:1 on the canvas for all four (graphics need 3:1)
} as const;
