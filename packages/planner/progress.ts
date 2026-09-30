// Person B. The numbers behind Progress: the Plan Fit meter and the felt-vs-forecast pairs.
// No imports from React Native, so `node --test` can load this file.
//
// Plan Fit counts the days the user themself said the plan fit (their answer to "Did the plan fit?"). It rewards nothing and keeps no
// streak: it is a process measure, not an outcome one (MASTER_PROMPT §2). A followed Recover day counts like a followed training day,
// because the answer is about fit, not about how hard the day was. [GAP G6: "fit" = the answer "Yes" is a proposal.]
import type { PlanId } from '../tokens/color.ts';
import type { Fit } from './dailyLog.ts';

export interface FitDay {
  date: string; // the morning the plan was for
  plan: PlanId;
  fit: Fit | null; // null = not answered
}

export function fitSummary(days: FitDay[]) {
  const answered = days.filter((d) => d.fit !== null);
  return { fit: answered.filter((d) => d.fit === 'yes').length, answered: answered.length, days: days.length };
}

/** One morning: what Form forecast the evening before, and what the person said they felt. Both on the 0-100 scale. */
export interface Pair {
  date: string;
  forecast: number;
  range: [number, number];
  felt: number;
}

export const insideRange = (p: Pair) => p.felt >= p.range[0] && p.felt <= p.range[1];

// The kit compares the user's own pattern with the typical one only after this many labelled days (model.json minimum_pairs).
export const LEARNING_DAYS = 21;

/**
 * Check-in completion: the mornings the person gave the 0-10 rating, out of the mornings looked at. A process measure to watch, never a score,
 * and nothing is rewarded for it. The numerator is also the count of pairs behind "Labelled days so far" on Felt vs forecast.
 */
export function checkinCompletion(dates: string[], rated: (date: string) => boolean) {
  return { rated: dates.filter(rated).length, days: dates.length };
}
