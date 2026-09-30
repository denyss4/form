// The week as the calendar sees it, shared by Week and Today. `subset` is for review: a partial or thin calendar.
import { useMemo } from 'react';

import { martaCalendar } from '@fixtures';
import { applyMove, buildWeek, suggestMove } from '@planner';
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
  const week = useMemo(
    () => (moved && suggestion ? buildWeek(applyMove(events, suggestion), weekStart) : original),
    [moved, suggestion, events, weekStart, original],
  );

  return { weekStart, events, original, week, suggestion, moved };
}
