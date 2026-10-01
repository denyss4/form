// In-memory app state for the demo: consent choices, the calendar link, the day's loop (rating, plan, log, forecast) and the scripted clock.
// [GAP G11: no storage library is approved, so this resets on every launch. That suits the scripted demo. "Reset demo" in Settings does the same.]
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { martaWeek } from '@fixtures';
import type { DailyLog, FormResult } from '@model';
import type { EveningAnswers } from '@planner/dailyLog';
import type { PlanId } from '@tokens';

export type Purpose = 'scoring' | 'personalModel' | 'calendar' | 'health';
export const purposes: Purpose[] = ['scoring', 'personalModel', 'calendar', 'health'];

export type Answer = 'allow' | 'decline';
export type SuggestionStatus = 'open' | 'moved' | 'kept';
/** The demo clock's time of day. Used only when the demo build turns the demo clock on (see clock.ts). */
export type DemoPhase = 'morning' | 'evening';

/**
 * This morning's 0-10 rating (spec R2). It is the model's training label, so it is only ever collected before the score is seen:
 * beforeReveal is always true, and a day with no rating has no entry. Missing data beats anchored data.
 */
export interface MorningRating {
  rating: number;
  timestamp: string; // ISO time of the tap
  beforeReveal: true;
}

/** A forecast for one morning, with the plan the engine gave it. */
export interface Forecast {
  result: FormResult;
  plan: PlanId;
}

interface State {
  onboarded: boolean;
  consents: Record<Purpose, Answer | null>;
  calendar: 'none' | 'connected';
  suggestion: SuggestionStatus;
  demoDay: string; // the scripted "today"
  demoPhase: DemoPhase; // the demo clock: the demo build starts every launch on the scripted morning
  revealedFor: string | null; // the last day whose morning reveal has played
  planAccepted: Record<string, boolean>;
  readiness: Record<string, MorningRating>; // by day
  morningStep: Record<string, 'rated' | 'skipped'>; // the pre-reveal step was answered or skipped; it is never asked again that day
  logs: Record<string, EveningAnswers>;
  dailyLogs: Record<string, DailyLog>; // the model's view of each saved log, so tomorrow's forecast can build on it
  forecasts: Record<string, Forecast>; // by the morning the forecast is for
}

interface AppState extends State {
  allAnswered: boolean;
  setConsent: (purpose: Purpose, answer: Answer) => void;
  completeOnboarding: () => void;
  connectCalendar: () => void;
  setSuggestion: (status: SuggestionStatus) => void;
  /** The pre-reveal step: a tap stores the rating, Skip stores nothing. Either way the step is done for the day. */
  rateMorning: (day: string, rating: number) => void;
  skipMorning: (day: string) => void;
  setDemoPhase: (phase: DemoPhase) => void;
  acceptPlan: (day: string) => void;
  markRevealed: (day: string) => void;
  /** Saves tonight's log, and the forecast it produced for tomorrow morning. */
  saveLog: (day: string, answers: EveningAnswers, log: DailyLog, tomorrow?: { day: string; forecast: Forecast }) => void;
  /** The scripted clock moves to the next morning. */
  advanceTo: (day: string) => void;
  resetDemo: () => void;
}

const empty: State = {
  onboarded: false,
  consents: { scoring: null, personalModel: null, calendar: null, health: null },
  calendar: 'none',
  suggestion: 'open',
  demoDay: martaWeek.meta.demoToday,
  demoPhase: 'morning',
  revealedFor: null,
  planAccepted: {},
  readiness: {},
  morningStep: {},
  logs: {},
  dailyLogs: {},
  forecasts: {},
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
      setDemoPhase: (demoPhase) => setState((s) => ({ ...s, demoPhase })),
      rateMorning: (day, rating) =>
        setState((s) => ({
          ...s,
          readiness: { ...s.readiness, [day]: { rating, timestamp: new Date().toISOString(), beforeReveal: true } },
          morningStep: { ...s.morningStep, [day]: 'rated' },
        })),
      skipMorning: (day) => setState((s) => ({ ...s, morningStep: { ...s.morningStep, [day]: 'skipped' } })),
      acceptPlan: (day) => setState((s) => ({ ...s, planAccepted: { ...s.planAccepted, [day]: true } })),
      markRevealed: (day) => setState((s) => (s.revealedFor === day ? s : { ...s, revealedFor: day })),
      saveLog: (day, answers, log, tomorrow) =>
        setState((s) => ({
          ...s,
          logs: { ...s.logs, [day]: answers },
          dailyLogs: { ...s.dailyLogs, [day]: log },
          forecasts: tomorrow ? { ...s.forecasts, [tomorrow.day]: tomorrow.forecast } : s.forecasts,
        })),
      // The next morning: the demo clock goes back to morning with it.
      advanceTo: (day) => setState((s) => ({ ...s, demoDay: day, demoPhase: 'morning' })),
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
