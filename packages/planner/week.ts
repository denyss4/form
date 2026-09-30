// Person B. Turns calendar events into day types, a plan for each day, and one scripted "move this session" suggestion.
// No imports from React Native, so `node --test` can load this file.
//
// [GAP G2: the plan rules and the suggestion rule are proposals, not model facts. The model forecasts only tomorrow morning,
//  so plans for later days come from day type and the session's intensity. Approve at Review 2.]
import type { PlanId } from '../tokens/color.ts';
import { addDays, dayOf, hourOf, isWeekday, minutesBetween, shiftIso, timeOf } from './dates.ts';

export type DayTag = 'work' | 'training' | 'social' | 'travel' | 'rest';
export const tagOrder: DayTag[] = ['work', 'training', 'social', 'travel', 'rest'];

export interface CalEvent {
  id: string;
  title: string;
  start: string; // 'YYYY-MM-DDTHH:mm'
  end: string;
  label?: string; // short noun used in suggestions, e.g. "dinner"
  session?: string; // training session name, e.g. "Heavy legs"
  intensity?: 'hard' | 'light'; // Marta's own training split, not from the calendar
}

export interface Session {
  eventId: string;
  name: string;
  start: string; // 'HH:mm'
  minutes: number;
  intensity: 'hard' | 'light';
}

export interface WeekDay {
  date: string;
  tags: DayTag[];
  source: 'calendar' | 'guessed'; // guessed = no events, so the weekday decides
  sessions: Session[];
  plan: PlanId;
  events: CalEvent[];
}

// Day types are predicted from event titles.
const rules: [DayTag, RegExp][] = [
  ['training', /\b(gym|training|workout|lift)\b/i],
  ['travel', /\b(flight|airport|train to|transfer|trip)\b/i],
  ['social', /\b(dinner|drinks|party|birthday|brunch)\b/i],
];

export function classify(title: string): DayTag {
  for (const [tag, pattern] of rules) if (pattern.test(title)) return tag;
  return 'work';
}

// Precedence: a session decides, then travel, then work, then rest.
export function planFor(tags: DayTag[], sessions: Session[]): PlanId {
  if (sessions.length > 0) return sessions.some((s) => s.intensity === 'hard') ? 'hard' : 'light';
  if (tags.includes('travel')) return 'recover';
  if (tags.includes('work')) return 'deepwork';
  return 'recover';
}

export function buildWeek(events: CalEvent[], weekStart: string): WeekDay[] {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dayEvents = events
      .filter((e) => dayOf(e.start) === date)
      .sort((a, b) => a.start.localeCompare(b.start));
    const found = new Set(dayEvents.map((e) => classify(e.title)));
    const source: WeekDay['source'] = dayEvents.length > 0 ? 'calendar' : 'guessed';
    const tags: DayTag[] =
      source === 'guessed' ? [isWeekday(date) ? 'work' : 'rest'] : tagOrder.filter((t) => found.has(t));
    const sessions: Session[] = dayEvents
      .filter((e) => classify(e.title) === 'training')
      .map((e) => ({
        eventId: e.id,
        name: e.session ?? e.title,
        start: timeOf(e.start),
        minutes: minutesBetween(e.start, e.end),
        intensity: e.intensity ?? 'light',
      }));
    return { date, tags, source, sessions, plan: planFor(tags, sessions), events: dayEvents };
  });
}

export const coverage = (week: WeekDay[]) => ({
  eventDays: week.filter((d) => d.source === 'calendar').length,
  total: week.length,
});

export interface MoveSuggestion {
  eventId: string;
  session: string;
  fromDate: string;
  toDate: string;
  reasons: { date: string; what: string }[]; // e.g. Thursday dinner, Friday flight
}

const LATE_HOUR = 19; // an evening event from this hour on counts against a hard session that day

const whatOf = (e: CalEvent) => e.label ?? e.title.toLowerCase();

// Scripted, not a general engine: a hard session is suggested earlier when that evening has a social event
// or the next day has travel. The target is the nearest earlier day in the week with no session, travel or social event.
export function suggestMove(week: WeekDay[]): MoveSuggestion | null {
  for (let i = 0; i < week.length; i++) {
    const day = week[i];
    const hard = day.sessions.find((s) => s.intensity === 'hard');
    if (!hard) continue;

    const reasons: MoveSuggestion['reasons'] = [];
    for (const e of day.events) {
      if (classify(e.title) === 'social' && hourOf(e.start) >= LATE_HOUR) reasons.push({ date: day.date, what: whatOf(e) });
    }
    for (const e of week[i + 1]?.events ?? []) {
      if (classify(e.title) === 'travel') reasons.push({ date: week[i + 1].date, what: whatOf(e) });
    }
    if (reasons.length === 0) continue;

    for (let j = i - 1; j >= 0; j--) {
      const earlier = week[j];
      const free = earlier.sessions.length === 0 && !earlier.tags.includes('travel') && !earlier.tags.includes('social');
      if (free) return { eventId: hard.eventId, session: hard.name, fromDate: day.date, toDate: earlier.date, reasons };
    }
  }
  return null;
}

/** The events with the suggested session moved to its new day, same time of day. */
export function applyMove(events: CalEvent[], move: MoveSuggestion): CalEvent[] {
  const days = Math.round(
    (Date.parse(`${move.toDate}T12:00:00Z`) - Date.parse(`${move.fromDate}T12:00:00Z`)) / 86_400_000,
  );
  return events.map((e) =>
    e.id === move.eventId ? { ...e, start: shiftIso(e.start, days), end: shiftIso(e.end, days) } : e,
  );
}
