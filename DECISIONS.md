# Decisions

Dated 2026-09-30. Source: approval of the Step 1 plan, which accepted every recommendation in section F. Change an entry only on the user's explicit instruction, and log the date.

## Answers to the open decisions

| # | Decision | Answer | Reason |
|---|---|---|---|
| 1 | Tagline | "Plan your week around how you'll feel." | Works with or without a wearable; wellness wording. The alternative implies a watch and a sensor claim |
| 2 | Uncertainty display | "Likely 34–68" as the primary line, plus "Based on N of 11 inputs" from `missing_inputs` (11 = the inputs a person can add, `INPUT_IDS` in `packages/model/adapter.ts`; corrected from 9 in the plan). No decision-confidence label | `error_band` 17.2 is a constant and "not a calibrated interval" (`model.json`). A confidence label needs invented thresholds |
| 3 | Progress mechanic | Plan Fit Rate ("5 of 7"). The 21-day count is one caption on Felt vs Measured, not a meter | Process metric, honest, no streak. The personal layer helped 1 of 16 people, so a "learning" meter over-promises |
| 4 | Score name | "Form score". "Readiness" stays as plain vocabulary in copy | Avoids a direct collision with Apple's "Readiness" |
| 5 | Body font | Source Sans 3, Regular (400) and SemiBold (600). Manrope SemiBold, Bold, ExtraBold for display | Identical metrics on iOS and Android; full Polish glyphs (checked) |
| 6 | Demo language | English only. All strings in one typed `copy.ts`. Pseudo-localisation (+30%) test in P5. No i18n library | A library would need approval |
| 7 | Demo device | **Pending: which phones do the two of you have?** Default: physical Android phone with Expo Go if the store copy supports SDK 57, else an EAS development build. `react-native-web` + `react-dom` approved as a dev-only screenshot preview | Expo Go for SDK 57 was unconfirmed on the stores; an iPhone needs an Apple Developer account per the Expo docs |
| 8 | Project location | Expo app at the project root. Metro `blockList` and `.gitignore` for `pmdata`, `form-model`, `FORM-ML-Kit*`, `hiring-agent`, `Inspirations`. `packages/tokens` is a plain folder with a tsconfig path alias, no npm workspaces | 1.82 GB of `pmdata`; workspaces add Metro risk on Windows |
| 9 | Morning readiness input | Added to scope: one 0–10 control on Today, after the reveal (P3) | It is the model's strongest input (importance 0.946) and its training label |

## Other decisions from the plan

- Feature freeze at the end of P3. P4 is screens only. (Brief §10 asks for an early freeze; the Master's "after Review 3" is superseded.)
- 3-tap log maps to model inputs: effort → `workout_effort`; calendar Training event → `workout_minutes` and tags; alcohol → `alcohol`; "anything unusual?" → `notes` only (no model field).
- Day types on Week are tags, not plan state: Ink text plus a glyph, no colour.
- `type.score` scales up to 1.3× Dynamic Type inside the dial. The range and plan label sit outside the arc and wrap. Confirm at Review 2.
- Icon library: `lucide-react-native` (nothing in `/Components` to prefer).
- No skills from `/Skills` are installed. Skills that conflict with the Master are not used (see the plan, section D).
- Explanation text under the plan uses only drivers the model returned. The "gets sharper as you log" line is not shipped.
- The move suggestion is one scripted scenario from fixtures, not a general engine.

## Still open

- Demo phones (decision 7).
- A lighter dark-theme control stroke: `#5C7189` on raised `#172A3E` is 2.91:1 (needs 3). Propose a value for approval in P1.
- Calendar provider name for the mocked OAuth.
- Definition of "fit" for Plan Fit Rate (proposal: the user's own yes / too hard / too easy answer).
- Plan thresholds (score band × day type). Person B proposes; approve at Review 2.
