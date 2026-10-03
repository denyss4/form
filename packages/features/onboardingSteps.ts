// The onboarding stepper's numbering (REDESIGN-PROMPT §4.2): account (account path only), consent, calendar, notifications.
import { copy } from '@copy';
import { useAppState } from '@state';

export type OnboardingStep = 'account' | 'consent' | 'calendar' | 'notifications';

export function useOnboardingStep(name: OnboardingStep) {
  const { onboardingPath } = useAppState();
  const steps: OnboardingStep[] =
    // The account step is only on the account path; a screen that is the account step is always on it (sign in or up opened directly).
    onboardingPath === 'account' || name === 'account' ? ['account', 'consent', 'calendar', 'notifications'] : ['consent', 'calendar', 'notifications'];
  // names: every step's name, in order, for the numbered stepper (D5, 2B).
  return { step: Math.max(steps.indexOf(name), 0) + 1, total: steps.length, name: copy.stepper.steps[name], names: steps.map((s) => copy.stepper.steps[s]) };
}
