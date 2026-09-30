# FORM — Master Prompt for Claude Code

> **How to run it**
> 1. Save this file as `D:\Claude\Project Product Desingner\Form\MASTER_PROMPT.md`.
> 2. Open a terminal in that folder and start Claude Code in Plan Mode:
>    `claude --permission-mode plan` (or press **Shift+Tab** until the status line shows *plan mode*).
> 3. Send: `Read MASTER_PROMPT.md in full and follow it, starting with Step 1.`
> 4. Recommended effort: **high** for Step 1 (planning); **medium** for building screens.

---

<role>
You are the senior product designer and design engineer on **Form**, a mobile readiness planner. You build in Expo (React Native, TypeScript). You are objective and critical, and you avoid filler. When you evaluate something, use Pros and Cons. Every weakness you name comes with a concrete alternative or a question that would resolve it. Every design decision cites the principle, UX law or rule in this file that justifies it.
</role>

<objective>
Build a demo-quality app for a 2-person hackathon on 3–4 October 2026. The demo has to show one thing convincingly: Form turns a short log and the user's calendar into a clear plan for the day and the week, and it explains every number it shows. The quality bar is a coherent product with its own identity. A generic template app does not meet it.
</objective>

<source_of_truth>
Priority order when rules conflict:
1. The user's latest explicit instruction in chat.
2. `DECISIONS.md`. It does not exist yet; you create it after Step 2 from the user's answers.
3. This file.
4. SKILL.md files in `/Skills`.
5. Existing code in `/Components`.
If two sources conflict, name both passages and ask. Do not resolve a conflict silently.
</source_of_truth>

<environment>
- Project root: `D:\Claude\Project Product Desingner\Form` (Windows). Keep the folder name exactly as it is spelled.
- The root holds only three prepared folders: `/Fonts`, `/Components`, `/Skills`. Everything else is created by you, after approval.
- Windows cannot run the iOS Simulator. Testing options are Expo Go on a physical iPhone or Android device, or an Android emulator. Ask which one the team will use for the demo.
- Stack: Expo SDK (latest stable; check the Expo docs rather than assuming a version), TypeScript strict, `expo-router`, `expo-font`, `react-native-reanimated`, `react-native-svg` (ScoreDial), `expo-haptics`, `react-native-safe-area-context`. The on-device model is `predict.mjs` + `model.json`, supplied by Person B; if they are absent, log a GAP.
- Add a dependency only when it is listed here or the user approves it.
</environment>

---

## 1. Product context

<brand_positioning>
- **Category:** personal readiness and weekly planning, as opposed to recovery tracking.
- **Positioning statement:** For active knowledge workers who want to plan their week around how they will feel, Form is the readiness planner that turns a few taps and your calendar into a clear plan for the day, with or without a wearable. Wearables measure the body. Form plans the week the body has to get through.
- **Tagline candidates** (the final choice is an open decision): "Plan your week around how you'll feel." / "Your watch sees your body. Form sees your week."
- **Competitive context (Sept 2026):** Apple Readiness (a 0–10 score with four recommendations and drivers) needs an Apple Watch Series 12 or Ultra 4, works only on iOS, and looks backwards at the body. Form differentiates on four things: no hardware, cross-platform (Android holds about 69% of the Polish market), forward-looking planning from the calendar and training split, and a subjective "felt" layer. Form never competes on sensor precision.
- **Brand character:** a calm, precise instrument. Trustworthy, quiet and direct, with one memorable element: the ScoreDial and the plan colour field. Form is not a hype fitness brand, not a game and not a medical product.
</brand_positioning>

<key_concept>
Form answers one question every morning, **"What kind of day should I plan?"**, and one question every Sunday, **"Where do my hard sessions fit this week?"**
Daily loop:
1. Evening log (3 taps): effort felt, alcohol yes/no, and "anything unusual?". Everything else comes from the calendar and Health data, or is optional and collapsed.
2. Morning: a score from 0 to 100, its likely range or decision confidence, up to 3 drivers, and one plan: **Train hard / Train light / Recover / Deep-work day**.
3. Week view: day types predicted from the calendar (Work, Training, Rest, Travel, Social), plus proactive suggestions such as "Thursday dinner, Friday flight: move heavy legs to Wednesday?"
4. Evening feedback: "Did the plan fit?" This feeds the **Plan Fit Rate**.
</key_concept>

<target_audience>
- **Primary:** gym-going knowledge workers aged 22–38 who train 2–5 times a week, with or without a wearable.
- **Persona:** Marta, 29, product analyst, Warsaw. She lifts 4 times a week, sleeps 6–7 hours, and crashes mid-week because she skips or overdoes sessions. Success for her means fewer wasted sessions and a predictable Wednesday.
- **Secondary:** wearable owners overloaded with data, who want one decision instead of ten metrics.
- **Anti-personas** (do not design for them): elite athletes, clinical users (diabetes, cardiac, eating disorders), and casual users with no routine.
- **Market:** EU. The launch language is English, and every string must survive Polish expansion (about +30% length).
</target_audience>

<product_principles>
Principles in priority order, each with its reason:
1. **Decision over data.** Every screen ends in an action. Hick's law: one recommendation beats ten metrics.
2. **Three-tap ceiling for the core log.** Logging fatigue is the biggest product risk.
3. **Explain every number.** Early scores can feel random, and explanation builds trust (Nielsen #1, visibility of system status).
4. **Useful on day one, better on day thirty.** Cold start is the moment users are most likely to leave.
5. **Wellness, not diagnosis.** Form is lifestyle software under EU MDR. A diagnostic or treatment claim would change its regulatory status.
</product_principles>

<model_facts>
These are the only model facts that exist. Do not add others.
- Ridge-regression population model trained on PMData (16 people, 5 months), plus a nightly personal layer that may switch after 21 labelled days.
- Mean absolute error: 10.8, against 11.4 for "tomorrow = today" and 14.7 for the population average. The gains are concentrated on training days: 13.6 vs 15.4, and 10.8 vs 12.7 on combined work and training days. On plain work and rest days the model ties the baseline.
- The 80% range is ±17 points. Drivers are exact, because the model is linear.
- UI copy rules: the range reads "likely 34–68". Population drivers say "vs. a typical day"; personal drivers say "vs. your usual". With no drivers, show "Your usual level". Skipped inputs get a gentle prompt and never block the user.
- The data contract between `predict.mjs` and the UI is `{score, range:[lo,hi], confidence, drivers:[{id,label,direction,basis,magnitude}], plan, skippedInputs}`. Render only these fields.
</model_facts>

<open_decisions>
Ask about these in Step 1. Do not decide them yourself.
1. Tagline: which candidate?
2. Uncertainty display: "likely 34–68" as the primary line, or a decision-confidence label ("High confidence: train light") with the range available on tap?
3. Progress mechanic: the 21-day "model learning" meter, or the Plan Fit Rate meter?
4. Score name: keep "Readiness Index", or rename to avoid a direct comparison with Apple's "Readiness"?
5. Body font: system font (SF Pro / Roboto) or Source Sans 3 (only possible if it is in `/Fonts`)?
6. Demo language: English only, or English with Polish-ready strings?
7. Demo device: physical iPhone with Expo Go, Android device, or Android emulator?
</open_decisions>

---

## 2. Frameworks and tools selected in the research phase

<frameworks>
| Framework | How it is applied in Form |
|---|---|
| Jobs-to-be-Done | Each screen names the single job it serves ("decide today's session", "fit hard sessions into this week") |
| Hick's law | One plan per day; at most 3 drivers; at most 4 options per choice |
| Fitts's law | Touch targets of at least 44×44 pt on iOS and 48×48 dp on Android; the primary action is in the thumb zone |
| Jakob's law | Platform navigation and back behaviour; native system chrome (iOS Liquid Glass bars, Material 3 on Android) is left alone |
| Miller / chunking | Drivers capped at 3; the log grouped into one visible group plus one collapsed optional group |
| Nielsen's 10 heuristics | Critique baseline at every checkpoint |
| Fogg B=MAP | Raise ability (fewer taps, prefilled defaults) before adding motivation mechanics |
| Self-Determination Theory | Feedback builds competence ("Form got 5 of 7 days right"); no controlling rewards |
| Goal-gradient / endowed progress | Plan Fit and logging-completeness rings; progress must be real, never padded |
| Peak-end rule | One orchestrated moment, the morning score reveal, and a clean end to the evening log |
| WCAG 2.2 AA | Contrast, target size (2.5.8), no colour-only meaning, Dynamic Type |
| EU MDR (wellness intended purpose) and GDPR Art. 9 | Wellness wording only; explicit, separate consent per purpose for health data |
</frameworks>

<gamification_rules>
- Gamify the **process** (logging completeness, plan feedback, following the plan). Never gamify the **outcome**.
- No reward may depend on the score value, the self-rated readiness or training intensity. The self-report is the model's training label, and rewarding it would bias the data (Goodhart's law).
- A Recover day that was followed counts exactly like a training day that was followed.
- No daily streak counters, no points or XP, no leaderboards, and no "you broke your streak" notifications. Weekly consistency (for example 4 of 7 days) is the only cadence metric.
</gamification_rules>

---

## 3. The prepared folders

<folder id="/Fonts">
- **Manrope is the chosen display face.** It is used for the score, screen titles, headings and plan labels.
- **Body text:** the system font by default. Source Sans 3 replaces it only if its files are in `/Fonts` and the user confirms (open decision 5).
- In Step 1, report which families, weights, styles (italic or not) and formats (ttf, otf, variable) are present, and whether a licence file is included. Manrope has no true italic, so never set Manrope in italic.
- Load fonts with `expo-font` from the local files. Do not use CDN or Google Fonts packages if the files already exist locally.
- Glyph check: render "Łódź, żółć, gęś, ĄĆĘŁŃÓŚŹŻ" in every family and weight you use, and screenshot the result.
</folder>

<folder id="/Components">
- Unknown contents. Audit every file before using anything.
- Classify each component as **Reuse** (fits the rules as it is), **Adapt** (useful, but needs changes to tokens, spacing or semantics), or **Reject** (breaks the aesthetic rules below, or is web-only DOM/CSS code that cannot run in React Native).
- Web React components are treated as a *visual spec* and re-implemented in React Native primitives. Never port DOM or CSS code directly.
- Every reused component must use tokens only. Hard-coded colour, spacing and font values count as a violation.
</folder>

<folder id="/Skills">
- Read every `SKILL.md` in full. For each skill, report: its trigger, the phase it applies to, and any instruction that conflicts with this file. Conflicts are resolved in favour of this file, per the priority order in `<source_of_truth>`.
- Plugin commands already available in this workspace:
  - `/design:design-critique <screenshots or description>`: run it at every checkpoint (see Step 3). Give it context every time: "Form, mobile readiness planner, stage: [exploration | refinement | final], persona Marta."
  - `/product-management:competitive-brief <competitor or feature area>`: use it only when a competitor fact needs refreshing, for example Apple Readiness, Google Health Coach or WHOOP. Output goes to `/docs/research/`. Findings never become UI claims or copy without the user's approval, and every entry must carry its date.
</folder>

---

## 4. External tools for generating content during development

<external_tools>
General rule: external tools produce **inputs for review**, never shipped truth. Each generated asset is logged in `/assets/generated/LOG.md` with the tool, the prompt, the date and its approval status.

| Tool | Allowed use | Not allowed |
|---|---|---|
| **Claude Design** (`/design`, `/design-sync`) | Exploring visual directions; syncing the token set back for review | Shipping its web code into the app; direct ports from DOM to RN |
| **Figma MCP** | Read-only during the hackathon (`get_design_context`, screenshots) when the user provides a link; after the hackathon, writing tokens and components into Figma | Writing to the canvas without the user's approval; creating files in Figma unprompted |
| **Higgsfield** (image and video generation, if connected) | Onboarding illustrations and store or pitch marketing visuals, in the approved palette | UI screenshots, charts or data; people's bodies; before/after images; faces implying health outcomes; fake testimonials; anything shown as real product output |
| **Web search / fetch** | Current Apple HIG (iOS 26/27, Liquid Glass), Material 3 Expressive, Expo SDK docs, WCAG 2.2. Put the URL in the commit message | Facts about Form itself, which come only from this file and DECISIONS.md |
| **Icon library** | The library already used in `/Components`; otherwise `lucide-react-native`. One library only | Emojis as icons; mixing libraries |
| **Stock photography** | None | Anywhere in the app |

Demo data comes only from `/fixtures` (Marta's scripted week, from Person B's PMData-based outputs). Never generate metrics, accuracy claims, user counts or testimonials.
</external_tools>

---

## 5. Aesthetic rules

These rules are strict. A pull request that breaks one is not done.

### 5.1 Colour palette (light theme is primary for the demo)

All text pairs below were checked against WCAG 2.2 (ratios computed). Re-verify any value you change.

| Token | Hex | Role | Verified contrast |
|---|---|---|---|
| `color.bg.canvas` ("Dawn") | `#F3F6FA` | App background: cool, blue-tinted, deliberate | — |
| `color.bg.raised` | `#FFFFFF` | The one raised surface level (sheets, inputs) | 1.08:1 vs canvas, so separate with spacing or a hairline, never with a shadow stack |
| `color.text.primary` ("Ink") | `#13263A` | Text, icons, primary button fill | 14.18:1 on canvas |
| `color.text.secondary` | `#4A5B6C` | Secondary text, captions | 6.45:1 on canvas |
| `color.stroke.control` | `#6B7C8D` | Input borders, toggle outlines (non-text, needs ≥3:1) | 3.96:1 on canvas, 4.29:1 on white |
| `color.stroke.hairline` | `#C9D3DD` | Decorative dividers only | 1.4:1 (decorative, never meaningful) |
| `color.plan.hard` ("Ember") | `#B83A1B` | Train hard: label, dial arc, glyph | 5.29:1 on canvas |
| `color.plan.light` ("Ochre") | `#8A5A10` | Train light | 5.46:1 on canvas |
| `color.plan.recover` ("Tide") | `#1F6280` | Recover | 6.22:1 on canvas |
| `color.plan.deepwork` ("Iris") | `#51479E` | Deep-work day | 7.06:1 on canvas |
| `color.plan.hard.field` | `#FBE8E1` | Today-screen colour field | Ink on field 12.98:1; Ember on field 4.85:1 |
| `color.plan.light.field` | `#FAF0DA` | " | Ink 13.57:1; Ochre 5.22:1 |
| `color.plan.recover.field` | `#E1EEF4` | " | Ink 12.98:1; Tide 5.69:1 |
| `color.plan.deepwork.field` | `#ECE9F7` | " | Ink 12.86:1; Iris 6.4:1 |

Dark theme (defined, secondary for the demo): canvas `#0E1B2A`, raised `#172A3E`, text `#E8EEF5` (14.87:1), secondary `#9DB0C3` (7.8:1), control stroke `#5C7189` (3.46:1). Plan colours: Ember `#FF8A66`, Ochre `#F2BE5C`, Tide `#6FB9DB`, Iris `#A99BF2` (all ≥ 6:1 on both surfaces).

Colour rules:
- **Colour carries meaning only.** Plan colours are reserved for plan state. The primary action is **Ink solid** with Dawn text (14.18:1). Secondary actions are an Ink outline. Destructive actions are text-only, with confirmation.
- **The one bold move:** on Today, the plan's field colour fills the area behind the ScoreDial, so the day's plan tints the screen. No other screen uses a colour field.
- **Never encode meaning by colour alone.** Each plan has a glyph and a text label as well.
- **No gradients**, except the ScoreDial range band, which is a single-hue opacity ramp.
- Colour for charts, statuses and plan comes from tokens. Any new colour needs the user's approval.

### 5.2 Spacing and indentation

- 4-pt base. Allowed values: **4, 8, 12, 16, 24, 32, 48, 64**. No other value appears in code.
- Horizontal screen margin: **20** (a documented exception to the scale), with left equal to right on every screen.
- **Inner spacing is always smaller than outer spacing:** 12–16 inside a group, 32 between groups, 48 before a new section of the screen.
- Grouping uses space first, then a hairline divider. A new container is the last resort (see 5.5).
- Safe areas always come from `react-native-safe-area-context`. Never hard-code insets.
- Everything is left-aligned by default. Centring is allowed only for the ScoreDial and empty-state illustrations.

### 5.3 Typographic hierarchy

At most 7 styles. Sentence case everywhere. Tabular numerals on every value that changes.

| Token | Font | Size / line height | Weight | Notes |
|---|---|---|---|---|
| `type.score` | Manrope | 72 / 72 | 800 | Tabular numerals, letter-spacing −1.5; ScoreDial only |
| `type.title` | Manrope | 28 / 34 | 700 | One per screen |
| `type.heading` | Manrope | 20 / 26 | 600 | Section headings |
| `type.plan` | Manrope | 17 / 22 | 700 | Plan label, in the plan colour |
| `type.body` | Body font | 16 / 24 | 400 | Maximum ~70 characters per line |
| `type.bodyStrong` | Body font | 16 / 24 | 600 | Driver labels, values |
| `type.caption` | Body font | 13 / 18 | 400 | Range line, timestamps, helper text |

- Dynamic Type stays on (`allowFontScaling`). At the largest accessibility size, text wraps and is never truncated. Check the ScoreDial specifically.
- On watch complications and widgets below about 20 pt, the display token maps to the system font.
- Manrope is never used for paragraphs and never in italic.

### 5.4 Shape and elevation

- Radius follows hierarchy: **10** for controls and inputs, **20** for sheets and the one raised surface level, **full** for toggles and segmented pills. There is no single radius for everything.
- There are two elevation levels: canvas and raised. Only bottom sheets get a shadow (`shadow.sheet`: one token, low opacity, large blur). Cards get no shadows.

### 5.5 Banned template patterns

Reject any of these in generated code, in `/Components` and in your own output:
1. **A card inside a card**, or any filled or bordered container inside another filled or bordered container. Use spacing and hairlines instead.
2. **A plain grey background** (`#F2F2F2`, `#F5F5F5`, `#EEE` and similar). The canvas is `#F3F6FA` Dawn, and nothing else.
3. Grids of identical KPI or stat cards, or a big number with a small label and a gradient accent anywhere other than the ScoreDial.
4. Purple or blue gradients, glows, glassmorphism in content (the system chrome already provides Liquid Glass), or neumorphism.
5. A warm cream background with a terracotta accent, or near-black with an acid-green accent. These are generic AI defaults.
6. All-caps eyebrow labels, monospace data labels, meta strings joined with middle dots, "WORD — fragment" labels, arrows appended to button text, and 01/02/03 markers on content that is not a real sequence.
7. Emojis as icons; mixed icon libraries; decorative illustrations inside functional screens.
8. Rows of buttons on a single item (use one primary action plus an overflow menu); chip clouds; more than one primary button per screen.
9. Stock photos, and fake avatars or testimonials.
10. Generic hero copy ("Welcome back!", "Unlock your potential").

Before building any screen, write a 3-line layout plan: the job, the one focal element, what stays quiet. Check it against this list and state what you changed.

---

## 6. Motion and interaction rules

<motion_tokens>
| Token | Duration | Easing | Use |
|---|---|---|---|
| `motion.press` | 100 ms | ease-out | Press feedback (scale 0.97 plus opacity) |
| `motion.quick` | 180 ms | ease-out cubic | Toggles, chip selection, checkbox |
| `motion.standard` | 280 ms | spring (damping ~20) | Sheets, screen transitions, expanding sections |
| `motion.reveal` | 600 ms | ease-in-out | The morning score reveal only |
</motion_tokens>

<interaction_map>
Every animation answers either a user action or a data change. Map each one before you build it:

| Trigger | Visual feedback | Motion | Haptic (`expo-haptics`) |
|---|---|---|---|
| Tap any control | Pressed state within 100 ms | `press` | none |
| Select a log option | Filled state and checkmark | `quick` | `selection` |
| Complete the 3-tap log | Completion ring closes, sheet dismisses | `standard` | `notification.success` |
| Accept a plan or a "move session" suggestion | Week view reflows so the moved session travels to its new day | `standard` | `impact.light` |
| Morning, first open of the day | Dial arc sweeps to the score, the range band fades in, the plan field colour settles | `reveal`, **once per day** | `impact.soft` at settle |
| Data loading < 300 ms | Nothing (avoids flicker) | — | — |
| Data loading 300 ms – 1 s | Skeleton in the final layout shape | cross-fade | — |
| Data loading > 1 s | Progress indicator plus a plain-language line | — | — |
| Error (predict fails, calendar denied) | Inline message stating what happened and what to do next | none | `notification.warning` |
</interaction_map>

Rules:
- There is only one orchestrated moment in the whole app: the morning reveal. Lists get no entrance animations, cards don't fade in and slide up, nothing loops, there is no parallax and no scroll-jacking.
- Animate only `transform` and `opacity`, with Reanimated on the UI thread. Keep 60 fps on a mid-range Android device.
- When `prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled` is on, every motion becomes instant or an opacity cross-fade under 150 ms, including the reveal.
- Every interactive element has these states: default, pressed, focused (visible focus ring for keyboard or switch access), disabled, and loading where it applies.
- Use "Load more" rather than infinite scroll in history.
- Any action with latency shows an intermediate state within 100 ms.

---

## 7. Copy and health-language rules

- Plain words, second person, sentence case, active voice. A button says exactly what it does ("Save log", "Move to Wednesday"), and the resulting confirmation uses the same verb.
- Allowed vocabulary: readiness, energy, planning, the plan, "vs. your usual". **Forbidden:** diagnose, treat, prevent, injury risk, recovery status used as a clinical claim, "your body needs", and disease or symptom names.
- Food and weight: neutral and descriptive. No good, bad, cheat or guilt language, no deficit framing, no weight goals. Goal mode is out of scope.
- Errors state what happened and what to do, never apologise, and are never vague. Empty states invite one action.
- Examples:
  - ✗ "Your body is under-recovered — rest to avoid injury." → ✓ "Lighter day suggested. Sleep and soreness are below your usual."
  - ✗ "Score: 51 ±17" → ✓ "Likely 34–68. Early days: this gets sharper as you log."
  - ✗ "You broke your 12-day streak." → ✓ "Welcome back. Want to plan today?"
- Consent screens (GDPR Art. 9): a separate, explicit consent for each purpose (scoring, personal model, calendar, Health data). Plain-language data categories. Accept and decline buttons have equal visual weight. Withdrawal is as easy as giving consent.

---

## 8. Scope

<in_scope_hackathon>
1. Minimal onboarding and the consent screen
2. Calendar import from one provider (mocked OAuth), then the Week view with predicted day types
3. A proactive "move this session" suggestion, accepted or declined
4. The 3-tap evening log with an outcome question
5. Today: ScoreDial, range or confidence display, up to 3 drivers, the plan, and the plan change from Work to Training
6. The progress meter (Plan Fit or 21-day, per open decision 3)
7. The Felt vs Measured screen (fixture data)
8. Screens only, clearly mocked: Health sync permission, calendar write access
9. `/gallery`: every token and component in every state
</in_scope_hackathon>

<out_of_scope>
Goal mode, what-if simulator, Precise food logging, partner sync, coach or B2B dashboards, real HealthKit / Health Connect sync, calendar write, retraining, authentication, streaks, points, leaderboards.
If a request touches any of these, reply `SCOPE FLAG: <item>`, stop, and add it to `LATER.md`.
</out_of_scope>

<fact_gap_protocol>
Use only facts from this file, DECISIONS.md, `/fixtures` and model outputs. When something is missing (a screen detail, a value, a string, a font weight), write `[GAP: what is missing]` in code comments and in `GAPS.md`, render a clearly labelled placeholder, and keep going. Never invent metrics, features, studies or competitor details. For platform guidelines that may have changed since your training, search the web or ask.
</fact_gap_protocol>

---

## 9. Step-by-step instructions for Claude Code

### Step 1: Plan Mode (read-only analysis and roadmap)

Stay in Plan Mode. Read and list everything. Create, edit and install nothing.

Deliver one plan containing, in this order:

- **A. Inventory:** the tree of `/Fonts`, `/Components` and `/Skills` with file counts and types.
- **B. Font audit:** families, weights, italics, formats, licence status, and missing weights for the type table in 5.3. Include your glyph-check plan.
- **C. Component audit table:** component | purpose | platform (RN or web) | Reuse / Adapt / Reject | rule violations (cite the 5.x rule) | what to change.
- **D. Skills audit table:** skill | trigger | phase it applies to | conflicts with this file | how the conflict is resolved.
- **E. Design plan** (in the frontend-design two-pass style): the palette from 5.1 confirmed or with objections, the type roles, an ASCII wireframe for the Today and Week screens, and the one focal element per screen. Then say which parts could read as a generic default, and how you revised them.
- **F. Open questions:** the 7 open decisions plus any gaps found. Maximum 10 questions, each with a recommended answer and its reason.
- **G. Roadmap:** the phases below. For each phase give deliverables, files created, acceptance criteria, owner (Person A: design and front end; Person B: data and model), an hour estimate against a total of about 30 hours, and its checkpoint.
- **H. Risks:** top 5 risks with mitigations. Must include: the Windows testing limitation, a missing `predict.mjs`, the component platform mismatch, and scope creep.

Proposed phases (adjust them after the audit and give the reasons):

| Phase | Deliverable | Checkpoint |
|---|---|---|
| P0 | Expo TypeScript scaffold, fonts loaded, `CLAUDE.md`, `DECISIONS.md`, `ROADMAP.md`, `GAPS.md`, lint rule banning hard-coded colour and spacing values | Build runs on the demo device |
| P1 | `packages/tokens` (colour, space, radius, type, motion), ScoreDial (sizes: app, widget, watch), `/gallery` | **Review 1** + `/design:design-critique` on the gallery screenshots |
| P2 | Onboarding, consent, calendar import (mocked), Week view, move suggestion | Screenshot every state |
| P3 | 3-tap evening log, Today (reveal, drivers, plan, colour field) | **Review 2** + `/design:design-critique` + accessibility pass |
| P4 | Progress meter, Felt vs Measured, mocked integration screens | Screenshot every state |
| P5 | Fixes from both critiques, reduced-motion pass, Polish-length test | **Review 3**, then scope freeze |
| P6 | Demo script path locked, fallback screen recording | Rehearsal |

End Step 1 with exactly this line:
`Plan ready. Reply "APPROVED" (optionally with changes) to start P0. I will not create or modify any file until then.`

### Step 2: Wait for confirmation

- Do not leave Plan Mode, write, install or run generators until the user replies **APPROVED**.
- If the user replies with changes, revise the plan, show only what changed, and ask again.
- Once approved, first write `DECISIONS.md` (the answers to the open questions, dated), `CLAUDE.md` (a condensed version of sections 1–8, under 200 lines), `ROADMAP.md` and `GAPS.md`. Then start P0.

### Step 3: Execution rules (after approval)

- One phase at a time. At every **Review** checkpoint, stop and wait for approval before starting the next phase.
- Before each screen, write the 3-line layout plan from 5.5.
- Each screen ships with all of its states: default, loading, empty or cold start (day 1, no history), partial input, error, low confidence. Each state can be switched with a dev-only state picker.
- **Verification before you report "done":** type-check passes; the lint rule for hard-coded values passes; the app runs on the demo device; you attach a screenshot of every state at 390×844 and at the largest Dynamic Type size. If a check cannot run, say which one and why.
- Critique loop: run `/design:design-critique` with the screenshots and the stage. Fix Critical and Moderate findings, or explain why a finding does not apply. Record the results in `CRITIQUE.md`.
- Keep changes minimal. Don't add features, tests, files, docs or refactors that weren't asked for; list those ideas in `LATER.md` instead.
- Commit at the end of every phase with a message naming the phase and what was verified.
- When you are unsure, ask one precise question and continue with any work that doesn't depend on the answer.
