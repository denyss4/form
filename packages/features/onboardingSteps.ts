// The onboarding stepper's numbering (REDESIGN-PROMPT §4.2): consent, calendar, notifications.
// An account is never a step (first-launch plan, 3 Oct, item 5): signing in or creating an account sits outside the numbered setup.
// Phase 3 of that plan changes the last step to First log.
import { copy } from '@copy';

export type OnboardingStep = 'consent' | 'calendar' | 'notifications';
const steps: OnboardingStep[] = ['consent', 'calendar', 'notifications'];

export function useOnboardingStep(name: OnboardingStep) {
  // names: every step's name, in order, for the numbered stepper (D5, 2B).
  return {
    step: Math.max(steps.indexOf(name), 0) + 1,
    total: steps.length,
    name: copy.stepper.steps[name],
    names: steps.map((s) => copy.stepper.steps[s]),
  };
}
