// The two consent answers, worded once and shared by the consent screen and Settings, so withdrawing is the same control as giving.
import { copy } from '../copy/copy.ts';
import type { Answer } from './AppState.tsx';

export const answerOptions: { value: Answer; label: string }[] = [
  { value: 'allow', label: copy.consent.allow },
  { value: 'decline', label: copy.consent.decline },
];
