// Run: npm test   (Node built-in test runner, no dependency)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { expand, pseudoLocalise } from './pseudo.ts';
import { copy } from './copy.ts';

function leaves(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => leaves(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => leaves(v, out));
  return out;
}

test('words grow and numbers stay exactly as they are', () => {
  assert.notEqual(expand('Felt'), 'Felt');
  assert.equal(expand('Likely 34–68'), expand('Likely') + ' 34–68');
  assert.equal(expand('65, 53, 36–70'), '65, 53, 36–70');
  assert.equal(expand('Go'), 'Go'); // two letters or fewer are left alone
});

test('copy.ts grows by about 30% in total, with Polish letters', () => {
  const before = leaves(copy).filter((s) => /\p{L}{3}/u.test(s));
  const after = before.map(expand);
  const ratio = after.join('').length / before.join('').length;
  assert.ok(ratio > 1.27 && ratio < 1.37, `total length grew by ${Math.round((ratio - 1) * 100)}%`);
  assert.ok(after.some((s) => /[ąćęłńóśźż]/.test(s)));
});

test('functions in copy.ts grow what they return and keep their numbers', () => {
  const grown = pseudoLocalise(copy);
  assert.equal(grown.range(34, 68), `${expand('Likely')} 34–68`);
  assert.match(grown.feltVsForecast.summary(6, 6), /^6 /);
});
