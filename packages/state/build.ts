// Which build is running, for checking the phone against the code. Set by `npm run demo` (scripts/demo.mjs) at server start and inlined
// by Metro. Shown only in the demo build and in development; a normal production build shows nothing.
// "App opened" is when this JavaScript started. App state lives in memory, so if that time does not change after a relaunch, the app was
// not really restarted and kept its state (consent answers, logs, the demo clock).
import { demoClockOn } from './clock';

const stamp = process.env.EXPO_PUBLIC_BUILD_STAMP;
const opened = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const openedAt = `${pad(opened.getHours())}:${pad(opened.getMinutes())}:${pad(opened.getSeconds())}`;

export const showBuildStamp = demoClockOn || __DEV__;
export const buildStamp = `${stamp ? `Build ${stamp}` : 'Development build (no stamp)'}. App opened ${openedAt}`;
