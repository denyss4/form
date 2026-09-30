// Plain calendar-date helpers on 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:mm' strings. No time zones: the calendar is the user's local time.
// No imports, so `node --test` can load this file.

// Noon UTC keeps the calendar day stable whatever the machine's time zone.
const at = (date: string) => new Date(`${date}T12:00:00Z`);

export const dayOf = (iso: string) => iso.slice(0, 10);
export const timeOf = (iso: string) => iso.slice(11, 16);

export function addDays(date: string, days: number): string {
  const d = at(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday ... 6 = Saturday. */
export const weekdayOf = (date: string) => at(date).getUTCDay();

export const isWeekday = (date: string) => {
  const day = weekdayOf(date);
  return day >= 1 && day <= 5;
};

/** Moves an ISO date-time by whole days and keeps its time of day. */
export const shiftIso = (iso: string, days: number) => addDays(dayOf(iso), days) + iso.slice(10);

export const hourOf = (iso: string) => Number(timeOf(iso).slice(0, 2));
