// Date and list wording. Kept here, next to copy.ts, so every visible string has one home.
import { addDays, weekdayOf } from '../planner/dates.ts';

const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const dayNumber = (date: string) => Number(date.slice(8, 10));
const monthOf = (date: string) => months[Number(date.slice(5, 7)) - 1];

/** "Thu 8" */
export const formatDay = (date: string) => `${shortDays[weekdayOf(date)]} ${dayNumber(date)}`;

/** "Thursday" */
export const weekdayName = (date: string) => longDays[weekdayOf(date)];

/** "T": one letter for the Week strip. Screen readers get spokenDate instead. */
export const dayLetter = (date: string) => longDays[weekdayOf(date)].charAt(0);

/** "8" */
export const dateNumber = (date: string) => String(dayNumber(date));

/** "Thursday 8 October", for VoiceOver. */
export const spokenDate = (date: string) => `${weekdayName(date)} ${dayNumber(date)} ${longMonths[Number(date.slice(5, 7)) - 1]}`;

/** "Monday 5 Oct" */
export const formatLong = (date: string) => `${weekdayName(date)} ${dayNumber(date)} ${monthOf(date)}`;

/** "5–11 Oct", or "28 Sep–4 Oct" across a month end. */
export function formatWeek(start: string): string {
  const end = addDays(start, 6);
  return monthOf(start) === monthOf(end)
    ? `${dayNumber(start)}–${dayNumber(end)} ${monthOf(end)}`
    : `${dayNumber(start)} ${monthOf(start)}–${dayNumber(end)} ${monthOf(end)}`;
}

// Work days on Profile, Monday-first indexes (0 = Monday ... 6 = Sunday).
const mondayFirst = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mondayFirstLong = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const weekdayShort = (index: number) => mondayFirst[index] ?? '';
export const weekdayLong = (index: number) => mondayFirstLong[index] ?? '';

/** "Mon–Fri" for a run of three or more days, otherwise "Mon, Wed". */
export function formatDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  const run = sorted.length >= 3 && sorted.every((d, i) => i === 0 || d === (sorted[i - 1] ?? -2) + 1);
  if (run) return `${weekdayShort(sorted[0] ?? 0)}–${weekdayShort(sorted[sorted.length - 1] ?? 0)}`;
  return sorted.map(weekdayShort).join(', ');
}

/** The spoken form: "Monday to Friday", or "Monday, Wednesday". */
export function spokenDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  const run = sorted.length >= 3 && sorted.every((d, i) => i === 0 || d === (sorted[i - 1] ?? -2) + 1);
  if (run) return `${weekdayLong(sorted[0] ?? 0)} to ${weekdayLong(sorted[sorted.length - 1] ?? 0)}`;
  return sorted.map(weekdayLong).join(', ');
}
