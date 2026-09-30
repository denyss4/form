// Checks that predict.mjs gives exactly the backend's (form_core.py) results. Run: node verify.mjs
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {predict, withHistory, roundHalfEven} from "./predict.mjs";

const read = async f => JSON.parse(await readFile(new URL(f, import.meta.url), "utf8"));
const models = {"model.json": await read("./model.json"), "model-personal-example.json": await read("./model-personal-example.json")};
models.personal_mean = {...models["model-personal-example.json"], algorithm: "personal_mean", version: "v2-personal_mean-example"};
const vectors = await read("./verification-vectors.json");
let maxRaw = 0, maxPts = 0;
for (const {model, input, expected} of vectors) {
  const got = predict(models[model], input);
  maxRaw = Math.max(maxRaw, Math.abs(got.raw_score - expected.raw_score));
  assert.ok(Math.abs(got.raw_score - expected.raw_score) < 1e-9, "raw score mismatch");
  assert.equal(got.score, expected.score);
  assert.deepEqual(got.range, expected.range);
  assert.equal(got.date, expected.date);
  assert.deepEqual(got.missing_inputs, expected.missing_inputs);
  assert.deepEqual(got.top_drivers.map(d => d.driver).sort(), expected.top_drivers.map(d => d.driver).sort());
  for (const d of got.top_drivers) {
    const e = expected.top_drivers.find(t => t.driver === d.driver);
    maxPts = Math.max(maxPts, Math.abs(d.points - e.points));
    assert.ok(Math.abs(d.points - e.points) <= 0.1 + 1e-9, "driver points mismatch");
  }
}
// withHistory must reproduce the history fields used in the vectors
const h = withHistory([{date: "2026-10-01", readiness: 60, workout_minutes: 30, workout_effort: 6},
                       {date: "2026-10-03", readiness: 70}]);
assert.deepEqual(h[1].readiness_history, [null, null, null, null, 60, null]);
assert.deepEqual(h[1].load_history, [0, 0, 0, 0, 180, 0]);
assert.equal(roundHalfEven(80.5), 80);
assert.equal(roundHalfEven(81.5), 82);
const m = models["model.json"];
assert.throws(() => predict(m, {date: "2026-02-30"}));
assert.throws(() => predict(m, {date: "2026-10-01", mood: 7}));
assert.throws(() => predict(m, {date: "2026-10-01", tags: ["gym"]}));
assert.throws(() => predict(m, {date: "2026-10-01", sleep_hours: NaN}));
console.log(JSON.stringify({runtime: "JavaScript", cases: vectors.length, max_raw_error: maxRaw, max_driver_points_diff: maxPts, status: "passed"}));
