// Re-rendering on a language change (D5). copy.ts answers in the current language on every read, so a screen only needs to render again.
// LanguageKey wraps each screen (the root Stack's screenLayout) and remounts it when the language changes: the navigation stack stays,
// the screen redraws in the new language. Local state on a screen (a half-typed field) is reset by the switch.
import { Fragment, useSyncExternalStore, type ReactNode } from 'react';

import { getLanguage, subscribeLanguage } from '@copy';

export const useLanguage = () => useSyncExternalStore(subscribeLanguage, getLanguage, getLanguage);

export function LanguageKey({ children }: { children: ReactNode }) {
  const language = useLanguage();
  return <Fragment key={language}>{children}</Fragment>;
}
