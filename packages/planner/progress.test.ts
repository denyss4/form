// Run: npm test   (Node built-in test runner, no dependency)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { checkinCompletion, fitSummary, insideRange, LEARNING_DAYS } from './progress.ts';
import type { FitDay, Pair } from './progress.ts';

const marta = JSON.parse(readFileSync(new URL('../../fixtures/marta-week.json', import.meta.url), 'utf8'));

test('plan fit counts only the days the person said it fit', () => {
  const days: FitDay[] = [
    { date: 'a', plan: 'recover', fit: 'yes' }, // a followed Recover day counts like any other
    { date: 'b', plan: 'hard', fit: 'tooHard' },
    { date: 'c', plan: 'light', fit: 'tooEasy' },
    { date: 'd', plan: 'deepwork', fit: null }, // not answered: not counted as a miss
    { date: 'e', plan: 'light', fit: 'yes' },
  ];
  assert.deepEqual(fitSummary(days), { fit: 2, answered: 4, notFollowed: 0, days: 5 });
});

test('"Did something else" days are left out of both Plan Fit counts (spec R1, OQ3 default)', () => {
  const days: FitDay[] = [
    { date: 'a', plan: 'light', fit: 'yes' },
    { date: 'b', plan: 'hard', fit: 'other' }, // the plan was not tried, so it neither fits nor fails
    { date: 'c', plan: 'deepwork', fit: 'tooEasy' },
    { date: 'd', plan: 'recover', fit: null },
  ];
  assert.deepEqual(fitSummary(days), { fit: 1, answered: 2, notFollowed: 1, days: 4 });
});

test('felt inside or outside the likely range', () => {
  const p: Pair = { date: 'x', forecast: 51, range: [34, 68], felt: 70 };
  assert.equal(insideRange(p), false);
  assert.equal(insideRange({ ...p, felt: 68 }), true);
  assert.equal(insideRange({ ...p, felt: 34 }), true);
});

test("Marta's scripted week: outcomes come from real forecasts", () => {
  const withOutcome = marta.days.filter((d: { outcome: unknown }) => d.outcome);
  assert.equal(withOutcome.length, 6); // 29 Sep to 4 Oct. 5 Oct has not happened yet.
  const last = marta.days[marta.days.length - 1];
  assert.equal(last.forecastFor, '2026-10-05');
  assert.equal(last.outcome, null);

  // The felt rating is that morning's own rating, which the evening before had to forecast.
  const first = marta.days[0];
  assert.equal(first.forecastFor, '2026-09-29');
  assert.equal(first.outcome.felt, marta.days[1].log.readiness); // the 29 Sep log holds the 29 Sep rating
  assert.ok(first.outcome.plan);

  const fits = withOutcome.map((d: { forecastFor: string; outcome: { plan: 'recover'; fit: 'yes' } }) => ({
    date: d.forecastFor,
    plan: d.outcome.plan,
    fit: d.outcome.fit,
  }));
  assert.deepEqual(fitSummary(fits), { fit: 5, answered: 6, notFollowed: 0, days: 6 });
});

test('the learning threshold is the kit minimum', () => {
  assert.equal(LEARNING_DAYS, 21);
  const model = JSON.parse(readFileSync(new URL('../model/model.json', import.meta.url), 'utf8'));
  assert.equal(model.minimum_pairs, LEARNING_DAYS);
});

test('check-in completion counts rated mornings out of the mornings looked at', () => {
  const ratings: Record<string, number> = { '2026-10-05': 7, '2026-10-07': 9 };
  const mornings = ['2026-10-05', '2026-10-06', '2026-10-07'];
  assert.deepEqual(checkinCompletion(mornings, (d) => d in ratings), { rated: 2, days: 3 });
  assert.deepEqual(checkinCompletion([], () => true), { rated: 0, days: 0 });
});
