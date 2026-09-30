# Later

Ideas and out-of-scope items. Nothing here is built during the hackathon.

## Scope flags

- `SCOPE FLAG: authentication`. Raised while auditing the detail.design "2-in-1 log-in field". Rejected.

## Out of scope by the Master (§8)

Goal mode, what-if simulator, Precise food logging, partner sync, coach or B2B dashboards, real HealthKit / Health Connect sync, calendar write, retraining, authentication, streaks, points, leaderboards.

## Ideas

- Persist the "reveal shown today" flag across launches (needs a storage dependency, approval required).
- Copy-lint script that greps `copy.ts` for forbidden vocabulary (diagnose, treat, prevent, injury risk, "your body needs", good/bad/cheat food words).
- Real Reanimated memory measurement on a mid-range Android phone.
- Polish translation of `copy.ts` after the +30% length test.
- After the hackathon: write tokens and components into Figma (Figma MCP is read-only until then).

## From P2

- Show the full OFL texts in the app (Settings currently names the fonts and points to `assets/licenses`).
- Undo for accepting or keeping the move suggestion.
- Move the calendar screen's primary action to the bottom of the screen, like onboarding, for the thumb zone.
- Week rows are read-only. A day-detail view is not planned for the hackathon.
- Sticky suggestion footer takes about 40% of the height at 844 pt, so Saturday and Sunday sit below the fold. Compare with the suggestion at the top, or as a collapsed bar.

## From P4

- Felt vs forecast shows the last 7 days only. A "Load more" for older days once there is real history.
- An accuracy summary after day 21, only when the personal-pattern check has run on real logs. Not before: the scripted ratings must never become a number.
- Show the "inside the likely range" line only for days outside it. Six identical lines in a row are noise (P4 self-review finding).
- Replace the "Connecting" spinner with a determinate bar (GAPS G36).
- Settings "Connections" rows always say "Preview". When real sync exists they should show the real state.
- Plan Fit over more than a week, with a simple week-by-week step. No streak, no reward.
