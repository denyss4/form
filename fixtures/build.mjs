// Builds fixtures/marta-week.json. Run: npm run fixtures
// The seven evening logs are SCRIPTED for the persona Marta (29, product analyst, Warsaw). They are not real user data.
// Every score, range and driver is real output of predict.mjs (model v2-ridge-ef303c083a1a), run over those logs.
import { readFileSync, writeFileSync } from 'node:fs';

import { toFormResult } from '../packages/model/adapter.ts';
import { predict, withHistory } from '../packages/model/predict.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const model = read('../packages/model/model.json');

// Mon 28 Sep to Sun 4 Oct 2026. Each log is that evening's; the forecast is for the next morning.
// `readiness` is that morning's 0-100 self-rating (0-10 slider x 10).
const scripted = [
  {
    date: '2026-09-28', tags: ['work', 'training'], tomorrow_tags: ['work'],
    readiness: 70, sleep_hours: 7.2, sleep_quality: 4, mood: 4, stress: 2, fatigue: 2, soreness: 2,
    workout_minutes: 65, workout_effort: 7, steps: 10400, calories_burned: 3050, very_active_minutes: 52, alcohol: false,
  },
  {
    date: '2026-09-29', tags: ['work'], tomorrow_tags: ['work', 'training'],
    readiness: 65, sleep_hours: 6.8, sleep_quality: 3, mood: 3, stress: 3, fatigue: 3, soreness: 3,
    workout_minutes: 0, steps: 7600, calories_burned: 2750, very_active_minutes: 12, alcohol: false,
  },
  {
    date: '2026-09-30', tags: ['work', 'training'], tomorrow_tags: ['work', 'social'],
    readiness: 60, sleep_hours: 6.2, sleep_quality: 3, mood: 3, stress: 4, fatigue: 3, soreness: 3,
    workout_minutes: 75, workout_effort: 8, steps: 11200, calories_burned: 3150, very_active_minutes: 58, alcohol: false,
  },
  {
    date: '2026-10-01', tags: ['work', 'social'], tomorrow_tags: ['work', 'travel'],
    readiness: 50, sleep_hours: 6.0, sleep_quality: 2, mood: 3, stress: 4, fatigue: 4, soreness: 3,
    workout_minutes: 0, steps: 8300, calories_burned: 2800, very_active_minutes: 10, alcohol: true,
  },
  {
    date: '2026-10-02', tags: ['work'], tomorrow_tags: ['rest'],
    readiness: 45, sleep_hours: 5.8, sleep_quality: 2, mood: 2, stress: 4, fatigue: 4, soreness: 2,
    workout_minutes: 0, steps: 6400, calories_burned: 2650, very_active_minutes: 5, alcohol: false,
  },
  {
    date: '2026-10-03', tags: ['rest'], tomorrow_tags: ['training'],
    readiness: 60, sleep_hours: 8.0, sleep_quality: 4, mood: 4, stress: 2, fatigue: 3, soreness: 2,
    workout_minutes: 0, steps: 9000, calories_burned: 2900, very_active_minutes: 20, alcohol: false,
  },
  {
    date: '2026-10-04', tags: ['training'], tomorrow_tags: ['work'],
    readiness: 55, sleep_hours: 6.1, sleep_quality: 2, mood: 3, stress: 4, fatigue: 4, soreness: 4,
    workout_minutes: 75, workout_effort: 8, steps: 14500, calories_burned: 3100, very_active_minutes: 80, alcohol: true,
  },
];

const days = withHistory(scripted).map((log) => {
  const raw = predict(model, log);
  return { date: log.date, forecastFor: raw.date, log, raw, result: toFormResult(raw) };
});

const out = {
  meta: {
    kind: 'scripted persona',
    persona: 'Marta, 29, product analyst, Warsaw',
    note: 'The logs are scripted. Scores, ranges and drivers are real predict.mjs output.',
    model_version: model.version,
    demoToday: '2026-10-05', // [GAP G23: the scripted demo clock is a proposal. The last forecast is for this morning.]
  },
  days,
};

writeFileSync(new URL('./marta-week.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.table(
  days.map((d) => ({
    forecastFor: d.forecastFor,
    score: d.result.score,
    range: d.result.range.join('–'),
    drivers: d.result.drivers.map((x) => `${x.label} ${x.direction === 'up' ? '+' : '-'}${x.magnitude}`).join(', '),
    inputs: `${d.result.confidence.used}/${d.result.confidence.total}`,
  })),
);
