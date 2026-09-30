// Every user-facing string lives here (DECISIONS.md #6). English only.
// Keep strings short enough to survive +30% for Polish (P5 pseudo-localisation test).
// Wording rules: MASTER_PROMPT §7. Explanations may cite only drivers the model returned.

export const copy = {
  range: (lo: number, hi: number) => `Likely ${lo}–${hi}`,
  inputsBasis: (used: number, total: number) => `Based on ${used} of ${total} inputs`,
  basis: {
    typical: 'vs. a typical day',
    personal: 'vs. your usual',
  },
  noDrivers: 'Your usual level',
  whyHeading: (score: number) => `Why ${score}`,

  plan: {
    hard: 'Train hard',
    light: 'Train light',
    recover: 'Recover',
    deepwork: 'Deep-work day',
  },

  dial: {
    label: (score: number, lo: number, hi: number) =>
      `Form score ${score}. Likely ${lo} to ${hi}.`,
    empty: 'No score yet',
  },

  driver: {
    value: (direction: 'up' | 'down', magnitude: number) =>
      `${direction === 'up' ? '+' : '−'}${Math.round(magnitude)}`,
    a11y: (label: string, direction: 'up' | 'down', magnitude: number, basis: string) =>
      `${label}, ${direction === 'up' ? 'adds' : 'takes away'} ${Math.round(magnitude)} points, ${basis}`,
  },

  // Model driver groups, keyed by the id the adapter derives from the group name.
  drivers: {
    'recent-readiness': 'Recent readiness',
    sleep: 'Sleep',
    'mood-and-stress': 'Mood and stress',
    'fatigue-and-soreness': 'Fatigue and soreness',
    'training-load': 'Training load',
    'daily-activity': 'Daily activity',
    alcohol: 'Alcohol',
    'tomorrows-day-type': "Tomorrow's day type",
  } as Record<string, string>,

  // Inputs a person can add, used for the gentle "skipped input" prompt.
  inputs: {
    readiness: 'Morning readiness',
    sleep_hours: 'Sleep hours',
    sleep_quality: 'Sleep quality',
    mood: 'Mood',
    stress: 'Stress',
    fatigue: 'Fatigue',
    soreness: 'Soreness',
    workout_minutes: 'Workout minutes',
    steps: 'Steps',
    calories_burned: 'Calories burned',
    very_active_minutes: 'Active minutes',
  },

  // Dev-only screens. Hidden or removed before the demo build.
  dev: {
    appName: 'Form',
    exampleNote: 'Example log from the model kit.',
    galleryLink: 'Open gallery',
    typeLink: 'Open type check',
    typeTitle: 'Type check',
    typeNote: 'Polish glyphs and tabular digits in every family and weight in use.',
    polishSample: 'Łódź, żółć, gęś, ĄĆĘŁŃÓŚŹŻ',
    digitsSample: '0123456789 −4 +7 34–68',
    widthProbe: ['1111111111', '8888888888'],
    probeTitle: 'Digit width probe',
    back: 'Back',

    hub: {
      title: 'Gallery',
      note: 'Every token and component in every state. Dev only.',
      tokens: 'Tokens',
      type: 'Type check',
      button: 'Button',
      plan: 'Plan glyphs',
      dial: 'Score dial',
      drivers: 'Drivers',
    },
    picker: {
      title: 'Dev settings',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      textSize: 'Text size, web preview only',
      sizes: ['1×', '1.5×', '2×', '3×'],
    },
    tokens: {
      note: 'Values come from packages/tokens. Contrast is computed from the tokens on screen.',
      colour: 'Colour',
      contrast: 'Contrast',
      contrastNote: 'Text needs 4.5:1. Controls and graphics need 3:1.',
      spacing: 'Spacing',
      radius: 'Radius',
      shadow: 'Shadow',
      shadowNote: 'One token, bottom sheets only.',
      motion: 'Motion',
      sizes: 'Size',
      pass: 'pass',
      fail: 'fail',
    },
    button: {
      note: 'Press the default buttons to feel the real press state. The others are held in place.',
      sample: 'Save log',
      primary: 'Primary',
      secondary: 'Secondary',
      text: 'Text only',
      states: {
        default: 'Default',
        pressed: 'Pressed',
        focused: 'Focused',
        disabled: 'Disabled',
        loading: 'Loading',
      },
    },
    plan: {
      note: 'Each plan has a glyph and a label. Colour is never the only signal.',
      onCanvas: 'On the canvas',
      onField: 'On its own field',
      glyphs: 'Glyph sizes',
    },
    dial: {
      note: 'A 270-degree arc. The bracket outside it marks the likely range.',
      plan: 'Plan',
      state: 'State',
      states: { today: 'Today', low: 'Lowest', high: 'Highest', day1: 'Day 1' },
      app: 'App size, on the plan field',
      small: 'Widget and watch sizes, on the canvas',
      extremes: 'Score extremes',
      forecastFor: (date: string) => `Forecast for ${date}`,
    },
    drivers: {
      note: 'Up to three. Direction is a glyph, a sign and words, never colour.',
      basis: 'Basis',
      set: 'Drivers',
      sets: { three: 'Three', one: 'One', none: 'None' },
    },
  },
} as const;

export type InputId = keyof typeof copy.inputs;
