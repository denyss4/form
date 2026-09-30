// Form readiness - on-device inference for Expo / React Native, browsers and Node. No dependencies.
// Same math as form_core.py; verify.mjs checks both give identical results.
//
//   import {predict, withHistory} from './predict.mjs';
//   import model from './model.json';
//   const logs = withHistory(allStoredLogs);          // fills the 6-day history fields
//   const result = predict(model, logs.at(-1));       // tonight's forecast for tomorrow morning

export const FEATURES = [
  "readiness_today", "readiness_7d", "readiness_dev",
  "sleep_hours", "sleep_quality",
  "mood", "stress",
  "fatigue", "soreness",
  "training_load", "training_load_7d", "workout_minutes", "is_training_day",
  "steps", "calories_burned", "very_active_minutes",
  "alcohol",
  "tomorrow_is_workday",
];
const TAGS = new Set(["work", "training", "rest", "travel", "social"]);
const BOUNDS = {
  readiness: [0, 100], sleep_hours: [0, 24], sleep_quality: [1, 5], mood: [1, 5], stress: [1, 5],
  fatigue: [1, 5], soreness: [1, 5], workout_minutes: [0, 1440], workout_effort: [1, 10],
  steps: [0, 200000], calories_burned: [0, 15000], very_active_minutes: [0, 1440],
};

// Python-compatible rounding (half-to-even) so scores match the backend exactly.
export function roundHalfEven(v) {
  const lo = Math.floor(v), f = v - lo;
  return f === 0.5 ? (lo % 2 === 0 ? lo : lo + 1) : Math.round(v);
}

function parseDate(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error("date must use YYYY-MM-DD");
  const d = new Date(s + "T12:00:00Z");
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) throw new Error("date must be a valid calendar date");
  return d;
}
const addDays = (d, n) => { const c = new Date(d); c.setUTCDate(c.getUTCDate() + n); return c; };
const iso = d => d.toISOString().slice(0, 10);

function num(row, key) {
  const v = row[key];
  if (v === undefined || v === null) return null;
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`${key} must be a finite number`);
  const [lo, hi] = BOUNDS[key];
  if (v < lo || v > hi) throw new Error(`${key} must be between ${lo} and ${hi}`);
  return v;
}

function history(row, key, bound) {
  const vals = row[key] ?? [];
  if (!Array.isArray(vals)) throw new Error(`${key} must be a list`);
  const out = [];
  for (const v of vals.slice(-6)) {
    if (v === null || v === undefined) continue;
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > bound) {
      throw new Error(`${key} values must be numbers between 0 and ${bound}`);
    }
    out.push(v);
  }
  return [out, vals.length > 0];
}

export function encode(row) {
  const d = parseDate(row.date);
  const tags = new Set(row.tags ?? []);
  for (const t of tags) if (!TAGS.has(t)) throw new Error(`tags must be a subset of ${[...TAGS].sort()}`);

  const rToday = num(row, "readiness");
  const [rHist] = history(row, "readiness_history", 100);
  const win = rToday === null ? rHist : [...rHist, rToday];
  const r7 = win.length >= 2 ? win.reduce((a, b) => a + b, 0) / win.length : null;
  const rDev = rToday !== null && r7 !== null ? rToday - r7 : null;

  const minutes = num(row, "workout_minutes");
  const effort = num(row, "workout_effort");
  const load = minutes === null ? null : Math.min(minutes, 300) * (effort ?? 5);
  const [lHist, hasLHist] = history(row, "load_history", 14400);
  const load7 = hasLHist && load !== null ? lHist.reduce((a, b) => a + b, 0) + load : null;
  const isTraining = tags.has("training") || (minutes ?? 0) >= 20 ? 1 : 0;

  let tomorrowWork;
  if (row.tomorrow_tags !== undefined && row.tomorrow_tags !== null) tomorrowWork = row.tomorrow_tags.includes("work") ? 1 : 0;
  else { const wd = addDays(d, 1).getUTCDay(); tomorrowWork = wd >= 1 && wd <= 5 ? 1 : 0; }

  return [
    rToday, r7, rDev,
    num(row, "sleep_hours"), num(row, "sleep_quality"),
    num(row, "mood"), num(row, "stress"),
    num(row, "fatigue"), num(row, "soreness"),
    load, load7, minutes === null ? null : Math.min(minutes, 300), isTraining,
    num(row, "steps"), num(row, "calories_burned"), num(row, "very_active_minutes"),
    row.alcohol ? 1 : 0,
    tomorrowWork,
  ];
}

// Fill readiness_history and load_history for every log from the 6 days before it.
export function withHistory(logs) {
  const rows = logs.map(r => ({...r})).sort((a, b) => (a.date < b.date ? -1 : 1));
  const byDate = new Map(rows.map(r => [r.date, r]));
  for (const r of rows) {
    const d = parseDate(r.date);
    const prev = [6, 5, 4, 3, 2, 1].map(k => byDate.get(iso(addDays(d, -k))));
    r.readiness_history = prev.map(p => (p ? p.readiness ?? null : null));
    r.load_history = prev.map(p => (!p || !p.workout_minutes ? 0 : Math.min(p.workout_minutes, 300) * (p.workout_effort || 5)));
  }
  return rows;
}

export function rawScore(model, x) {
  const a = model.artifact;
  if (model.algorithm === "personal_mean") return a.baseline;
  let total = a.intercept;
  x.forEach((v, i) => { total += ((v ?? a.fill[i]) - a.mean[i]) / a.scale[i] * a.coefficients[i]; });
  return total;
}

// Points each driver group adds or removes vs. the model's typical day.
export function contributions(model, x) {
  const a = model.artifact;
  if (model.algorithm === "personal_mean") return [];
  const out = Object.entries(model.groups).map(([driver, names]) => {
    let pts = 0;
    for (const n of names) {
      const i = model.feature_names.indexOf(n);
      pts += ((x[i] ?? a.fill[i]) - a.reference[i]) / a.scale[i] * a.coefficients[i];
    }
    return {driver, points: Math.round(pts * 10) / 10};
  });
  return out.sort((p, q) => Math.abs(q.points) - Math.abs(p.points));
}

export function predict(model, row) {
  if (model.status !== "ready") throw new Error("Model is not ready");
  if (JSON.stringify(model.feature_names) !== JSON.stringify(FEATURES)) throw new Error("Unsupported feature order");
  const x = encode(row);
  const raw = rawScore(model, x);
  const score = roundHalfEven(Math.max(0, Math.min(100, raw)));
  const band = model.validation.error_band;
  return {
    feature_date: row.date,
    date: iso(addDays(parseDate(row.date), 1)),
    score,
    range: [Math.max(0, roundHalfEven(score - band)), Math.min(100, roundHalfEven(score + band))],
    raw_score: raw,
    top_drivers: contributions(model, x).slice(0, 3),
    missing_inputs: FEATURES.filter((_, i) => x[i] === null),
    algorithm: model.algorithm,
    model_version: model.version,
  };
}
