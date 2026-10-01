// `npm run demo`: the production-mode bundle with the demo clock on (packages/state/clock.ts).
// Sets EXPO_PUBLIC_DEMO_CLOCK=on for this run only, clears Metro's cache so the value is inlined fresh, and serves on port 8090 so it
// never collides with the dev server on 8081. Plain Node, so it works the same in Windows npm scripts. No dependency.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const expoCli = require.resolve('expo/bin/cli');
const PORT = '8090';

const child = spawn(process.execPath, [expoCli, 'start', '--no-dev', '--minify', '--clear', '--port', PORT, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, EXPO_PUBLIC_DEMO_CLOCK: 'on' },
});
child.on('exit', (code) => process.exit(code ?? 0));
