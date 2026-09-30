// Everything Today shows, worked out from app state. Scores are real model output: the fixture forecast for the scripted morning,
// or the forecast tonight's saved log produced. `?state=` makes the review states from real runs of the model, never invented numbers.
import { useMemo } from 'react';

import { martaWeek } from '@fixtures';
import { model } from '@model';
import { forecast } from '@model/forecast';
import type { DailyLog } from '@model';
import { planForDay } from '@planner/plan';
import type { WeekDay } from '@planner';
import { addDays } from '@planner/dates';
import { useAppState, type Forecast } from '@state';

import { useWeek } from './useWeek';

export type TodayScenario = 'default' | 'loading' | 'day1' | 'partial' | 'lowconf' | 'error';
export const todayScenarios: TodayScenario[] = ['default', 'loading', 'day1', 'partial', 'lowconf', 'error'];

export type TodayData =
  | { kind: 'loading' }
  | { kind: 'day1'; day: WeekDay; tomorrow?: WeekDay }
  | { kind: 'error'; day: WeekDay; tomorrow?: WeekDay }
  | { kind: 'ready'; day: WeekDay; tomorrow?: WeekDay; forecast: Forecast };

const fixtureLogs = martaWeek.days.map((d) => d.log);

// Review states drop inputs from the scripted evening before, then run the real model on what is left.
const dropped: Record<'partial' | 'lowconf', Exclude<keyof DailyLog, 'date'>[]> = {
  partial: ['sleep_quality', 'mood', 'stress', 'fatigue', 'soreness'], // 6 of 11 inputs
  lowconf: ['sleep_hours', 'sleep_quality', 'mood', 'stress', 'fatigue', 'soreness', 'steps', 'calories_burned', 'very_active_minutes'], // 2 of 11
};

export function useToday(scenario: TodayScenario, calendarOn: boolean): TodayData {
  const app = useAppState();
  const { week } = useWeek(calendarOn ? 'all' : 'none');
  const today = app.demoDay;

  return useMemo<TodayData>(() => {
    const day = week.find((d) => d.date === today) ?? week[0];
    const tomorrow = week.find((d) => d.date === addDays(day.date, 1));
    const withPlan = (result: Forecast['result']): Forecast => ({
      result,
      plan: planForDay(result.score, day.tags, day.sessions),
    });

    if (scenario === 'loading') return { kind: 'loading' };
    if (scenario === 'day1') return { kind: 'day1', day, tomorrow };

    // The scripted evening before this morning: the last fixture log.
    const eve = martaWeek.days.find((d) => d.forecastFor === today);
    try {
      if (scenario === 'error') {
        // A real failure: the model rejects an out-of-range answer.
        if (!eve) throw new Error('No scripted log');
        forecast(model, fixtureLogs, { ...eve.log, mood: 7 });
      }
      if ((scenario === 'partial' || scenario === 'lowconf') && eve) {
        const log: DailyLog = { ...eve.log };
        for (const key of dropped[scenario]) delete log[key];
        const history = fixtureLogs.filter((l) => l.date !== log.date);
        return { kind: 'ready', day, tomorrow, forecast: withPlan(forecast(model, history, log)) };
      }
    } catch {
      return { kind: 'error', day, tomorrow };
    }

    const live = app.forecasts[today];
    if (live) return { kind: 'ready', day, tomorrow, forecast: live };
    if (eve) return { kind: 'ready', day, tomorrow, forecast: withPlan(eve.result) };
    return { kind: 'day1', day, tomorrow };
  }, [scenario, today, week, app.forecasts]);
}

/** The history the model builds tonight's forecast on: the scripted week, then any logs saved in this session. */
export function useHistory(): DailyLog[] {
  const app = useAppState();
  return useMemo(() => [...fixtureLogs, ...Object.values(app.dailyLogs)], [app.dailyLogs]);
}
