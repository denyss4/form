// Colour tokens (MASTER_PROMPT §5.1). Light is primary. A new colour needs the user's approval.
// No imports, so `node --test` can load this file through the adapter.

export type PlanId = 'hard' | 'light' | 'recover' | 'deepwork';
export const planIds: readonly PlanId[] = ['hard', 'light', 'recover', 'deepwork'];

export interface ColorTokens {
  bg: { canvas: string; raised: string };
  text: { primary: string; secondary: string };
  stroke: { control: string; hairline: string };
  plan: Record<PlanId, { base: string; field: string }>;
}

export const lightColor: ColorTokens = {
  bg: {
    canvas: '#F3F6FA', // "Dawn"
    raised: '#FFFFFF',
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

// Dark theme: defined by the Master, secondary for the demo.
// [GAP G8: the dark hairline and the dark plan-field tints are not specified. Placeholders reuse `raised`; no new colour.]
// [GAP G9: the control stroke on `raised` is 2.91:1, below 3:1. The spec value is kept until a replacement is approved.]
export const darkColor: ColorTokens = {
  bg: {
    canvas: '#0E1B2A',
    raised: '#172A3E',
  },
  text: {
    primary: '#E8EEF5',
    secondary: '#9DB0C3',
  },
  stroke: {
    control: '#5C7189',
    hairline: '#172A3E',
  },
  plan: {
    hard: { base: '#FF8A66', field: '#172A3E' },
    light: { base: '#F2BE5C', field: '#172A3E' },
    recover: { base: '#6FB9DB', field: '#172A3E' },
    deepwork: { base: '#A99BF2', field: '#172A3E' },
  },
};

// [GAP G20: the Master gives no opacity values. These are proposals; revisit at Review 1.]
export const opacity = {
  disabled: 0.4,
  track: 0.16, // ScoreDial track: the plan colour, faint
} as const;
