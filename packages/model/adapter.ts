// Adapts predict.mjs output to the UI contract (MASTER_PROMPT §1 model_facts):
//   {score, range, confidence, drivers:[{id,label,direction,basis,magnitude}], plan, skippedInputs}
// The screens render only these fields. Relative imports with extensions so `node --test` can run this file.
import { copy } from '../copy/copy.ts';
import type { InputId } from '../copy/copy.ts';
import type { RawResult } from './predict.mjs';

export type PlanId = 'hard' | 'light' | 'recover' | 'deepwork';

export interface FormDriver {
  id: string;
  label: string;
  direction: 'up' | 'down';
  basis: 'typical' | 'personal';
  magnitude: number; // points on the 0-100 scale
}

export interface FormResult {
  score: number;
  range: [number, number];
  // [GAP: no calibrated confidence exists in the model. error_band is a constant 17.2.]
  // Reports input completeness only, which is a fact, not a claim about accuracy. GAPS.md G1.
  confidence: { used: number; total: number };
  drivers: FormDriver[];
  // [GAP: plan thresholds (score band x day type) are not defined yet. GAPS.md G2.] Null until the plan engine exists.
  plan: PlanId | null;
  skippedInputs: { id: InputId; label: string }[];
}

// Inputs a person can supply. Order is the order of the gentle prompt.
export const INPUT_IDS: InputId[] = [
  'readiness',
  'sleep_hours',
  'sleep_quality',
  'mood',
  'stress',
  'fatigue',
  'soreness',
  'workout_minutes',
  'steps',
  'calories_burned',
  'very_active_minutes',
];

// Model feature -> input a person can add. null = derived from history or always defined, so never prompted. GAPS.md G4.
const INPUT_OF_FEATURE: Record<string, InputId | null> = {
  readiness_today: 'readiness',
  readiness_7d: null,
  readiness_dev: null,
  sleep_hours: 'sleep_hours',
  sleep_quality: 'sleep_quality',
  mood: 'mood',
  stress: 'stress',
  fatigue: 'fatigue',
  soreness: 'soreness',
  training_load: 'workout_minutes',
  training_load_7d: null,
  workout_minutes: 'workout_minutes',
  is_training_day: null,
  steps: 'steps',
  calories_burned: 'calories_burned',
  very_active_minutes: 'very_active_minutes',
  alcohol: null,
  tomorrow_is_workday: null,
};

// [GAP: minimum driver size is a proposal, not a model fact. GAPS.md G3.] Points are rounded to 0.1 by the model.
export const MIN_DRIVER_POINTS = 0.5;

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function toFormResult(raw: RawResult, opts: { plan?: PlanId | null } = {}): FormResult {
  const basis: FormDriver['basis'] = raw.algorithm === 'ridge' ? 'typical' : 'personal';

  const drivers = raw.top_drivers
    .filter((d) => Math.abs(d.points) >= MIN_DRIVER_POINTS)
    .slice(0, 3)
    .map((d): FormDriver => {
      const id = slug(d.driver);
      return {
        id,
        label: copy.drivers[id] ?? d.driver,
        direction: d.points > 0 ? 'up' : 'down',
        basis,
        magnitude: Math.abs(d.points),
      };
    });

  const missing = new Set<InputId>();
  for (const feature of raw.missing_inputs) {
    const input = INPUT_OF_FEATURE[feature];
    if (input) missing.add(input);
  }
  const skippedInputs = INPUT_IDS.filter((id) => missing.has(id)).map((id) => ({
    id,
    label: copy.inputs[id],
  }));

  return {
    score: raw.score,
    range: raw.range,
    confidence: { used: INPUT_IDS.length - skippedInputs.length, total: INPUT_IDS.length },
    drivers,
    plan: opts.plan ?? null,
    skippedInputs,
  };
}
