// Types for predict.mjs (FORM-ML-Kit-v2, model v2-ridge-ef303c083a1a). The JS file is the kit's, unmodified.

export type Tag = 'work' | 'training' | 'rest' | 'travel' | 'social';

export interface DailyLog {
  date: string;
  tags?: Tag[];
  tomorrow_tags?: Tag[];
  readiness?: number;
  readiness_history?: (number | null)[];
  sleep_hours?: number;
  sleep_quality?: number;
  mood?: number;
  stress?: number;
  fatigue?: number;
  soreness?: number;
  workout_minutes?: number;
  workout_effort?: number;
  load_history?: (number | null)[];
  steps?: number;
  calories_burned?: number;
  very_active_minutes?: number;
  alcohol?: boolean;
  notes?: string;
}

export interface Model {
  format?: string;
  status: string;
  algorithm: string;
  version: string;
  feature_names: string[];
  groups: Record<string, string[]>;
  artifact: { [key: string]: any };
  validation: { error_band: number; [key: string]: any };
  [key: string]: any;
}

export interface RawDriver {
  driver: string;
  points: number;
}

export interface RawResult {
  feature_date: string;
  date: string;
  score: number;
  range: [number, number];
  raw_score: number;
  top_drivers: RawDriver[];
  missing_inputs: string[];
  algorithm: string;
  model_version: string;
}

export const FEATURES: string[];
export function roundHalfEven(v: number): number;
export function encode(row: DailyLog): (number | null)[];
export function withHistory(logs: DailyLog[]): DailyLog[];
export function rawScore(model: Model, x: (number | null)[]): number;
export function contributions(model: Model, x: (number | null)[]): RawDriver[];
export function predict(model: Model, row: DailyLog): RawResult;
