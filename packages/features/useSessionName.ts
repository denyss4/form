// The display-name map for sessions (Q7, 1 Oct): Profile renames reach Week and the evening log without changing the plan engine.
import { useAppState } from '@state';
import { displaySession } from '@state/profile';

export function useSessionName() {
  const { profile } = useAppState();
  return (calendarName: string) => displaySession(profile, calendarName);
}
