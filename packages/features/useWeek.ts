// The week as the calendar sees it, shared by Week and Today. `subset` is for review: a partial or thin calendar.
import { useMemo } from 'react';

import { martaCalendar, martaWeek } from '@fixtures';
import { applyMove, buildWeek, suggestMove } from '@planner';
import { withScores } from '@planner/plan';
import { addDays } from '@planner/dates';
import { useAppState } from '@state';

export type CalendarSubset = 'all' | 'partial' | 'lowconf' | 'none';

export function useWeek(subset: CalendarSubset = 'all') {
  const app = useAppState();
  const weekStart = martaCalendar.meta.weekStart;

  const events = useMemo(() => {
    const all = martaCalendar.events;
    if (subset === 'none') return [];
    if (subset === 'partial') return all.filter((e) => e.start < addDays(weekStart, 3)); // Mon to Wed
    if (subset === 'lowconf') return all.filter((e) => e.start < addDays(weekStart, 1)); // Mon only
    return all;
  }, [subset, weekStart]);

  const original = useMemo(() => buildWeek(events, weekStart), [events, weekStart]);
  const suggestion = useMemo(() => (subset === 'all' ? suggestMove(original) : null), [subset, original]);
  const moved = suggestion !== null && app.suggestion === 'moved';
  const built = useMemo(
    () => (moved && suggestion ? buildWeek(applyMove(events, suggestion), weekStart) : original),
    [moved, suggestion, events, weekStart, original],
  );
  // A day the model has forecast takes its plan from the score, exactly as Today does.
  const week = useMemo(
    () =>
      withScores(
        built,
        (date) => app.forecasts[date]?.result.score ?? martaWeek.days.find((d) => d.forecastFor === date)?.result.score,
      ),
    [built, app.forecasts],
  );

  return { weekStart, events, original, week, suggestion, moved };
}
