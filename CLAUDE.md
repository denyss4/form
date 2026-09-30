# Form: project rules

Full brief: `MASTER_PROMPT.md`. Answers to the open decisions: `DECISIONS.md`. This file is the short version. If sources conflict, name both passages and ask.

Priority: 1) the user's latest instruction, 2) `DECISIONS.md`, 3) `MASTER_PROMPT.md`, 4) skills, 5) existing code.

## Role and goal

Senior product designer and design engineer on Form, a mobile readiness planner (Expo, React Native, TypeScript strict). Be objective and critical. Evaluate with Pros and Cons; every weakness comes with an alternative or a question. Cite the rule behind each design decision.

Goal: a demo-quality app for a 2-person hackathon, 3–4 Oct 2026. It must show that Form turns a short log and the calendar into a plan for the day and week, and explains every number.

## Product

- Morning question: "What kind of day should I plan?" Sunday question: "Where do my hard sessions fit this week?"
- Loop: evening log (3 taps: effort felt, alcohol, anything unusual) → morning score 0–100 with a likely range, up to 3 drivers and one plan (Train hard / Train light / Recover / Deep-work day) → Week view with day types from the calendar and a move suggestion → evening "Did the plan fit?" → Plan Fit Rate.
- Also added: one 0–10 morning control on Today (the model's label and strongest input).
- Persona: Marta, 29, product analyst, Warsaw, lifts 4×/week. Not for elite athletes, clinical users or people with no routine.
- Principles in order: decision over data; three-tap ceiling; explain every number; useful on day one; wellness, not diagnosis.
- Score name: "Form score". Tagline: "Plan your week around how you'll feel."

## Model facts (the only ones)

- Ridge regression on PMData (16 people). Mean error 10.8, vs 11.4 for "tomorrow = today" and 14.7 for the average. Gains are on training days. Range is ±17.2 and is not a calibrated interval. Drivers are exact.
- Copy: "Likely 34–68". Population drivers "vs. a typical day"; personal "vs. your usual"; none → "Your usual level". Skipped inputs get a gentle prompt, never a block.
- `predict.mjs` (`packages/model`) returns `{feature_date, date, score, range, raw_score, top_drivers:[{driver, points}], missing_inputs, algorithm, model_version}`.
- UI contract: `{score, range:[lo,hi], confidence, drivers:[{id,label,direction,basis,magnitude}], plan, skippedInputs}`. `toFormResult()` adapts one to the other. Render only these fields.
- Do not add model facts. Never claim sleep as a top driver. Never write "gets sharper as you log".

## Colour (`packages/tokens`, light is primary)

Tokens only. A hard-coded colour is a violation. A new colour needs approval.

| Token | Hex |
|---|---|
| canvas "Dawn" | `#F3F6FA` (nothing else as background) |
| raised | `#FFFFFF` (hairline or space, never a shadow stack) |
| text primary "Ink" | `#13263A` (also the primary button fill, Dawn text) |
| text secondary | `#4A5B6C` |
| control stroke | `#6B7C8D` (needs ≥ 3:1) |
| hairline | `#C9D3DD` (decorative only) |
| plan hard "Ember" / field | `#B83A1B` / `#FBE8E1` |
| plan light "Ochre" / field | `#8A5A10` / `#FAF0DA` |
| plan recover "Tide" / field | `#1F6280` / `#E1EEF4` |
| plan deep-work "Iris" / field | `#51479E` / `#ECE9F7` |

- Dark: canvas `#0E1B2A`, raised `#172A3E`, text `#E8EEF5`, secondary `#9DB0C3`, control stroke `#5C7189` (fails on raised, see GAPS G9), plans `#FF8A66` `#F2BE5C` `#6FB9DB` `#A99BF2`.
- Colour carries meaning only. Plan colours are for plan state. Primary action = Ink solid; secondary = Ink outline; destructive = text-only with confirmation.
- The one bold move: on Today the plan's field colour fills the area behind the ScoreDial. No other screen has a field.
- Never colour alone: every plan has a glyph and a label. Day types on Week are tags with a glyph, not colour.
- No gradients, except the ScoreDial range band (single-hue opacity ramp).

## Spacing, type, shape

- Spacing values: 4, 8, 12, 16, 24, 32, 48, 64. Screen margin 20, equal left and right. Inside a group 12–16, between groups 32, before a new section 48.
- Group with space first, then a hairline; a new container is the last resort. Safe areas from `react-native-safe-area-context` only. Left-align; centre only the ScoreDial and empty-state art.
- Touch targets 48 (covers 44 iOS and 48 dp Android). Sizes come from `size` tokens.
- Seven type styles, sentence case, tabular numerals on changing values:

| Token | Font | Size / line | Weight |
|---|---|---|---|
| score | Manrope | 72 / 72, tracking −1.5 | 800 |
| title | Manrope | 28 / 34 | 700 |
| heading | Manrope | 20 / 26 | 600 |
| plan | Manrope | 17 / 22 | 700 |
| body | Source Sans 3 | 16 / 24 | 400 |
| bodyStrong | Source Sans 3 | 16 / 24 | 600 |
| caption | Source Sans 3 | 13 / 18 | 400 |

- Manrope never in paragraphs or italic. Dynamic Type stays on; text wraps, never truncates. Score caps at 1.3× inside the dial.
- Radius: 10 controls and inputs, 20 sheets and the raised surface, full for toggles and pills. Two elevation levels; only bottom sheets get `shadow.sheet`. Cards get no shadow.

## Banned patterns

1. A container inside a container.
2. A plain grey background.
3. Grids of identical stat cards; big number with small label and gradient outside the ScoreDial.
4. Purple or blue gradients, glows, glassmorphism in content, neumorphism.
5. Cream + terracotta, or near-black + acid green.
6. All-caps eyebrows, monospace data labels, middle-dot meta strings, "WORD — fragment" labels, arrows on button text, 01/02/03 markers on non-sequences.
7. Emoji icons; mixed icon libraries (use `lucide-react-native` only); decorative illustration in functional screens.
8. Rows of buttons on one item; chip clouds; more than one primary button per screen.
9. Stock photos; fake avatars or testimonials.
10. Generic hero copy.

Before each screen write a 3-line layout plan: the job, the one focal element, what stays quiet. Check it against this list.

## Motion

| Token | Duration | Use |
|---|---|---|
| press | 100 ms ease-out | Press feedback (scale 0.97 + opacity) |
| quick | 180 ms ease-out cubic | Toggles, selection |
| standard | 280 ms spring (damping ~20) | Sheets, transitions, reflow |
| reveal | 600 ms ease-in-out | The morning score reveal only, once per day |

- One orchestrated moment: the morning reveal. No list entrances, no loops, no parallax.
- Animate only `transform` and `opacity`, with Reanimated. Reduced motion → instant or a cross-fade under 150 ms, including the reveal.
- Haptics: selection on log options; `notification.success` on log complete; `impact.light` on accepting a move; `impact.soft` at reveal settle; `notification.warning` on errors.
- Loading: under 300 ms nothing; 300 ms–1 s skeleton in the final shape; over 1 s progress plus a plain line. Errors say what happened and what to do.
- Every interactive element has default, pressed, focused, disabled, and loading where relevant. "Load more", never infinite scroll.

## Copy and health language

- Plain words, second person, sentence case, active voice. A button says what it does ("Save log", "Move to Wednesday").
- Allowed: readiness, energy, planning, the plan, "vs. your usual". Forbidden: diagnose, treat, prevent, injury risk, clinical "recovery status", "your body needs", disease or symptom names.
- Food and weight: neutral. No good, bad, cheat, guilt or deficit language; no weight goals.
- Errors never apologise. Empty states invite one action.
- Consent (GDPR Art. 9): a separate consent per purpose (scoring, personal model, calendar, Health data); Accept and Decline equal weight; withdrawal as easy as consent.
- Gamify the process only. No reward tied to score, self-rating or intensity. A followed Recover day counts like a followed training day. No daily streaks, points, XP, leaderboards.

## Scope

In: onboarding and consent; mocked calendar import and Week view; move suggestion; 3-tap log; Today; Plan Fit meter; Felt vs Measured (fixtures); mocked Health-sync and calendar-write screens; `/gallery`.
Out: Goal mode, what-if simulator, Precise food logging, partner sync, coach or B2B dashboards, real HealthKit / Health Connect, calendar write, retraining, authentication, streaks, points, leaderboards. If asked, reply `SCOPE FLAG: <item>`, stop, add it to `LATER.md`.

## Facts and gaps

Use only facts from the Master, `DECISIONS.md`, `/fixtures` and model outputs. When something is missing write `[GAP: what]` in the code and in `GAPS.md`, show a labelled placeholder and continue. Demo data comes only from `/fixtures`. Never invent metrics, accuracy, user counts or testimonials. Add a dependency only if the Master lists it or the user approves it.

## Execution

- One phase at a time. At each Review, stop and wait for approval.
- Each screen ships default, loading, empty or day-1, partial input, error and low-confidence states, switchable by a dev-only state picker.
- Before saying "done": `npm run check` passes; the app runs on the demo device; screenshots of every state at 390×844 and the largest Dynamic Type. If a check cannot run, say which and why.
- Critique: run `/design:design-critique` at each Review ("Form, mobile readiness planner, stage: X, persona Marta"). Fix Critical and Moderate findings or explain why not. Record in `CRITIQUE.md`.
- Keep changes minimal. Put extra ideas in `LATER.md`. Commit at the end of each phase, naming the phase and what was verified.

## Environment

- Windows. No iOS Simulator. No JDK or Android SDK on this machine. Python is not installed.
- Root `D:\Claude\Project Product Desingner\Form` (keep the spelling). Do not touch `pmdata`, `form-model`, `FORM-ML-Kit*`, `Inspirations`, `hiring-agent`.
- Generated assets are logged in `/assets/generated/LOG.md`. Figma MCP is read-only during the hackathon.
