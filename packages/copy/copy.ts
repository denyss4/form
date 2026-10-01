// Every user-facing string lives here (DECISIONS.md #6). English only.
// Keep strings short enough to survive +30% for Polish (P5 pseudo-localisation test).
// Wording rules: MASTER_PROMPT §7. Explanations may cite only drivers the model returned.
import { pseudoLocalise, pseudoRequested } from './pseudo.ts';

const base = {
  range: (lo: number, hi: number) => `Likely ${lo}–${hi}`,
  inputsBasis: (used: number, total: number) => `Based on ${used} of ${total} inputs`,
  basis: {
    typical: 'vs. a typical day',
    personal: 'vs. your usual',
  },
  noDrivers: 'Your usual level',
  whyHeading: 'What moved your score',

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

  today: {
    title: 'Today',
    dateCaption: (date: string) => `Today, ${date}`,
    // Why this plan. This is the plan rule (score band x day type), stated plainly. The drivers below explain the score itself.
    why: {
      hard: (session: string) => `Your score is high, so your ${session} session stays hard.`,
      toned: (session: string) => `Your score is near a typical day, so your ${session} session is kept light.`,
      lightSession: (session: string) => `Your ${session} session is a light one.`,
      lowSession: (session: string) => `Your score is low, so your ${session} session gives way to recovery.`,
      deepwork: 'No session planned. A good day for focused work.',
      lowDay: 'Your score is low, so today is for recovery.',
      travelDay: 'A travel day, so today is for recovery.',
      restDay: 'Nothing planned, so today is for recovery.',
    },
    pulling: (list: string, many: boolean) => `${list} ${many ? 'are' : 'is'} pulling your score down.`,
    helping: (list: string, many: boolean) => `${list} ${many ? 'are' : 'is'} helping.`,
    usual: 'Your score is at your usual level.',
    notUsed: (list: string, more: number) => `Left out of this forecast: ${list}${more > 0 ? ` and ${more} more` : ''}.`,
    fewInputs: 'Few inputs today. Add more for a fuller picture.',
    accept: 'Accept plan',
    accepted: 'Plan accepted.',
    logTonight: 'Log tonight',
    logged: "Logged. Tomorrow's plan arrives in the morning.",
    jump: 'Demo: jump to tomorrow morning',
    day1: {
      title: 'No score yet',
      body: 'Log tonight and Form will forecast tomorrow morning.',
    },
    error: {
      title: "Couldn't calculate your score.",
      body: 'Try again in a moment.',
      retry: 'Try again',
    },
    checkin: {
      nudge: 'One tap to sharpen tomorrow.',
      title: 'How do you feel this morning?',
      hint: "Your rating helps Form check its forecast.",
      low: 'Very low',
      high: 'Very high',
      value: (n: number) => `${n} of 10`,
      unset: 'Not rated',
    },
  },

  log: {
    title: 'Evening log',
    close: 'Close',
    save: 'Save log',
    effort: {
      question: (session: string) => `How hard was your ${session} session?`,
      skipped: 'Skipped',
      easy: 'Easy',
      moderate: 'Moderate',
      hard: 'Hard',
    },
    alcohol: { question: 'Any alcohol today?', no: 'No', yes: 'Yes' },
    unusual: { question: 'Anything unusual today?', no: 'No', yes: 'Yes' },
    fit: {
      question: "Did today's plan fit?",
      optional: 'Optional',
      yes: 'Yes',
      tooHard: 'Too hard',
      tooEasy: 'Too easy',
    },
    remaining: (n: number) => (n === 1 ? 'Answer one more to save.' : `Answer ${n} more to save.`),
    ring: (done: number, total: number) => `${done} of ${total} answered`,
  },

  nav: { back: 'Back', settings: 'Settings' },
  tabs: { today: 'Today', week: 'Week', progress: 'Progress' },
  tag: { work: 'Work', training: 'Training', social: 'Social', travel: 'Travel', rest: 'Rest' },

  onboarding: {
    title: "Plan your week around how you'll feel.",
    intro: 'Form turns a short log and your calendar into one plan for each day.',
    points: [
      'Log tonight in three taps.',
      'Get one plan for tomorrow, with the reasons.',
      'See where your hard sessions fit the week.',
    ],
    start: 'Get started',
    example: 'Example',
    exampleA11y: (score: number, lo: number, hi: number) => `Example: Form score ${score}. Likely ${lo} to ${hi}.`,
    notice: "Form is for planning. It doesn't diagnose or treat anything.",
  },

  // [GAP G26: consent wording is demo text. Where the personal model runs and where data is stored are not decided. Needs legal review.]
  consent: {
    title: 'What Form may use',
    intro: 'Choose for each one. You can change any of them later in Settings.',
    allow: 'Allow',
    decline: 'Not now',
    purposes: {
      scoring: {
        name: 'Score and plan',
        what: 'Your evening log and morning rating, such as effort, alcohol, sleep and mood. Form calculates your score on your phone.',
      },
      personalModel: {
        name: 'Learn your own pattern',
        what: 'Your logs and ratings over time. After 21 days Form checks whether your own pattern predicts you better than the typical one.',
      },
      calendar: {
        name: 'Read your calendar',
        what: 'Event titles and times, to predict day types such as work, training and travel. Form only reads your calendar.',
      },
      health: {
        name: 'Read health data',
        what: 'Steps, calories burned, active minutes and sleep from Apple Health or Health Connect.',
      },
    },
    continue: 'Continue',
    incomplete: 'Choose Allow or Not now for each one to continue.',
    demoNote: 'Demo wording. The final text needs legal review.',
  },

  // [GAP G10: the calendar provider is a proposal.]
  calendar: {
    title: 'Connect your calendar',
    body: 'Form reads event titles and times for the week and predicts each day type: work, training, social, travel or rest.',
    provider: 'Google Calendar',
    mockNote: 'Demo: this is a mock sign-in. No account is used.',
    allow: 'Allow read access',
    skip: 'Skip for now',
    reading: 'Reading your calendar',
    readingNote: 'This takes a moment.',
    error: {
      title: 'Calendar access was denied.',
      body: 'Try again, or continue without a calendar. You can connect one later from Week.',
      retry: 'Try again',
      without: 'Continue without calendar',
    },
    off: {
      title: 'Calendar is off.',
      body: 'You chose Not now for your calendar. Change that in Settings to connect one.',
      settings: 'Open Settings',
      without: 'Continue without calendar',
    },
  },

  week: {
    title: 'Week',
    planNote: "Plans for days ahead follow your calendar. Each morning's score can change them.",
    coverage: (found: number, total: number) => `Events found for ${found} of ${total} days.`,
    lowConfidence: 'Most day types are guessed from the weekday.',
    guessed: 'guessed from the weekday',
    estimated: 'Estimated',
    noSession: 'No session',
    session: (name: string, time: string) => `${name}, ${time}`,
    empty: {
      title: 'No calendar yet',
      body: 'Connect a calendar to see day types and where your hard sessions fit.',
      action: 'Connect calendar',
    },
    error: {
      title: "Couldn't read your calendar.",
      body: 'Check the permission, then try again.',
      retry: 'Try again',
    },
  },

  suggestion: {
    reasons: (list: string) => `${list}.`,
    ask: (session: string, day: string) => `${day} has no session. Move ${session} there?`,
    move: (day: string) => `Move to ${day}`,
    keep: (day: string) => `Keep ${day}`,
    moved: (session: string, day: string) => `Moved ${session} to ${day}.`,
    kept: (session: string, day: string) => `Kept ${session} on ${day}.`,
    preview: (toDay: string, toPlan: string, fromDay: string, fromPlan: string) => `${toDay} becomes ${toPlan}. ${fromDay} becomes ${fromPlan}.`,
  },

  settings: {
    title: 'Settings',
    privacy: 'Privacy',
    privacyNote: 'Change any choice at any time.',
    licences: 'Licences',
    fonts: 'Fonts: Manrope and Source Sans 3, under the SIL Open Font License 1.1.',
    model: 'The model is trained on PMData (Simula, CC BY 4.0).',
    connections: 'Connections',
    healthRow: { label: 'Health data', status: 'Preview, not connected' },
    calendarWriteRow: { label: 'Calendar changes', status: 'Preview, off' },
  },

  progress: {
    title: 'Progress',
    demoNote: 'Demo data: a scripted week for Marta. Not real user data.',
    fit: {
      title: 'Plan fit',
      headline: (fit: number, answered: number) => `The plan fit on ${fit} of ${answered} ${answered === 1 ? 'day' : 'days'}.`,
      source: 'From your own answers to "Did the plan fit?".',
      legend: 'Filled: the plan fit. Outlined: it was too hard or too easy.',
      tooFew: (n: number) => (n === 1 ? 'One day so far. Too few to read much.' : `${n} days so far. Too few to read much.`),
      status: { yes: 'Fit', tooHard: 'Too hard', tooEasy: 'Too easy', none: 'No answer' },
      ring: (fit: number, answered: number) => `Plan fit: ${fit} of ${answered} ${answered === 1 ? 'day' : 'days'}`,
      day: (day: string, plan: string, status: string) => `${day}, ${plan}, ${status}`,
    },
    logging: (days: number, of: number) => `You logged on ${days} of the last ${of} days.`,
    felt: { title: 'Felt vs forecast', note: 'Your morning rating next to what Form forecast.' },
    empty: {
      title: 'No plan feedback yet',
      body: 'Accept a plan, then answer "Did the plan fit?" in your evening log. It shows up here.',
      action: 'Go to Today',
    },
    error: { title: "Couldn't load your history.", body: 'Try again in a moment.', retry: 'Try again' },
  },

  feltVsForecast: {
    title: 'Felt vs forecast',
    intro: 'Each morning you rate how you feel. Here it is next to what Form forecast the evening before.',
    scale: 'Both are on a 0 to 100 scale.',
    legend: { forecast: 'Forecast', felt: 'Felt', range: 'Likely range' },
    row: (felt: number, forecast: number, lo: number, hi: number) => `Felt ${felt}, forecast ${forecast}, likely ${lo}–${hi}`,
    summary: (inside: number, days: number) => `${inside} of ${days} ${days === 1 ? 'day' : 'days'} landed inside the likely range.`,
    outside: 'Outside the likely range',
    a11y: (day: string, felt: number, forecast: number, lo: number, hi: number, inside: boolean) =>
      `${day}: felt ${felt}, forecast ${forecast}, likely ${lo} to ${hi}. ${inside ? 'Inside' : 'Outside'} the likely range.`,
    labelled: (n: number, of: number) => `Labelled days so far: ${n} of ${of}.`,
    learning: 'On day 21 Form checks whether your own pattern predicts you better than the typical one.',
    tooFew: 'Too few days to read much.',
    empty: {
      title: 'No ratings yet',
      body: 'Rate how you feel each morning on Today. Your rating appears here next to the forecast.',
      action: 'Go to Today',
    },
    error: { title: "Couldn't load your history.", body: 'Try again in a moment.', retry: 'Try again' },
  },

  // Mocked permission screens (MASTER_PROMPT §8). Nothing is connected; each says so.
  health: {
    title: 'Health data',
    preview: 'Preview. Nothing is connected in this demo.',
    body: 'Form would read steps, calories burned, active minutes and sleep from Apple Health or Health Connect, so your log fills itself in.',
    allow: 'Allow access (preview)',
    notNow: 'Not now',
    reading: 'Connecting to your health data',
    done: { title: 'Preview only.', body: 'No health data was read.', action: 'Done' },
    error: {
      title: 'Health access was denied.',
      body: 'Try again, or carry on without it. You can connect it later in Settings.',
      retry: 'Try again',
      without: 'Carry on without it',
    },
    off: {
      title: 'Health data is off.',
      body: 'You chose Not now for health data. Change that in Settings to connect it.',
      settings: 'Open Settings',
    },
  },

  calendarWrite: {
    title: 'Calendar changes',
    preview: 'Preview. Nothing is connected in this demo.',
    body: 'Form would add the sessions you accept to your calendar, for example a session you moved to another day. This is separate from reading your calendar, and it stays off unless you allow it.',
    allow: 'Allow changes (preview)',
    notNow: 'Not now',
    reading: 'Connecting to your calendar',
    done: { title: 'Preview only.', body: 'Your calendar was not changed.', action: 'Done' },
    error: {
      title: 'Calendar changes were denied.',
      body: 'Try again, or keep Form read-only. You can change this later in Settings.',
      retry: 'Try again',
      without: 'Keep it read-only',
    },
    off: {
      title: 'Calendar is off.',
      body: 'Changes need calendar access first. Turn your calendar on in Settings.',
      settings: 'Open Settings',
    },
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
      range: 'Range bar',
      screens: 'Screens',
      model: 'Model check',
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
      estimated: 'Estimated day: muted glyph, dashed, and the word',
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
    range: {
      note: "Marta's real forecast and likely range for one morning. Only the felt value changes, to show each state.",
      states: { inside: 'Felt inside the range', below: 'Felt below the range', above: 'Felt above the range', edge: 'Felt on the edge of the range' },
    },
    screens: {
      note: 'Every screen in every state. Dev only.',
      groups: [
        { title: 'Today', links: [['Default', '/today?state=default'], ['Reveal, 40%', '/today?state=default&reveal=0.4'], ['Loading', '/today?state=loading'], ['Day 1', '/today?state=day1'], ['Partial, 6 of 11 inputs', '/today?state=partial'], ['Low confidence, 2 of 11', '/today?state=lowconf'], ['Error', '/today?state=error'], ['Evening log open', '/today?state=default&log=open']] },
        { title: 'Onboarding', links: [['Default', '/onboarding'], ['Intro frame at 30%', '/onboarding?intro=0.3'], ['Intro frame at 65%', '/onboarding?intro=0.65']] },
        { title: 'Consent', links: [['Nothing answered', '/consent'], ['Partly answered', '/consent?preset=partial'], ['All answered', '/consent?preset=all']] },
        { title: 'Connect calendar', links: [['Default', '/connect-calendar?state=default'], ['Loading', '/connect-calendar?state=loading'], ['Error', '/connect-calendar?state=error'], ['Calendar consent off', '/connect-calendar?state=off']] },
        { title: 'Week', links: [['Default', '/week?state=default'], ['Loading', '/week?state=loading'], ['No calendar', '/week?state=empty'], ['Partial, 3 of 7 days', '/week?state=partial'], ['Low confidence, 1 of 7 days', '/week?state=lowconf'], ['Error', '/week?state=error']] },
        { title: 'Progress', links: [['Default', '/progress?state=default'], ['Loading', '/progress?state=loading'], ['No feedback yet', '/progress?state=empty'], ['Partial, 3 days', '/progress?state=partial'], ['Low confidence, 1 day', '/progress?state=lowconf'], ['Error', '/progress?state=error']] },
        { title: 'Felt vs forecast', links: [['Default', '/felt-vs-forecast?state=default'], ['Loading', '/felt-vs-forecast?state=loading'], ['No ratings yet', '/felt-vs-forecast?state=empty'], ['Outside range, 1 day', '/felt-vs-forecast?state=outside'], ['Partial, 3 days', '/felt-vs-forecast?state=partial'], ['Low confidence, 1 day', '/felt-vs-forecast?state=lowconf'], ['Error', '/felt-vs-forecast?state=error']] },
        { title: 'Health data, preview', links: [['Default', '/health-sync?state=default'], ['Connecting', '/health-sync?state=loading'], ['Done', '/health-sync?state=done'], ['Error', '/health-sync?state=error'], ['Consent off', '/health-sync?state=off']] },
        { title: 'Calendar changes, preview', links: [['Default', '/calendar-write?state=default'], ['Connecting', '/calendar-write?state=loading'], ['Done', '/calendar-write?state=done'], ['Error', '/calendar-write?state=error'], ['Calendar off', '/calendar-write?state=off']] },
        { title: 'Other', links: [['Settings', '/settings']] },
      ],
    },
    model: {
      title: 'Model check',
      note: 'The model kit example log run through predict(). The P0 check for the demo phone.',
    },
    drivers: {
      note: 'Up to three. Direction is a glyph, a sign and words, never colour.',
      basis: 'Basis',
      set: 'Drivers',
      sets: { three: 'Three', one: 'One', none: 'None' },
    },
  },
} as const;

// The Polish-length test swaps in a grown copy of every string (see pseudo.ts). A normal run uses the real one.
export const copy: typeof base = pseudoRequested() ? pseudoLocalise(base) : base;

export type InputId = keyof typeof base.inputs;
