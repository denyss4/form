// What Progress and Felt vs forecast show: Marta's scripted history, plus whatever the person does in the app this session.
// Answering "Did the plan fit?" in the evening log adds a day to Plan Fit. Rating a morning adds a pair to Felt vs forecast.
// The scores and ranges are always real model output. The felt ratings and the fit answers are the scripted persona's (fixtures).
import { useMemo } from 'react';

import { martaWeek } from '@fixtures';
import { planForDay } from '@planner/plan';
import { addDays } from '@planner/dates';
import type { FitDay, Pair } from '@planner/progress';
import { useAppState } from '@state';

import { useWeek } from './useWeek';

export type ProgressScenario = 'default' | 'loading' | 'empty' | 'partial' | 'lowconf' | 'error' | 'outside';
export const progressScenarios: ProgressScenario[] = ['default', 'loading', 'empty', 'partial', 'lowconf', 'error', 'outside'];

export type ProgressData =
  | { kind: 'loading' }
  | { kind: 'error' }
  | {
      kind: 'ready';
      fit: FitDay[];
      pairs: Pair[];
      logged: { days: number; of: number };
      from: string; // first day of the window
    };

const WINDOW = 7;
const byDate = <T extends { date: string }>(a: T, b: T) => a.date.localeCompare(b.date);

export function useProgress(scenario: ProgressScenario): ProgressData {
  const app = useAppState();
  // The same week Today plans from, so a day's plan here is the plan Today showed.
  const { week } = useWeek(app.calendar === 'connected' ? 'all' : 'none');

  return useMemo<ProgressData>(() => {
    if (scenario === 'loading') return { kind: 'loading' };
    if (scenario === 'error') return { kind: 'error' };

    const day = (date: string) => week.find((d) => d.date === date);
    const resultFor = (date: string) =>
      app.forecasts[date]?.result ?? martaWeek.days.find((d) => d.forecastFor === date)?.result;

    // Scripted history.
    const fit: FitDay[] = martaWeek.days
      .filter((d) => d.outcome)
      .map((d) => ({ date: d.forecastFor, plan: d.outcome!.plan, fit: d.outcome!.fit }));
    const pairs: Pair[] = martaWeek.days
      .filter((d) => d.outcome && d.outcome.felt !== null)
      .map((d) => ({ date: d.forecastFor, forecast: d.result.score, range: d.result.range, felt: d.outcome!.felt! }));

    // This session: the plan each day had, and the answers given.
    for (const [date, answers] of Object.entries(app.logs)) {
      const result = resultFor(date);
      const plan =
        app.forecasts[date]?.plan ?? (result && day(date) ? planForDay(result.score, day(date)!.tags, day(date)!.sessions) : null);
      if (answers.fit && plan) fit.push({ date, plan, fit: answers.fit });
    }
    for (const [date, rating] of Object.entries(app.readiness)) {
      const result = resultFor(date);
      if (result) pairs.push({ date, forecast: result.score, range: result.range, felt: rating * 10 });
    }

    // Review only: 'outside' moves one day's felt rating below its likely range, so that state can be seen. Fixture data is untouched.
    const shown = scenario === 'outside' ? pairs.sort(byDate).map((p, i) => (i === 2 ? { ...p, felt: Math.max(0, p.range[0] - 10) } : p)) : pairs;
    const limit = scenario === 'empty' ? 0 : scenario === 'partial' ? 3 : scenario === 'lowconf' ? 1 : Infinity;
    const from = addDays(app.demoDay, 1 - WINDOW);
    const loggedDates = new Set([...martaWeek.days.map((d) => d.date), ...Object.keys(app.logs)]);
    let n = 0;
    for (let i = 0; i < WINDOW; i++) if (loggedDates.has(addDays(app.demoDay, -i))) n++; // the 7 days ending today

    return {
      kind: 'ready',
      fit: fit.sort(byDate).slice(0, limit),
      pairs: shown.sort(byDate).slice(0, limit),
      logged: { days: Math.min(n, limit), of: WINDOW }, // the review scenarios thin the history out, so the count follows
      from,
    };
  }, [scenario, week, app.logs, app.readiness, app.forecasts, app.demoDay]);
}
