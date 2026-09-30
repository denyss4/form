// Run: npm run test:model   (Node built-in test runner, no dependency)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { INPUT_IDS, MIN_DRIVER_POINTS, toFormResult } from './adapter.ts';
import { predict } from './predict.mjs';

const read = (name: string) =>
  JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));

const model = read('./model.json');
const personal = read('./model-personal-example.json');
const example = read('./example-input.json');
const expected = read('./example-output.json');

test('the kit example maps to the UI contract', () => {
  const raw = predict(model, example);
  assert.equal(raw.model_version, 'v2-ridge-ef303c083a1a'); // pinned model
  assert.equal(raw.score, expected.score);
  assert.deepEqual(raw.range, expected.range);

  const result = toFormResult(raw);
  assert.equal(result.score, 51);
  assert.deepEqual(result.range, [34, 68]);
  assert.deepEqual(result.confidence, { used: INPUT_IDS.length, total: INPUT_IDS.length });
  assert.equal(result.plan, null);
  assert.deepEqual(result.skippedInputs, []);
  assert.deepEqual(result.drivers, [
    { id: 'recent-readiness', label: 'Recent readiness', direction: 'up', basis: 'typical', magnitude: 7.4 },
    { id: 'training-load', label: 'Training load', direction: 'down', basis: 'typical', magnitude: 4.4 },
    { id: 'alcohol', label: 'Alcohol', direction: 'down', basis: 'typical', magnitude: 1.5 },
  ]);
});

test('a log with only a date lists every input as skipped and shows no drivers', () => {
  const result = toFormResult(predict(model, { date: '2026-10-04' }));
  assert.equal(result.skippedInputs.length, INPUT_IDS.length);
  assert.deepEqual(result.confidence, { used: 0, total: INPUT_IDS.length });
  assert.deepEqual(result.drivers, []);
});

test('the personal-mean model returns no drivers', () => {
  const mean = { ...personal, algorithm: 'personal_mean', version: 'v2-personal_mean-example' };
  const result = toFormResult(predict(mean, example));
  assert.deepEqual(result.drivers, []);
});

test('drivers below the minimum size are dropped', () => {
  const raw = predict(model, example);
  const small = MIN_DRIVER_POINTS - 0.2;
  const result = toFormResult({
    ...raw,
    top_drivers: [
      { driver: 'Sleep', points: small },
      { driver: 'Alcohol', points: -1.5 },
    ],
  });
  assert.deepEqual(result.drivers.map((d) => d.id), ['alcohol']);
});

test('a personal model labels drivers "personal"', () => {
  const raw = predict(model, example);
  const result = toFormResult({ ...raw, algorithm: 'personal_ridge' });
  assert.ok(result.drivers.every((d) => d.basis === 'personal'));
});
