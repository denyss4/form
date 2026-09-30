// Person B. The plan engine: score band x day type -> one of four plans (Brief §7: "rules-based, score band x day type").
// No imports from React Native, so `node --test` can load this file.
//
// [GAP G2: the thresholds and the rules below are proposals, not model facts. The model gives a score and a range; it does not
//  say what to do. Approve at Review 2.]
import type { PlanId } from '../tokens/color.ts';
import type { DayTag, Session } from './week.ts';

export type ScoreBand = 'low' | 'mid' | 'high';

// The model's typical day is about 50 (model.json baseline 49.5). Below 40 is clearly lower; 60 and above is clearly higher.
export const LOW_BELOW = 40;
export const HIGH_FROM = 60;

export const bandOf = (score: number): ScoreBand => (score < LOW_BELOW ? 'low' : score >= HIGH_FROM ? 'high' : 'mid');

/**
 * Low score: recover, whatever the day holds.
 * A planned session: hard only when it is a hard session and the score is high, otherwise light.
 * No session: a work day is a deep-work day; travel or rest is recovery.
 */
export function planForDay(score: number, tags: DayTag[], sessions: Session[]): PlanId {
  const band = bandOf(score);
  if (band === 'low') return 'recover';
  if (sessions.length > 0) return band === 'high' && sessions.some((s) => s.intensity === 'hard') ? 'hard' : 'light';
  if (tags.includes('travel') || !tags.includes('work')) return 'recover';
  return 'deepwork';
}
