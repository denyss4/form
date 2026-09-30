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

  // Dev-only screens (P0). Removed or hidden behind the dev state picker later.
  dev: {
    appName: 'Form',
    exampleNote: 'Example log from the model kit.',
    typeLink: 'Open type check',
    typeTitle: 'Type check',
    typeNote: 'Polish glyphs and tabular digits in every family and weight in use.',
    polishSample: 'Łódź, żółć, gęś, ĄĆĘŁŃÓŚŹŻ',
    digitsSample: '0123456789 −4 +7 34–68',
    widthProbe: ['1111111111', '8888888888'],
    back: 'Back',
  },
} as const;

export type InputId = keyof typeof copy.inputs;
