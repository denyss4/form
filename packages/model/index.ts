// On-device model: the FORM-ML-Kit-v2 scorer (unmodified) plus the adapter to the UI contract.
import model from './model.json';
import { toFormResult } from './adapter.ts';
import { predict, withHistory } from './predict.mjs';

export { model, predict, toFormResult, withHistory };
export type { FormDriver, FormResult, PlanId } from './adapter.ts';
export type { DailyLog, RawResult } from './predict.mjs';
