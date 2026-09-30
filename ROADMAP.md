# Roadmap

Total about 30 h: Person A (design and front end) 18.5 h, Person B (data and model) 11.5 h.
Hackathon: Sat 3 – Sun 4 Oct 2026. P0–P1 before the weekend, P2–P3 on Day 1, P4–P6 on Day 2.
Feature freeze at the end of P3. P4 is screens only. At every Review, stop and wait for approval.

| Phase | Deliverables | Acceptance | A / B (h) | Checkpoint | Status |
|---|---|---|---|---|---|
| P0 | Repo, Expo TS scaffold, fonts, docs, lint rule, model intake, adapter spec | Build runs on the demo device and prints `51, likely 34–68` | 2 / 1 | Device run | Built and verified off-device. Waiting on the demo phone |
| P1 | `packages/tokens`, Text, Button, PlanGlyph, ScoreDial (app, widget, watch), DriverRow, `/gallery`, `fixtures/marta-week.json` | `npm run check` passes; every token and state screenshotted at 390×844 and the largest Dynamic Type | 4 / 1 | Review 1 + `/design:design-critique` (exploration) | Built and critiqued. **Waiting at Review 1** (see `CRITIQUE.md`) |
| P2 | Onboarding, consent (4 purposes), mocked calendar import, Week view, scripted move suggestion | Every state screenshotted; accept and decline both reflow | 3.5 / 2.5 | Screenshots | Built. Screenshots in `docs/screens/p2`. Travel animation not yet watched (GAPS G28) |
| P3 | 3-tap evening log, Today (reveal, drivers, plan, colour field), `plan()`, adapter wiring, morning slider | Reveal honours reduced motion; explanations use only returned drivers; day-1 state | 4 / 3 | Review 2 + critique + accessibility pass | Built, audited and critiqued (see `CRITIQUE.md`). The user replied "Yes, go to P4", so P4 started. Feature freeze applies from here |
| P4 | Plan Fit meter, Felt vs Measured, mocked Health-sync and calendar-write screens | Every state screenshotted | 2 / 2 | Screenshots, then freeze | Built. Screenshots in `docs/screens/p4` (31 files). Run on an iPhone (Expo Go, SDK 57): 9 stills reviewed in `docs/screens/device`. **Feature freeze applies now** |
| P5 | Critique fixes, reduced-motion pass, Polish-length test, dark stroke fix | Critical and Moderate findings fixed or argued in `CRITIQUE.md` | 2 / 1.5 | Review 3 | Built. Screenshots in `docs/screens/p5`. **Waiting at Review 3** (see `CRITIQUE.md`) |
| P6 | Demo path locked, fallback recording, PMData credit slide | Two rehearsals under 3 minutes | 1 / 0.5 | Rehearsal | Not started |

## P0 tasks

| Task | Owner | h | Status |
|---|---|---|---|
| P0.1 Gate and location: phone check, git init, `.gitignore`, copy `MASTER_PROMPT.md` | A | 0.5 | Done except the phone check (waits on the user, GAPS G17) |
| P0.2 Docs: DECISIONS, CLAUDE, ROADMAP, GAPS, LATER | A | 0.25 | Done |
| P0.3 Scaffold: Expo SDK 57, TS strict, expo-router, listed dependencies only, Metro blockList | A | 0.5 | Done. `expo-doctor` 21/21; Android bundle builds |
| P0.4 Fonts: five TTFs, `useFonts`, glyph screen, `OFL.txt` | A | 0.5 | Done except `OFL.txt` (GAPS G13). Glyphs and digit widths verified in the web preview |
| P0.5 Lint rule for hard-coded colour and spacing, `npm run check` | A | 0.25 | Done. Rule proven on a probe file, then deleted |
| P0.6 Model intake: `packages/model`, `verify.mjs`, `.d.mts`, Metro import test | B | 0.5 | Done. 335 vectors pass; Metro imports the `.mjs` and JSON |
| P0.7 Adapter `toFormResult()` and its GAPs | B | 0.5 | Done. 5 tests pass |
| P0.8 Hello screen calling `predict(example-input)` | A + B | 0.25 | Done in the web preview (`51`, "Likely 34–68"). **Device run pending: the P0 checkpoint** |
