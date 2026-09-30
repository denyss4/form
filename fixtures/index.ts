// Marta's scripted week. Demo data comes only from here (MASTER_PROMPT §4). Rebuild with `npm run fixtures`.
import type { DailyLog, FormResult, RawResult } from '@model';
import type { CalEvent } from '@planner';
import type { Fit } from '@planner/dailyLog';
import type { PlanId } from '@tokens';

import calendar from './marta-calendar.json';
import data from './marta-week.json';

export interface FixtureDay {
  date: string; // the evening the log was written
  forecastFor: string; // the morning the score is for
  log: DailyLog;
  raw: RawResult;
  result: FormResult;
  /** Once the morning has happened: what Marta felt, the plan it would have got, and her own answer to "Did the plan fit?". */
  outcome: { felt: number | null; plan: PlanId; fit: Fit | null } | null;
}

export interface MartaWeek {
  meta: {
    kind: string;
    persona: string;
    note: string;
    model_version: string;
    demoToday: string;
  };
  days: FixtureDay[];
}

export const martaWeek = data as unknown as MartaWeek;

export interface MartaCalendar {
  meta: { kind: string; persona: string; note: string; weekStart: string };
  events: CalEvent[];
}

export const martaCalendar = calendar as unknown as MartaCalendar;
