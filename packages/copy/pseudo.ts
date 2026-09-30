// Pseudo-localisation for the Polish-length test (DECISIONS.md #6, MASTER_PROMPT §7): every word of three letters or more grows by 40%,
// which makes the whole of copy.ts about 30% longer, with Polish letters. A screen that survives it has room for real Polish. Review only.
//   web:    add ?pseudo=1 to the first URL you load
//   native: start the dev server with EXPO_PUBLIC_PSEUDO=1
// Numbers and punctuation are left alone, so the numbers on screen stay exactly what the model returned.
const TAIL = 'ąćęłńóśźż';

function grow(word: string): string {
  const letters = Array.from(word);
  if (letters.length < 3) return word;
  const extra = Math.max(1, Math.round(letters.length * 0.4));
  let seed = letters.length;
  for (const ch of letters) seed = (seed * 31 + ch.codePointAt(0)!) % 9;
  let tail = '';
  for (let i = 0; i < extra; i++) tail += TAIL[(seed + i) % TAIL.length];
  return word + tail;
}

/** Grows every word made of letters. Anything with a digit in it is left as it is. */
export const expand = (text: string): string => text.replace(/[\p{L}'’]+/gu, grow);

/** The same shape in, the same shape out: strings grow, functions grow what they return. */
export function pseudoLocalise<T>(value: T): T {
  if (typeof value === 'string') return expand(value) as T;
  if (typeof value === 'function') {
    const fn = value as unknown as (...args: unknown[]) => unknown;
    return ((...args: unknown[]) => pseudoLocalise(fn(...args))) as T;
  }
  if (Array.isArray(value)) return value.map((item) => pseudoLocalise(item)) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, pseudoLocalise(item)])) as T;
  }
  return value;
}

/** True when this run asked for pseudo-localisation. */
export function pseudoRequested(): boolean {
  if (process.env.EXPO_PUBLIC_PSEUDO === '1') return true;
  const page = (globalThis as { location?: { search?: string } }).location;
  return page?.search?.includes('pseudo=1') ?? false;
}
