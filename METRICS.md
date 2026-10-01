# Metrics to watch

Form has no analytics service in this build. Nothing is sent anywhere. The numbers below are computed from in-memory app state, for the demo. They are process measures: nothing is rewarded for them, there are no streaks, points or targets (Master §7), and no threshold here is a model fact.

| Metric | Definition | Where it is computed | Where it shows | Status |
|---|---|---|---|---|
| Plan Fit Rate | Days answered "Yes" to "Did the plan fit?", out of the days answered | `fitSummary()` in `packages/planner/progress.ts` | Progress: "The plan fit on 5 of 6 days." | Live in the demo. Scripted history, so not a measured result (GAPS G35) |
| Check-in completion | Mornings the person gave the 0 to 10 rating, out of the mornings looked at | `checkinCompletion()` in `packages/planner/progress.ts`, with a test | Not shown as its own line. The numerator is the count on Felt vs forecast: "Labelled days so far: N of 21" | **Added 1 Oct 2026 at the user's request.** Watch it: the line "One tap to sharpen tomorrow." on Today is there to raise it |
| Evening log completion | Days the evening log was saved, out of the last 7 days ending today | `useProgress` in `packages/features/useProgress.ts` | Progress: "You logged on 6 of the last 7 days." | Live in the demo |
| Labelled days | Mornings with both a forecast and a rating | `Pair[]` in `useProgress` | Felt vs forecast | The personal-pattern check starts at 21 (`minimum_pairs` in `model.json`) |

## What would be needed to watch them for real

- Persistent storage: state is in memory, and no storage library is approved (GAPS G11).
- Consent for a separate purpose: Master §7 requires one per purpose, so usage analytics would need its own consent screen and its own withdrawal.
- A decision on what "good" looks like. None is made here, on purpose.
