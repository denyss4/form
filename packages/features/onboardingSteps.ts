// The onboarding stepper's numbering (REDESIGN-PROMPT §4.2): account (account path only), consent, calendar, notifications.
import { copy } from '@copy';
import { useAppState } from '@state';

export type OnboardingStep = 'account' | 'consent' | 'calendar' | 'notifications';

export function useOnboardingStep(name: OnboardingStep) {
  const { onboardingPath } = useAppState();
  const steps: OnboardingStep[] =
    onboardingPath === 'account' ? ['account', 'consent', 'calendar', 'notifications'] : ['consent', 'calendar', 'notifications'];
  return { step: Math.max(steps.indexOf(name), 0) + 1, total: steps.length, name: copy.stepper.steps[name] };
}
