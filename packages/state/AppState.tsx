// In-memory app state for the demo: consent choices, the calendar link, the day's loop (rating, log, forecast) and the scripted clock.
// [GAP G11: no storage library is approved, so this resets on every launch. That suits the scripted demo. "Reset demo" in Settings does the same.]
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { martaWeek } from '@fixtures';
import type { DailyLog, FormResult } from '@model';
import type { EveningAnswers } from '@planner/dailyLog';
import type { PlanId } from '@tokens';

import { defaultPrefs, defaultProfile, type Account, type NotificationPrefs, type Profile } from './profile';

export type Purpose = 'scoring' | 'personalModel' | 'calendar' | 'health';
export const purposes: Purpose[] = ['scoring', 'personalModel', 'calendar', 'health'];

export type Answer = 'allow' | 'decline';
export type SuggestionStatus = 'open' | 'moved' | 'kept';
/** The demo clock's time of day. Used only when the demo build turns the demo clock on (see clock.ts). */
export type DemoPhase = 'morning' | 'evening';
/** How the person left Welcome. The account path adds an account step to the onboarding stepper (auth is mocked, D2). */
export type OnboardingPath = 'guest' | 'account';
export type NotificationsAnswer = 'allowed' | 'declined';

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
  welcomePlayed: boolean; // the Welcome sequence plays once per launch (GAP G52: once per install needs storage)
  onboardingPath: OnboardingPath;
  notifications: NotificationsAnswer | null;
  consents: Record<Purpose, Answer | null>;
  calendar: 'none' | 'connected';
  suggestion: SuggestionStatus;
  demoDay: string; // the scripted "today"
  demoPhase: DemoPhase; // the demo clock: the demo build starts every launch on the scripted morning
  revealedFor: string | null; // the last day whose morning reveal has played
  readiness: Record<string, MorningRating>; // by day
  morningStep: Record<string, 'rated' | 'skipped'>; // the pre-reveal step was answered or skipped; it is never asked again that day
  logs: Record<string, EveningAnswers>;
  dailyLogs: Record<string, DailyLog>; // the model's view of each saved log, so tomorrow's forecast can build on it
  forecasts: Record<string, Forecast>; // by the morning the forecast is for
  // Mocked auth (REDESIGN-PROMPT §5): accounts made on this phone this launch, by name and email only. No password is ever kept.
  accounts: Account[];
  account: Account | null; // signed in, or null for a guest
  photo: string | null; // a local image URI, in memory only
  profile: Profile;
  prefs: NotificationPrefs;
}

interface AppState extends State {
  allAnswered: boolean;
  setConsent: (purpose: Purpose, answer: Answer) => void;
  completeOnboarding: () => void;
  markWelcomePlayed: () => void;
  setOnboardingPath: (path: OnboardingPath) => void;
  setNotifications: (answer: NotificationsAnswer) => void;
  connectCalendar: () => void;
  setSuggestion: (status: SuggestionStatus) => void;
  /** The pre-reveal step: a tap stores the rating, Skip stores nothing. Either way the step is done for the day. */
  rateMorning: (day: string, rating: number) => void;
  skipMorning: (day: string) => void;
  setDemoPhase: (phase: DemoPhase) => void;
  markRevealed: (day: string) => void;
  /** Saves tonight's log, and the forecast it produced for tomorrow morning. */
  saveLog: (day: string, answers: EveningAnswers, log: DailyLog, tomorrow?: { day: string; forecast: Forecast }) => void;
  /** The scripted clock moves to the next morning. */
  advanceTo: (day: string) => void;
  resetDemo: () => void;
  signUp: (account: Account) => void;
  /** Signs in an account made on this phone this launch (or the demo account). False when no account uses the email. */
  signIn: (email: string) => boolean;
  signOut: () => void;
  deleteAccount: () => void;
  changeEmail: (email: string) => void;
  saveProfile: (changes: { name?: string; photo?: string | null; profile: Profile }) => void;
  setPrefs: (changes: Partial<NotificationPrefs>) => void;
  /** Delete my data: everything on this phone goes, and Form starts again at Welcome. */
  deleteData: () => void;
}

const empty: State = {
  onboarded: false,
  welcomePlayed: false,
  onboardingPath: 'guest',
  notifications: null,
  consents: { scoring: null, personalModel: null, calendar: null, health: null },
  calendar: 'none',
  suggestion: 'open',
  demoDay: martaWeek.meta.demoToday,
  demoPhase: 'morning',
  revealedFor: null,
  readiness: {},
  morningStep: {},
  logs: {},
  dailyLogs: {},
  forecasts: {},
  accounts: [],
  account: null,
  photo: null,
  profile: defaultProfile,
  prefs: defaultPrefs,
};

const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

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
      markWelcomePlayed: () => setState((s) => (s.welcomePlayed ? s : { ...s, welcomePlayed: true })),
      setOnboardingPath: (onboardingPath) => setState((s) => ({ ...s, onboardingPath })),
      // Allowing notifications turns on both the morning plan and the evening reminder; Profile can change either.
      setNotifications: (notifications) =>
        setState((s) => ({
          ...s,
          notifications,
          prefs: notifications === 'allowed' ? { ...s.prefs, morningPlan: true, eveningReminder: true } : s.prefs,
        })),
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
      signUp: (account) =>
        setState((s) => ({
          ...s,
          accounts: [...s.accounts.filter((a) => !sameEmail(a.email, account.email)), account],
          account,
        })),
      signIn: (email) => {
        const found = state.accounts.find((a) => sameEmail(a.email, email));
        if (found) setState((s) => ({ ...s, account: found }));
        return Boolean(found);
      },
      signOut: () => setState((s) => ({ ...s, account: null, photo: null })),
      deleteAccount: () =>
        setState((s) => ({
          ...s,
          accounts: s.account ? s.accounts.filter((a) => !sameEmail(a.email, s.account?.email ?? '')) : s.accounts,
          account: null,
          photo: null,
        })),
      changeEmail: (email) =>
        setState((s) => {
          if (!s.account) return s;
          const account = { ...s.account, email: email.trim() };
          return { ...s, account, accounts: s.accounts.map((a) => (sameEmail(a.email, s.account?.email ?? '') ? account : a)) };
        }),
      saveProfile: ({ name, photo, profile }) =>
        setState((s) => {
          const account = s.account && name !== undefined ? { ...s.account, name: name.trim() } : s.account;
          return {
            ...s,
            profile,
            photo: photo === undefined ? s.photo : photo,
            account,
            accounts: account ? s.accounts.map((a) => (sameEmail(a.email, account.email) ? account : a)) : s.accounts,
          };
        }),
      setPrefs: (changes) => setState((s) => ({ ...s, prefs: { ...s.prefs, ...changes } })),
      deleteData: () => setState(empty),
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
