// In-memory app state for the demo: consent choices, whether onboarding is done, calendar link, the move suggestion's outcome.
// [GAP G11: no storage library is approved, so this resets on every launch. That suits the scripted demo. "Reset demo" in Settings does the same.]
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Purpose = 'scoring' | 'personalModel' | 'calendar' | 'health';
export const purposes: Purpose[] = ['scoring', 'personalModel', 'calendar', 'health'];

export type Answer = 'allow' | 'decline';
export type SuggestionStatus = 'open' | 'moved' | 'kept';

interface State {
  onboarded: boolean;
  consents: Record<Purpose, Answer | null>;
  calendar: 'none' | 'connected';
  suggestion: SuggestionStatus;
}

interface AppState extends State {
  allAnswered: boolean;
  setConsent: (purpose: Purpose, answer: Answer) => void;
  completeOnboarding: () => void;
  connectCalendar: () => void;
  setSuggestion: (status: SuggestionStatus) => void;
  resetDemo: () => void;
}

const empty: State = {
  onboarded: false,
  consents: { scoring: null, personalModel: null, calendar: null, health: null },
  calendar: 'none',
  suggestion: 'open',
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);

  const setConsent = useCallback((purpose: Purpose, answer: Answer) => {
    setState((s) => ({
      ...s,
      consents: { ...s.consents, [purpose]: answer },
      // Withdrawing calendar consent disconnects the calendar, as easily as it was given.
      calendar: purpose === 'calendar' && answer === 'decline' ? 'none' : s.calendar,
    }));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ...state,
      allAnswered: purposes.every((p) => state.consents[p] !== null),
      setConsent,
      completeOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
      connectCalendar: () => setState((s) => ({ ...s, calendar: 'connected' })),
      setSuggestion: (suggestion) => setState((s) => ({ ...s, suggestion })),
      resetDemo: () => setState(empty),
    }),
    [state, setConsent],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
