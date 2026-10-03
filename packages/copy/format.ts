// Date and list wording. Kept here, next to copy.ts, so every visible string has one home. English and Polish (D5), read in the current
// language on every call (locale.ts). Polish weekdays are lower case, as Polish writes them; dates use the month in the genitive
// ("8 października"), and day ranges the genitive of the weekday ("od poniedziałku do piątku").
import { addDays, weekdayOf } from '../planner/dates.ts';
import { getLanguage } from './locale.ts';

const words = {
  en: {
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    letters: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    mondayFirst: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    mondayFirstLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    range: (from: number, to: number) => `${words.en.mondayFirstLong[from]} to ${words.en.mondayFirstLong[to]}`,
  },
  pl: {
    shortDays: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
    longDays: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
    letters: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
    months: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
    longMonths: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
    mondayFirst: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
    mondayFirstLong: ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'],
    range: (from: number, to: number) => `od ${plGenitive[from]} do ${plGenitive[to]}`,
  },
};
const plGenitive = ['poniedziałku', 'wtorku', 'środy', 'czwartku', 'piątku', 'soboty', 'niedzieli'];
const w = () => words[getLanguage()];

const dayNumber = (date: string) => Number(date.slice(8, 10));
const monthOf = (date: string) => w().months[Number(date.slice(5, 7)) - 1];

/** "Thu 8" */
export const formatDay = (date: string) => `${w().shortDays[weekdayOf(date)]} ${dayNumber(date)}`;

/** "Thursday" */
export const weekdayName = (date: string) => w().longDays[weekdayOf(date)];

/** "T": one letter for the Week strip. Screen readers get spokenDate instead. */
export const dayLetter = (date: string) => w().letters[weekdayOf(date)];

/** "8" */
export const dateNumber = (date: string) => String(dayNumber(date));

/** "Thursday 8 October", for VoiceOver. */
export const spokenDate = (date: string) => `${weekdayName(date)} ${dayNumber(date)} ${w().longMonths[Number(date.slice(5, 7)) - 1]}`;

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
export const weekdayShort = (index: number) => w().mondayFirst[index] ?? '';
export const weekdayLong = (index: number) => w().mondayFirstLong[index] ?? '';

/** "Mon–Fri" for a run of three or more days, otherwise "Mon, Wed". */
export function formatDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  const run = sorted.length >= 3 && sorted.every((d, i) => i === 0 || d === (sorted[i - 1] ?? -2) + 1);
  if (run) return `${weekdayShort(sorted[0] ?? 0)}–${weekdayShort(sorted[sorted.length - 1] ?? 0)}`;
  return sorted.map(weekdayShort).join(', ');
}

/** The spoken form: "Monday to Friday" ("od poniedziałku do piątku"), or "Monday, Wednesday". */
export function spokenDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  const run = sorted.length >= 3 && sorted.every((d, i) => i === 0 || d === (sorted[i - 1] ?? -2) + 1);
  if (run) return w().range(sorted[0] ?? 0, sorted[sorted.length - 1] ?? 0);
  return sorted.map(weekdayLong).join(', ');
}
