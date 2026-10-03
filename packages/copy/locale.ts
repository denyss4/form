// The app's language (D5, from the user: English and Polish, changed on Profile). A tiny store with no React in it, so copy.ts and
// format.ts can read it from anywhere, Node tests included. Screens re-render through useLanguage() (packages/state).
// In memory, like the rest of the demo's settings: a new launch starts in English (GAP G57).
export type Language = 'en' | 'pl';
export const languages: Language[] = ['en', 'pl'];
// Each language is named in itself, so a person who cannot read the current one can still find theirs.
export const languageNames: Record<Language, string> = { en: 'English', pl: 'Polski' };

let current: Language = 'en';
const listeners = new Set<() => void>();

export const getLanguage = (): Language => current;

export function setLanguage(next: Language): void {
  if (next === current) return;
  current = next;
  listeners.forEach((listener) => listener());
}

export function subscribeLanguage(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
