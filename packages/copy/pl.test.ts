// Run: npm test. Polish copy (D5): the language switch, plural forms, weekday cases and dates.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { copy, setLanguage } from './copy.ts';
import { formatDay, formatWeek, spokenDate, spokenDays, weekdayName } from './format.ts';

function leaves(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => leaves(v, out));
  return out;
}

test('copy and dates follow the language, and switch back', () => {
  setLanguage('pl');
  assert.equal(copy.tabs.today, 'Dziś');
  assert.equal(copy.range(34, 68), 'Prawdopodobnie 34–68');
  assert.equal(formatDay('2026-10-08'), 'Cz 8');
  assert.equal(weekdayName('2026-10-08'), 'czwartek');
  assert.equal(spokenDate('2026-10-08'), 'czwartek 8 października');
  assert.equal(formatWeek('2026-10-05'), '5–11 paź');
  assert.equal(spokenDays([0, 1, 2, 3, 4]), 'od poniedziałku do piątku');
  setLanguage('en');
  assert.equal(copy.tabs.today, 'Today');
  assert.equal(formatDay('2026-10-08'), 'Thu 8');
});

test('Polish plural forms: 1 dzień, 2-4 dni, 5 dni, 12 dni, 22 dni', () => {
  setLanguage('pl');
  assert.equal(copy.profile.trainingDays(1), '1 dzień w tygodniu');
  assert.equal(copy.profile.trainingDays(4), '4 dni w tygodniu');
  assert.equal(copy.editProfile.errors.fix(2), '2 pola wymagają poprawki przed zapisem.');
  assert.equal(copy.editProfile.errors.fix(5), '5 pól wymaga poprawki przed zapisem.');
  assert.equal(copy.editProfile.errors.fix(12), '12 pól wymaga poprawki przed zapisem.');
  assert.equal(copy.editProfile.errors.fix(22), '22 pola wymagają poprawki przed zapisem.');
  assert.equal(copy.progress.fit.headline(5, 6, 1), 'Plan pasował w 5 z 6 dni. 1 dzień poza planem.');
  setLanguage('en');
});

test('the move suggestion puts weekdays and events in the right case', () => {
  setLanguage('pl');
  const parts = [copy.suggestion.lateEvent('dinner'), copy.suggestion.dayEvent('piątek', 'flight')];
  assert.equal(copy.suggestion.reason('Heavy legs', 'czwartek', parts), 'Po Heavy legs w czwartek masz wieczorem kolację i w piątek lot.');
  assert.equal(copy.suggestion.move('środa'), 'Przenieś na środę');
  assert.equal(copy.suggestion.keep('wtorek'), 'Zostaw we wtorek');
  setLanguage('en');
});

test('Polish copy keeps the health-language rules', () => {
  setLanguage('pl');
  // Diagnosis and treatment appear only in the disclaimer that says Form does neither.
  const all = leaves(copy).join('\n').toLowerCase();
  const disclaimer = copy.onboarding.notice.toLowerCase();
  const rest = all.split(disclaimer).join('');
  for (const word of ['diagnoz', 'lecz', 'kontuzj', 'ryzyk', 'choro', 'objaw', 'twoje ciało potrzebuje', 'dieta', 'odchudz']) {
    assert.ok(!rest.includes(word), `"${word}" appears in the Polish copy`);
  }
  setLanguage('en');
});

test('felt ratings read out of 10: whole numbers stay whole, fixtures keep one decimal (Polish: a comma)', () => {
  setLanguage('en');
  assert.equal(copy.feltVsForecast.chart.value(80), '8 of 10');
  assert.equal(copy.feltVsForecast.chart.value(65), '6.5 of 10');
  assert.equal(copy.feltVsForecast.row(65, 53, 36, 70), 'Felt 6.5 of 10, forecast 53, likely 36–70');
  setLanguage('pl');
  assert.equal(copy.feltVsForecast.chart.value(80), '8 z 10');
  assert.equal(copy.feltVsForecast.chart.value(65), '6,5 z 10');
  setLanguage('en');
});
