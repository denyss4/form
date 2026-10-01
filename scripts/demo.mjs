// `npm run demo`: the production-mode bundle with the demo clock on (packages/state/clock.ts).
// Sets EXPO_PUBLIC_DEMO_CLOCK=on for this run only, clears Metro's cache so the value is inlined fresh, and serves on port 8090 so it
// never collides with the dev server on 8081. Plain Node, so it works the same in Windows npm scripts. No dependency.
// Also sets EXPO_PUBLIC_BUILD_STAMP (short commit, "+changes" when tracked files differ from it, and this server's start time), shown at
// the bottom of Progress in demo and dev builds only, so the phone shows which code it is running.
import { execSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const expoCli = require.resolve('expo/bin/cli');
const PORT = '8090';

const git = (args) => {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};
const commit = git('rev-parse --short HEAD') || 'no-git';
const changed = git('status --porcelain --untracked-files=no') !== '';
const started = new Date();
const pad = (n) => String(n).padStart(2, '0');
const time = `${started.getFullYear()}-${pad(started.getMonth() + 1)}-${pad(started.getDate())} ${pad(started.getHours())}:${pad(started.getMinutes())}`;
const stamp = `${commit}${changed ? '+changes' : ''}, started ${time}`;
console.log(`Build stamp: ${stamp}`);

const child = spawn(process.execPath, [expoCli, 'start', '--no-dev', '--minify', '--clear', '--port', PORT, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, EXPO_PUBLIC_DEMO_CLOCK: 'on', EXPO_PUBLIC_BUILD_STAMP: stamp },
});
child.on('exit', (code) => process.exit(code ?? 0));
