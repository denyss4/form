// Tonight's forecast for tomorrow morning: the earlier logs give the 6-day history, the new log is scored by the model.
// The model is passed in so this runs in Node tests and in the app alike.
import { toFormResult, type FormResult } from './adapter.ts';
import { predict, withHistory } from './predict.mjs';
import type { DailyLog, Model } from './predict.mjs';

export function forecast(model: Model, history: DailyLog[], log: DailyLog): FormResult {
  const logs = withHistory([...history.filter((h) => h.date !== log.date), log]);
  const row = logs.find((l) => l.date === log.date);
  if (!row) throw new Error('The log is missing from its own history');
  return toFormResult(predict(model, row));
}
