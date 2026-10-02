// Profile, account and notification settings (REDESIGN-PROMPT §5). Everything is in memory: no backend, no network, no passwords kept.
// Field rule (GDPR Art. 5(1)(c)): every field has a stated use. No date of birth, height, weight or sex: nothing in Form uses them.
// [GAP G55: the plan engine reads only calendar events. Training days, the usual time and work days are stored and shown, but nothing
//  plans from them yet. Session renames are applied as a display-name map, so the engine is unchanged.]
import { martaCalendar } from '@fixtures';

export interface Account {
  name: string;
  email: string;
}

/** The demo build's "Continue as Marta". The email is a fixture value (user decision, 1 Oct 2026), not a real address. */
export const demoAccount: Account = { name: 'Marta', email: 'marta@example.com' };

export interface SessionEntry {
  id: string;
  name: string; // what Form shows
  source: string | null; // the calendar's session name this entry renames; null for a session added here
}

export interface Profile {
  trainingDays: number; // 1-7
  trainingTime: string; // "HH:MM"
  sessions: SessionEntry[];
  workDays: number[]; // 0 = Monday ... 6 = Sunday
}

export interface NotificationPrefs {
  morningPlan: boolean;
  eveningReminder: boolean;
  eveningTime: string; // "HH:MM"
}

// [GAP G53: no reminder time is decided. 21:00 is a proposal, one of three choices on Profile.]
export const eveningTimes = ['20:00', '21:00', '22:00'] as const;

const weekdayIndex = (iso: string) => (new Date(`${iso.slice(0, 10)}T12:00:00`).getDay() + 6) % 7;

/** The starting profile is what Form read from the (scripted) calendar, never invented values. */
function fromCalendar(): Profile {
  const events = martaCalendar.events;
  const training = events.filter((e) => e.session);
  const names = [...new Set(training.map((e) => e.session as string))];
  const times = training.map((e) => e.start.slice(11, 16));
  const usual = times.sort((a, b) => times.filter((t) => t === b).length - times.filter((t) => t === a).length)[0] ?? '18:00';
  const workDays = [
    ...new Set(events.filter((e) => !e.session && !e.label).map((e) => weekdayIndex(e.start))),
  ].sort((a, b) => a - b);
  return {
    trainingDays: new Set(training.map((e) => e.start.slice(0, 10))).size,
    trainingTime: usual,
    sessions: names.map((name, i) => ({ id: `s${i}`, name, source: name })),
    workDays,
  };
}

export const defaultProfile: Profile = fromCalendar();

export const defaultPrefs: NotificationPrefs = { morningPlan: false, eveningReminder: false, eveningTime: '21:00' };

/** The name Form shows for a calendar session: the person's rename if there is one, otherwise the calendar's own. */
export function displaySession(profile: Profile, calendarName: string): string {
  return profile.sessions.find((s) => s.source === calendarName)?.name ?? calendarName;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const validTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time.trim());
export const MIN_PASSWORD = 8;
