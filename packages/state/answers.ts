// The two consent answers, worded once and shared by the consent screen and Settings, so withdrawing is the same control as giving.
import { copy } from '../copy/copy.ts';
import type { Answer } from './AppState.tsx';

// Getters, so the labels follow a language change (D5): a plain value would keep the language the module loaded in.
export const answerOptions: { value: Answer; readonly label: string }[] = [
  {
    value: 'decline',
    get label() {
      return copy.consent.decline;
    },
  },
  {
    value: 'allow',
    get label() {
      return copy.consent.allow;
    },
  },
];
