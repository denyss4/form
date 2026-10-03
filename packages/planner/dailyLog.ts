// Person B. Builds the model's DailyLog for tonight from the calendar day, the 3-tap answers and the morning rating.
// No imports from React Native, so `node --test` can load this file.
//
// The 3 taps map to model inputs like this (DECISIONS.md #9):
//   effort felt -> workout_effort, with workout_minutes from the calendar session   alcohol -> alcohol
//   "anything unusual?" -> no model field (GAPS G5), kept only as a note
// Everything else the model knows about comes from the calendar (day types) or is left out, and shows up as a skipped input.
import type { DailyLog } from '../model/predict.mjs';
import type { WeekDay } from './week.ts';

export type Effort = 'skipped' | 'easy' | 'moderate' | 'hard';
// 'other' = "Did something else" (spec R1): the plan was not tried, so the day is left out of the Plan Fit counts.
export type Fit = 'yes' | 'tooHard' | 'tooEasy' | 'other';

// [GAP G30: how the four effort words map to the model's 1-10 effort scale is a proposal.]
export const EFFORT_POINTS = { easy: 4, moderate: 6, hard: 8 } as const;

export interface EveningAnswers {
  effort?: Effort; // asked only when the calendar has a session that day
  alcohol: boolean;
  unusual: boolean;
  fit?: Fit; // "Did the plan fit?" Optional. Feeds Plan Fit Rate (P4).
}

export function buildLog(args: {
  today: WeekDay;
  tomorrow?: WeekDay;
  answers: EveningAnswers;
  readiness10?: number; // this morning's 1-10 rating (D5), if given; stored as rating × 10
}): DailyLog {
  const { today, tomorrow, answers, readiness10 } = args;
  const session = today.sessions[0];
  const trained = session !== undefined && answers.effort !== undefined && answers.effort !== 'skipped';

  return {
    date: today.date,
    tags: today.tags,
    ...(tomorrow ? { tomorrow_tags: tomorrow.tags } : {}),
    ...(readiness10 !== undefined ? { readiness: readiness10 * 10 } : {}),
    workout_minutes: trained ? session.minutes : 0,
    ...(trained && answers.effort && answers.effort !== 'skipped'
      ? { workout_effort: EFFORT_POINTS[answers.effort] }
      : {}),
    alcohol: answers.alcohol,
  };
}
