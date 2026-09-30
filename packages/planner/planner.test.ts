// Run: npm test   (Node built-in test runner, no dependency)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { addDays, shiftIso, weekdayOf } from './dates.ts';
import { planForDay, withScores } from './plan.ts';
import { applyMove, buildWeek, classify, coverage, suggestMove } from './week.ts';
import type { CalEvent } from './week.ts';

const cal = JSON.parse(readFileSync(new URL('../../fixtures/marta-calendar.json', import.meta.url), 'utf8'));
const events: CalEvent[] = cal.events;
const weekStart: string = cal.meta.weekStart;

test('event titles map to day types', () => {
  assert.equal(classify('Gym: Heavy legs'), 'training');
  assert.equal(classify('Flight WAW-AMS'), 'travel');
  assert.equal(classify('Dinner'), 'social');
  assert.equal(classify('Team planning'), 'work');
});

test('date helpers keep the calendar day', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(weekdayOf('2026-10-05'), 1); // Monday
  assert.equal(shiftIso('2026-10-08T18:00', -1), '2026-10-07T18:00');
});

test("Marta's week: day types and plans", () => {
  const week = buildWeek(events, weekStart);
  assert.deepEqual(
    week.map((d) => [d.tags.join('+'), d.plan]),
    [
      ['work+training', 'hard'], // Mon: Push
      ['work+training', 'light'], // Tue: Pull
      ['work', 'deepwork'], // Wed
      ['work+training+social', 'hard'], // Thu: Heavy legs, dinner
      ['work+travel', 'recover'], // Fri: flight
      ['training', 'light'], // Sat: Full body
      ['rest', 'recover'], // Sun: no events, guessed
    ],
  );
  assert.equal(week[6].source, 'guessed');
  assert.deepEqual(coverage(week), { eventDays: 6, total: 7 });
});

test('the scripted suggestion: Heavy legs from Thursday to Wednesday', () => {
  const move = suggestMove(buildWeek(events, weekStart));
  assert.ok(move);
  assert.equal(move.session, 'Heavy legs');
  assert.equal(move.fromDate, '2026-10-08');
  assert.equal(move.toDate, '2026-10-07');
  assert.deepEqual(move.reasons, [
    { date: '2026-10-08', what: 'dinner' },
    { date: '2026-10-09', what: 'flight' },
  ]);
});

test('accepting the move reflows the week and clears the suggestion', () => {
  const move = suggestMove(buildWeek(events, weekStart));
  assert.ok(move);
  const after = buildWeek(applyMove(events, move), weekStart);
  assert.equal(after[2].plan, 'hard'); // Wed now has the session
  assert.equal(after[2].sessions[0].start, '18:00'); // same time of day
  assert.equal(after[3].plan, 'deepwork'); // Thu is work and dinner only
  assert.equal(suggestMove(after), null);
});

test('days without events are guessed from the weekday, and no suggestion appears without data', () => {
  const partial = buildWeek(events.filter((e) => e.start < '2026-10-08'), weekStart);
  assert.deepEqual(coverage(partial), { eventDays: 3, total: 7 });
  assert.equal(partial[3].source, 'guessed');
  assert.deepEqual(partial[3].tags, ['work']);
  assert.equal(suggestMove(partial), null);
});

test('a forecast score decides a day\'s plan on Week the same way it does on Today', () => {
  const week = buildWeek(events, weekStart);
  assert.equal(week[0].plan, 'hard'); // day type and session only
  const typical = withScores(week, (date) => (date === week[0].date ? 51 : undefined));
  assert.equal(typical[0].plan, planForDay(51, week[0].tags, week[0].sessions)); // what Today shows
  assert.equal(typical[0].plan, 'light');
  assert.deepEqual(typical.slice(1).map((d) => d.plan), week.slice(1).map((d) => d.plan)); // days without a forecast are unchanged
  assert.equal(withScores(week, () => 65)[0].plan, 'hard');
  assert.equal(withScores(week, () => 30)[0].plan, 'recover');
});
