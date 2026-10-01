// Time of day for Today: morning (the rating step, spec R2) and evening ("Log tonight" as the primary, spec R1).
// Normal builds follow the phone's clock. The demo build (`npm run demo`, EXPO_PUBLIC_DEMO_CLOCK=on) follows a demo clock instead,
// which starts on the scripted morning and is stepped by a long-press on Today's date, so the demo works at any hour (user decision,
// 1 Oct 2026). [GAP G48: the demo clock exists only in the demo build.]
import { useGlobalSearchParams } from 'expo-router';

import { useAppState } from './AppState';

/** True only in the demo build. Inlined by Metro at bundle time. */
export const demoClockOn = process.env.EXPO_PUBLIC_DEMO_CLOCK === 'on';

export const MORNING_UNTIL = 12; // spec R2: the rating step is shown on first opens before 12:00
export const EVENING_FROM = 17; // spec R1: "Log tonight" is the primary from 17:00

const flag = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === '1' ? true : raw === '0' ? false : undefined;
};

export function useDayPhase(): { morning: boolean; evening: boolean } {
  const app = useAppState();
  // Review only: ?morning=1|0 and ?evening=1|0 override the phone's clock.
  const params = useGlobalSearchParams<{ morning?: string; evening?: string }>();

  if (demoClockOn) return { morning: app.demoPhase === 'morning', evening: app.demoPhase === 'evening' };

  const hour = new Date().getHours();
  return {
    morning: flag(params.morning) ?? hour < MORNING_UNTIL,
    evening: flag(params.evening) ?? hour >= EVENING_FROM,
  };
}
