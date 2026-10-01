# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

- **Primary user: Marta**, 29, product analyst in Warsaw, lifts four times a week. Each morning she asks "What kind of day should I plan?"; on Sunday, "Where do my hard sessions fit this week?" Not for elite athletes, clinical users or people with no routine.
- **Evaluators: hackathon judges** (3–4 Oct 2026), who see the product through a demo of about three minutes on one phone. The demo must show that Form turns a short log and the calendar into a plan for the day and week, and explains every number.

## Product Purpose

Form is a readiness planner. It turns a three-tap evening log and the person's calendar into one plan per day (Train hard, Train light, Recover, Deep-work day) and a week where hard sessions land on the right days. Success: the person acts on the plan, and the plan fits, measured by their own evening answer to "Did the plan fit?" (Plan Fit Rate).

Tagline: "Plan your week around how you'll feel."

## Positioning

A decision, not a dashboard. Form gives one plan with its reasons, a likely range instead of a falsely precise number, and a move suggestion across the calendar week. It works from a short self-log and the calendar, without a wearable.

## Operating Context

- The loop: evening log (effort felt, alcohol, anything unusual) → morning Form score 0–100 with a likely range, up to three drivers and one plan → a 0–10 morning check-in → Week view with day types from the calendar and a move suggestion → evening "Did the plan fit?".
- Used in two short moments a day: a glance in the morning, three taps at night. Sunday planning on the Week view.
- Demo context: Expo Go on an iPhone over the local network; a scripted week (Monday 5 Oct 2026 as the demo clock); a locked demo path in `docs/demo/DEMO.md`.

## Capabilities and Constraints

- Expo SDK 57, React Native, TypeScript strict. iOS demo device; no Android SDK on the build machine, so Android is designed for but not yet run.
- Model: ridge regression trained on PMData (16 people). Mean error 10.8, vs 11.4 for "tomorrow = today" and 14.7 for the average; gains are on training days. Range ±17.2, not a calibrated interval. Drivers are exact. No other model claims may be made; sleep is never claimed as a top driver.
- Calendar import, Health sync and calendar write are mocked. No authentication, no real HealthKit or Health Connect.
- Health data handling: Form is wellness and planning, not diagnosis; it makes no diagnostic, treatment or prevention claims. Health and calendar data need a separate, withdrawable consent per purpose (scoring, personal model, calendar, Health data), as GDPR Art. 9 requires in the EU.
- Terminology: "Form score", "the plan", "likely range", "vs. a typical day" (population) and "vs. your usual" (personal).
- Undecided: the score threshold that keeps a hard session hard (60, a proposal, GAPS G2); real platform sync.

## Brand Commitments

- Name "Form", score name "Form score", the tagline above.
- Voice: plain words, second person, sentence case, active voice; buttons say what they do.
- Fonts are fixed by the user: Manrope (display) and Source Sans 3 (body).

## Evidence on Hand

- Scripted persona data: `fixtures/marta-week.json`, `fixtures/marta-calendar.json`.
- Real model outputs from `packages/model` (`predict.mjs`); verification in `npm run verify:model`.
- Demo runbook and locked path: `docs/demo/DEMO.md`; PMData credit slide: `docs/demo/pmdata-credit-slide.html`.
- Absent, never to be fabricated: real users or user counts, testimonials, accuracy beyond the model facts above, press, pricing.

## Product Principles

1. Decision over data: one plan, with its reasons.
2. Three-tap ceiling for the daily log.
3. Explain every number: a range, the inputs used, and the drivers.
4. Useful on day one, before any personal history exists.
5. Plan Fit measures the process: a followed Recover day counts like a followed training day.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, 48 pt touch targets, no colour-only meaning (every plan has a glyph and a label), Dynamic Type with wrapping and no truncation, Reduce Motion fallbacks, VoiceOver labels.
