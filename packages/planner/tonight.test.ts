// Run: npm test   (Node built-in test runner, no dependency)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { forecast } from '../model/forecast.ts';
import { buildLog } from './dailyLog.ts';
import { bandOf, planForDay } from './plan.ts';
import { buildWeek } from './week.ts';
import type { CalEvent } from './week.ts';

const read = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const model = read('../model/model.json');
const cal = read('../../fixtures/marta-calendar.json');
const marta = read('../../fixtures/marta-week.json');
const week = buildWeek(cal.events as CalEvent[], cal.meta.weekStart);
const history = marta.days.map((d: { log: unknown }) => d.log);

test('score bands', () => {
  assert.equal(bandOf(39), 'low');
  assert.equal(bandOf(40), 'mid');
  assert.equal(bandOf(59), 'mid');
  assert.equal(bandOf(60), 'high');
});

test('the plan engine: score band x day type', () => {
  const [mon, , wed, , fri, , sun] = week;
  // Monday has a hard session (Push). A mid score tones it down; a high score keeps it; a low score recovers.
  assert.equal(planForDay(51, mon.tags, mon.sessions), 'light');
  assert.equal(planForDay(66, mon.tags, mon.sessions), 'hard');
  assert.equal(planForDay(35, mon.tags, mon.sessions), 'recover');
  // The plan changes when the day changes from a work day to a training day, at the same score.
  assert.equal(planForDay(51, wed.tags, wed.sessions), 'deepwork');
  assert.equal(planForDay(51, mon.tags, mon.sessions), 'light');
  assert.equal(planForDay(51, fri.tags, fri.sessions), 'recover'); // travel
  assert.equal(planForDay(51, sun.tags, sun.sessions), 'recover'); // rest
});

test('the evening log maps the 3 taps to model inputs', () => {
  const log = buildLog({
    today: week[0],
    tomorrow: week[1],
    answers: { effort: 'hard', alcohol: true, unusual: false },
    readiness10: 6,
  });
  assert.equal(log.date, '2026-10-05');
  assert.deepEqual(log.tags, ['work', 'training']);
  assert.deepEqual(log.tomorrow_tags, ['work', 'training']);
  assert.equal(log.workout_minutes, 75); // Push, 18:00 to 19:15
  assert.equal(log.workout_effort, 8);
  assert.equal(log.readiness, 60);
  assert.equal(log.alcohol, true);
});

test('skipping training, or a day with no session, means no workout minutes', () => {
  const skipped = buildLog({ today: week[0], answers: { effort: 'skipped', alcohol: false, unusual: false } });
  assert.equal(skipped.workout_minutes, 0);
  assert.equal(skipped.workout_effort, undefined);
  const noSession = buildLog({ today: week[2], answers: { alcohol: false, unusual: false } });
  assert.equal(noSession.workout_minutes, 0);
});

test("tonight's forecast comes from the real model and reports the inputs it had", () => {
  const log = buildLog({
    today: week[0],
    tomorrow: week[1],
    answers: { effort: 'hard', alcohol: true, unusual: false },
    readiness10: 6,
  });
  const result = forecast(model, history, log);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.range[1] - result.range[0] > 0, true);
  // Only readiness and workout minutes were given, so 9 of 11 inputs are skipped and the score is honest about it.
  assert.equal(result.confidence.total, 11);
  assert.equal(result.confidence.used, 2);
  // Alcohol and training load are among the drivers.
  const ids = result.drivers.map((d) => d.id);
  assert.ok(ids.includes('alcohol'));
  assert.ok(ids.includes('training-load'));
});

test('a rating of the same morning replaces the earlier log for that date', () => {
  const log = buildLog({ today: week[0], answers: { effort: 'easy', alcohol: false, unusual: false }, readiness10: 7 });
  const twice = forecast(model, [...history, { ...log, alcohol: true }], log);
  const once = forecast(model, history, log);
  assert.equal(twice.score, once.score);
});

test('the reason line uses only drivers the model returned', async () => {
  const { explain } = await import('../copy/explain.ts');
  const drivers = [
    { id: 'recent-readiness', label: 'Recent readiness', direction: 'up' as const, basis: 'typical' as const, magnitude: 6 },
    { id: 'training-load', label: 'Training load', direction: 'down' as const, basis: 'typical' as const, magnitude: 4 },
    { id: 'alcohol', label: 'Alcohol', direction: 'down' as const, basis: 'typical' as const, magnitude: 2 },
  ];
  const push = { eventId: 'e02', name: 'Push', start: '18:00', minutes: 75, intensity: 'hard' as const };
  const monday = { band: 'mid' as const, tags: ['work', 'training'] as ('work' | 'training')[], sessions: [push] };
  // The plan's reason (the rule) comes first, then why the score is what it is (the drivers).
  assert.equal(
    explain('light', drivers, monday),
    'Your score is near a typical day, so Push is kept light. Training load and alcohol are pulling your score down.',
  );
  assert.equal(
    explain('hard', [drivers[0]], { ...monday, band: 'high' as const }),
    'Your score is high, so Push stays a hard session. Recent readiness is helping.',
  );
  assert.equal(
    explain('deepwork', [], { band: 'mid', tags: ['work'], sessions: [] }),
    'No session planned. A good day for focused work. Your score is at your usual level.',
  );
  const low = explain('recover', [], { band: 'low', tags: ['work', 'training'], sessions: [push] });
  assert.equal(low, 'Your score is low, so Push gives way to recovery. Your score is at your usual level.');
  // Never a driver the model did not return: no sleep anywhere.
  assert.ok(!/sleep/i.test(explain('light', drivers, monday)) && !/sleep/i.test(low));
});
