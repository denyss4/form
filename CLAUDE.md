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

## Colour (`packages/tokens`): dark "Lichen"

Dark "Lichen" is the app theme (`docs/prompts/REDESIGN-PROMPT.md` §1, approved 1 Oct 2026; D0a). Under the redesign prompt, colour is tokens-first again: use tokens, measure contrast, and get approval for a new colour. The old light palette stays for the gallery only, unmaintained.

| Role | Token | Hex | Contrast (WCAG 2.2) |
|---|---|---|---|
| Canvas (Surface 100) | `bg.canvas` | `#121212` | — |
| Raised (Surface 200) | `bg.raised` | `#1E1E1E` | 1.12:1 vs canvas: separate with space plus a hairline |
| Sunken | `bg.sunken` | `#181818` | inputs, pressed rows |
| Text High | `text.primary` | `#F5F5F7` | 17.21:1; 6.43:1 on glass at worst |
| Text Muted | `text.secondary` | `#8E9298` | 5.99:1; **never on glass** (2.24:1 worst) |
| Control stroke | `stroke.control` | `#808080` | 4.74:1: input borders, outlined pills, the dial track |
| Hairline | `stroke.hairline` | `#2C2C2C` | decorative only |
| Sage (Brand Accent) | `action.primary`, `focus.ring`, `state.selected`, `status.success` | `#b3be8b` | 9.51:1; pressed `#9ba47a`; text on it is canvas |
| Status Over | `status.attention` | `#C87A65` | 5.73:1 (5.10:1 on raised): errors, destructive text; always with an icon and words |
| Data Muted | `chart.neutral` | `#94A8B6` | 7.61:1: non-plan charts only, never next to Iris |
| Train hard (Marigold) | `plan.hard` | `#faab3f` | 9.78:1 (accepted 2 Oct) |
| Train light (Butter) | `plan.light` | `#eada78` | 13.20:1 (accepted 2 Oct) |
| Recover (Sea glass) | `plan.recover` | `#75d1c5` | 10.42:1 |
| Deep-work day (Iris) | `plan.deepwork` | `#b0a6ed` | 8.50:1 |

- Sage appears at most once per screen as an action; never a plan colour, never decoration (the one exception: Welcome's first-light glow). Primary button: sage fill, canvas text; secondary: control-stroke outline, Text High; destructive: text-only with confirmation.
- Never colour alone: every plan has a glyph and a label (accessibility; under tritanopia Iris sits close to sage and Data Muted).
- Glass (`expo-blur`) only on floating layers (tab bar, sheets, morph modal), canvas tint ≥ 0.70, Text High only. Reduce Transparency and Android: solid raised.
- One ambient glow per screen at most: Today's plan glow behind the dial (`opacity.glow` 0.16), and Welcome's sage "first light" from the horizon (`opacity.firstLight` 0.14; REDESIGN-PROMPT §1, approved 2 Oct). No other glow, no neon, no gradient text.

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
- Radius: 12 controls and inputs, 16 the content surface, 24 sheets (top corners), full for toggles and pills. Two elevation levels; only bottom sheets get `shadow.sheet`. Cards get no shadow.

Before each screen write a 3-line layout plan: the job, the one focal element, what stays quiet.

The banned-patterns list was removed on 1 Oct 2026 (user decision, see `DECISIONS.md`). No visual pattern is banned by rule.

## Motion

Motion restrictions were removed on 1 Oct 2026 (user decision, see `DECISIONS.md`). The tokens below are defaults, not limits.

| Token | Duration | Use |
|---|---|---|
| press | 100 ms ease-out | Press feedback (scale 0.97 + opacity) |
| quick | 180 ms ease-out cubic | Toggles, selection |
| standard | 280 ms spring (damping ~20) | Sheets, transitions, reflow |
| reveal | 600 ms ease-in-out | The morning score reveal, once per day |

- Animate with Reanimated. Reduced motion → instant or a cross-fade under 150 ms, including the reveal.
- Haptics: selection on log options; `notification.success` on log complete; `impact.light` on accepting a move; `impact.soft` at reveal settle; `notification.warning` on errors.
- Loading: under 300 ms nothing; 300 ms–1 s skeleton in the final shape; over 1 s progress plus a plain line. Errors say what happened and what to do.
- Every interactive element has default, pressed, focused, disabled, and loading where relevant.

## Health language, consent and gamification

Reinstated on 1 Oct 2026 (user decision, see `DECISIONS.md`): these are EU MDR, GDPR and data-integrity constraints, not style rules.

- Allowed: readiness, energy, planning, the plan, "vs. your usual". Forbidden: diagnose, treat, prevent, injury risk, clinical "recovery status", "your body needs", disease or symptom names.
- Food and weight: neutral. No good, bad, cheat, guilt or deficit language; no weight goals.
- Consent (GDPR Art. 9): a separate consent per purpose (scoring, personal model, calendar, Health data); Accept and Decline equal weight; nothing preselected; withdrawal as easy as consent. Terms and privacy (the Legal sheet) never stand in for health-data consent.
- Gamify the process only. No reward tied to score, self-rating or intensity. A followed Recover day counts like a followed training day. No daily streaks, points, XP, leaderboards.

## Scope

Updated on 1 Oct 2026 for the "Lichen" redesign (`docs/prompts/REDESIGN-PROMPT.md`).

In: onboarding and consent; Welcome, carousel, stepper, notifications pre-prompt; mocked calendar import and Week view; move suggestion; 3-tap log; Today; Plan Fit meter; Felt vs Measured (fixtures); mocked Health-sync and calendar-write screens; Profile and the user page; **mocked auth** (in memory, no backend, no persisted passwords); `/gallery`.
Out: real authentication and accounts, sync, social sign-in (including Sign in with Apple), Goal mode, what-if simulator, Precise food logging, partner sync, coach or B2B dashboards, real HealthKit / Health Connect, calendar write, retraining, streaks, points, leaderboards. If asked, reply `SCOPE FLAG: <item>`, stop, add it to `LATER.md`.

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
