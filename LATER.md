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

- An accuracy summary after day 21, only when the personal-pattern check has run on real logs. Not before: the scripted ratings must never become a number.
- Settings "Connections" rows always say "Preview". When real sync exists they should show the real state.
- Plan Fit over more than a week, with a simple week-by-week step. No streak, no reward.

## From P5

- Show the full licence texts in the app (GAPS G39), with the PMData credit in P6.
- The unrated morning slider keeps its thumb at the "Very low" end. Try hiding the thumb until a first touch.
- Real Polish copy, reviewed by a native speaker (GAPS G40).
- Four distinct dark field tints (today all four equal the raised surface).

## From P6

- A GIF of the production web build following the demo path, as a weaker fallback than a phone recording.
- Try the explicit VoiceOver order (`experimental_accessibilityOrder`) once VoiceOver can be tested (GAPS G41).
- Upgrade to SDK 58 when Expo Go supports it: it adds `EXPO_NO_DEV_MENU` and the per-launch `__expo_disable_fab` parameter. (Corrected 1 Oct: the legacy `disableFab=1` already works on SDK 57, see GAPS G37.)

## From the taste pass (1 Oct 2026)

These need a decision because they change the design system or the demo path:
- Week as a compact 7-day strip (glyph per day) above the list, so the week's rhythm is visible without scrolling. Today only 3 to 4 days fit on screen.
- The Week suggestion as one clearly anchored block (for example, a 2 px Ink rule on the left) instead of plain paragraphs between rows.
- An empty-state glyph (calendar) on Week and Progress, centred, as 5.2 allows.
- Day types on Week as tags with a glyph, as `CLAUDE.md` says; today they are plain comma-separated text.

## From D2 (2 Oct 2026)

- Sign in with Apple: required on iOS as soon as any third-party sign-in is added (App Store 4.8). Social sign-in is out of scope.
- Real accounts and sync (G56), with server-side account deletion.
- Snappy slider for training days, animated checkbox, spotlight on Profile sections (D3).
- A real time picker for the usual training time and the evening reminder (no date-picker dependency is approved).

## From D4 (2 Oct 2026)

- Week in morph mode: if rehearsals show hesitation, show today's session line under the strip (critique D4 #7).
- A thinner dial track, if it can stay at 3:1 or more (critique D4 #8).
- Sign in with Apple, real accounts and sync remain out of scope (see D2).
- Re-run `/impeccable critique` after the hackathon, against the Lichen DESIGN.md.
