// A token colour at a given opacity, as an rgba string (the web originals use rgba literals; Form derives them from tokens).
export function alpha(hex: string, a: number): string {
  const n = hex.replace('#', '');
  const v = (i: number) => parseInt(n.slice(i, i + 2), 16);
  return `rgba(${v(0)}, ${v(2)}, ${v(4)}, ${a})`;
}
