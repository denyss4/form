// Builds the app icons from the user's logo (Logos/form-white.svg): npm run icons
// The icon is the logo's F, Text High (#F5F5F7) on the Lichen canvas (#121212), with Welcome's sage "first light" rising faintly from
// the bottom edge (opacity 0.22 at the edge, fading out). The F's three strokes are drawn as one path so no seam shows where they meet.
// Writes the SVG sources to assets/generated/icons/ and renders the PNGs into assets/ with headless Chrome (no new dependency).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const { darkColor: c } = await import('../packages/tokens/color.ts');
const root = path.join(import.meta.dirname, '..');
const src = fs.readFileSync(path.join(root, 'Logos/form-white.svg'), 'utf8');
const shapes = [...src.matchAll(/<(path|polygon)[^>]*\/>/g)].map((m) => m[0].replace(/ class="st0"/, ''));
const F = [...src.matchAll(/ d="(M(?:12\.09|23\.79|17\.94)[^"]+)"/g)].map((m) => m[1]);
if (F.length !== 3) throw new Error('Could not find the three strokes of the F in the logo file');

const CANVAS = c.bg.canvas, TEXT = c.text.primary, SAGE = c.action.primary;
const box = { x: 0.4, y: 4.52, w: 61.2, h: 58.23 }; // the F's bounds in logo units

function glyph(size, share, fill) {
  const s = (size * share) / box.h;
  const tx = (size - box.w * s) / 2 - box.x * s;
  const ty = (size - box.h * s) / 2 - box.y * s;
  return `<g transform="translate(${tx} ${ty}) scale(${s})" fill="${fill}"><path d="${F.join('')}"/></g>`;
}
const glow = (size) =>
  `<defs><radialGradient id="g" cx="50%" cy="100%" r="75%"><stop offset="0" stop-color="${SAGE}" stop-opacity="0.22"/>` +
  `<stop offset="1" stop-color="${SAGE}" stop-opacity="0"/></radialGradient></defs><rect width="${size}" height="${size}" fill="url(#g)"/>`;
const svg = (size, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`;
const ws = (1024 * 0.7) / 261.1;

const icons = {
  icon: [1024, `<rect width="1024" height="1024" fill="${CANVAS}"/>${glow(1024)}${glyph(1024, 0.44, TEXT)}`], // iOS: opaque, square
  'android-icon-foreground': [1024, glyph(1024, 0.34, TEXT)], // inside the adaptive icon's safe zone
  'android-icon-background': [1024, `<rect width="1024" height="1024" fill="${CANVAS}"/>${glow(1024)}`],
  'android-icon-monochrome': [1024, glyph(1024, 0.34, TEXT)], // themed icons use only its shape and tint it
  favicon: [48, `<rect width="48" height="48" fill="${CANVAS}"/>${glyph(48, 0.5, TEXT)}`],
  'splash-icon': [1024, `<g transform="translate(${(1024 - 261.1 * ws) / 2} ${(1024 - 65.87 * ws) / 2}) scale(${ws})" fill="${TEXT}">${shapes.join('')}</g>`],
};

const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) =>
  fs.existsSync(p),
);
if (!chrome) throw new Error('Needs Chrome or Edge to render the PNGs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'form-icons-'));
for (const [name, [size, body]] of Object.entries(icons)) {
  const file = svg(size, body);
  fs.writeFileSync(path.join(root, 'assets/generated/icons', `${name}.svg`), file);
  const html = path.join(tmp, `${name}.html`);
  fs.writeFileSync(html, `<!doctype html><style>html,body{margin:0;background:transparent;overflow:hidden}svg{display:block}</style>${file}`);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--default-background-color=00000000',
    `--window-size=${size},${size}`, `--screenshot=${path.join(root, 'assets', `${name}.png`)}`, `file:///${html.split(path.sep).join('/')}`,
  ], { stdio: 'ignore' });
  console.log(`assets/${name}.png (${size}×${size})`);
}
