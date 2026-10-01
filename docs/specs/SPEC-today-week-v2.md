# Spec: Today and Week v2 (hackathon revision)

**Status:** Draft for approval · **Date:** 1 Oct 2026 · **Owner:** Fernando · **Builds on:** P0–P4, `MASTER_PROMPT.md`, `DECISIONS.md`
**Deadline:** demo on 3–4 Oct 2026. Every requirement below is ranked against that date.

---

## 1. Problem statement

The current Today and Week screens contain four structural problems, found on the iPhone build on 1 Oct:

1. **The morning rating is collected after the score is shown.** The rating is the model's training label, so it is anchored by the number the user has just seen. It also cannot change today's plan, so it has no job on the Today screen.
2. **The circular gauge is the same object every competitor ships** (Apple Readiness, Oura, WHOOP). Form's distinctive claim is the decision and its confidence, and a gauge does not show which plan the uncertainty range falls into.
3. **Week, the only screen no competitor has, is a list of text rows.** The rhythm of the week (hard, light, recover) is not visible at a glance, and the move suggestion is a block of text.
4. **"Accept plan" adds a tap that changes nothing.** Calendar write is out of scope, so accepting has no effect. It also creates an undo problem and puts a morning button ("Log tonight") on screen that cannot be used until evening.

**Cost of not fixing:** the demo would show Form as a gauge app with a list, which is the exact category Apple now owns. It would also collect a biased label, which damages the model the pitch depends on.

## 2. Goals

| # | Goal | Type | How we know |
|---|---|---|---|
| G1 | The morning label is collected before the score is seen | Data integrity | 100% of stored ratings carry `beforeReveal: true`, or are absent for that day |
| G2 | The plan is understood within 5 seconds of the reveal | User | ≥ 2 of 3 testers state today's plan correctly in a 5-second test |
| G3 | The week's rhythm and the suggestion are understood without reading rows | User / differentiation | ≥ 2 of 3 testers can say which day is hardest and what the suggestion changes within 10 seconds |
| G4 | The uncertainty display shows which plan the range covers | User / trust | ≥ 2 of 3 testers can say whether the plan could change within the likely range |
| G5 | The demo path gets shorter, not longer | Demo | Measured rehearsal ≤ 3:00 (G44) |

## 3. Non-goals

| Non-goal | Reason |
|---|---|
| Showing "you felt X, Form forecast Y" at the reveal | It turns the reveal into a test the user fails. That comparison stays in Felt vs forecast on Progress |
| Writing accepted plans or moved sessions to the calendar | Calendar write is out of scope (screen only) |
| Drag-and-drop rescheduling in Week | Too costly for 2 days. The single suggested move covers the demo story |
| Rewards, streaks or scores for rating the morning | The rating is the label; rewards would bias it (`gamification_rules`) |
| Redesigning the watch complication | Not in the demo; the component keeps an arc layout for that context only |

## 4. Decisions on the four questions

| Question | Decision | Reasoning | Main trade-off |
|---|---|---|---|
| 1. Morning rating placement | **Move it before the reveal**, one tap, always skippable | A blind rating is a clean label (G1). A small effort before the reveal makes the reveal feel earned (effort justification, peak-end rule) | Adds one step before value. Mitigated by one tap and a visible "Skip" |
| 2. Gauge or number with range bar | **Number with a plan-band range bar** on Today and the widget. Keep the arc layout only for the watch | Position on a common linear scale is read more accurately than angle or arc length (Cleveland & McGill, 1984). The bar can show plan zones, so the range shows whether the plan could change | Needs plan-band thresholds per day type from the plan engine (OQ1). Reworks a finished component |
| 3. Week as hero | **A 7-column plan strip becomes the hero.** Rows become detail for the selected day | Week is the differentiator. Rhythm is pre-attentive when shown as a row of glyphs (similarity, proximity) and invisible when spread across text rows | 7 columns on 390 pt leave about 50 pt each: enough for a glyph and a day letter, not for a plan name |
| 4. "Accept plan" | **Remove it.** Plan Fit gains a fourth answer, "Did something else" | The button changes nothing, so it is ceremony. Plan Fit only produces a valid answer if the user followed the plan, so "Did something else" keeps that data clean | **The North Star Metric names "accepted or adjusted a plan."** It must be redefined (OQ2) |

## 5. User stories

Persona: Marta, 29, product analyst, lifts 4 times a week.

**Morning**
- As Marta, I want to say how I feel before Form shows its forecast, so that my answer is my own.
- As Marta, I want to skip the rating on a rushed morning, so that I still get my plan immediately.
- As Marta, I want to see today's plan first and know whether it could change, so that I can decide in seconds.

**Week**
- As Marta, I want to see the shape of my week at a glance, so that I know where my hard days fall.
- As Marta, I want to see what a suggested move would change before I accept it, so that I am not surprised.
- As Marta, I want estimated days to look different from known days, so that I don't over-trust a guess.

**Evening**
- As Marta, I want to say I did something other than the plan, so that Form doesn't learn from a plan I never tried.

**Edge cases**
- As Marta, if I open Form for the first time in the afternoon, I want to skip a morning question that no longer makes sense.
- As Marta, if my calendar has no events for a day, I want that day marked as estimated, not shown as certain.
- As Marta using VoiceOver, I want each day in the strip read as "Thursday, Train hard", not as an icon.

## 6. Requirements

### P0: required for the demo

**R1. Remove "Accept plan"**
- Today has no primary button in the morning. "Log tonight" becomes the primary button only from 17:00.
- The Plan Fit question offers: **Yes / Too hard / Too easy / Did something else**.
- Remove the accept haptic from the interaction map. Remove "Plan accepted." and any undo logic.

Acceptance criteria:
- Given it is before 17:00, when Marta opens Today, then no primary button is shown.
- Given it is 17:00 or later, when Marta opens Today, then "Log tonight" is the primary button.
- Given Marta answers "Did something else", when Plan Fit is computed, then that day is excluded from the 5 of 7 count and labelled "Not followed" in Progress rows.
- [ ] No string, state or haptic references "accept" on Today.

**R2. Pre-reveal morning rating**
- On the first open of the day, before 12:00, a full-screen step asks **"How do you feel this morning?"**. It shows 11 tap targets (0–10), no default value, and a text button **"Skip to my plan"**.
- A tap stores `{rating, timestamp, beforeReveal: true}` and starts the reveal immediately. There is no confirm button.
- On "Skip", the reveal starts and **the rating is not asked again that day**. A rating given after the score is seen is anchored, so missing data is better than biased data.
- On first opens at 12:00 or later, the step is not shown.
- Remove the below-the-fold slider and the "One tap to sharpen tomorrow" line from Today.

Acceptance criteria:
- Given it is the first open before 12:00, when Today loads, then the rating step appears and no score, plan or plan colour is visible behind it.
- Given Marta taps 7, when the tap registers, then the reveal begins within 100 ms and the stored rating has `beforeReveal: true`.
- Given Marta taps "Skip to my plan", when she later scrolls Today, then no rating control appears that day.
- Given VoiceOver is on, when the step loads, then it announces "How do you feel this morning? Rating from 0 to 10, not rated", and each target reads its number.
- [ ] Each target is at least 44 × 44 pt. Eleven targets plus 20 pt margins fit 390 pt only in two rows (6 + 5) or as a 0–10 segmented row of 30 pt targets inside 44 pt hit areas. Claude Code chooses one and reports the measurement.

**R3. Week plan strip as hero**
- The top of Week shows 7 columns, Monday to Sunday. Each column holds a day letter and date, and the plan glyph in its plan colour.
- Estimated days use the outlined, dashed glyph in a muted colour, and the strip shows "Estimated" in the detail area, not inside the column.
- Today's column has a quiet marker (an underline in Ink). The selected column is shown by a filled raised background (the one raised level allowed).
- Tapping a column shows that day's detail below the strip: plan name, day types, session and time.
- The move suggestion sits directly under the strip. Before acceptance, it previews the result: the session glyph appears as a ghost on Wednesday. The text states both changes, with the new plans **taken from the plan engine, not hard-coded**.
- On "Move to Wednesday", the glyph travels from Thursday to Wednesday (`motion.standard`, `impact.light`), both columns update, and the suggestion is replaced by one line: "Heavy legs moved to Wednesday. Undo".
- On "Keep Thursday", the suggestion is dismissed for that week.

Acceptance criteria:
- Given Week opens, when the strip renders, then all 7 columns are visible without scrolling at 390 pt and at the largest Dynamic Type size (glyph and day letter only; the date may wrap).
- Given VoiceOver is on, when focus moves along the strip, then each column reads "Thursday 8 October, Train hard" or "Sunday 11 October, Recover, estimated".
- Given Marta taps "Move to Wednesday", when the animation ends, then the Wednesday and Thursday columns and the detail text match the plan engine output.
- Given Reduce Motion is on, when the move is accepted, then the glyphs update with a cross-fade under 150 ms and no travel.
- [ ] No plan name is truncated anywhere. Plan names appear only in the detail area.
- [ ] Colour is never the only cue: glyph shapes differ per plan, and estimated days are dashed and labelled.

### P1: time-boxed to 3 hours, only after P0 passes the device check

**R4. Number with plan-band range bar (replaces the gauge on Today and the widget)**
- Layout from top: plan title (`type.title`, plan colour), score (`type.score`), then a horizontal 0–100 bar divided into today's plan zones, a marker at the score, and a bracket for the likely range.
- Below the bar, one line in plain language, chosen by rule:
  - The whole range sits in one zone: "Likely 34–68. The plan holds across this range."
  - The range crosses a zone: "Likely 34–68. On a stronger day this could be Train hard."
- The reveal animation becomes: the marker slides to the score and the bracket opens (`motion.reveal`, once per day).
- The watch keeps the arc layout of the same component (`variant: "arc"`).

Acceptance criteria:
- Given the plan engine supplies zone thresholds for today's day type, when Today renders, then the zones match those thresholds exactly.
- Given no thresholds are available, when Today renders, then the bar shows the range bracket without zones, and a GAP is logged. No thresholds are invented.
- [ ] Zone colours use the plan field tokens. The marker and bracket use Ink. Contrast is verified for every zone.

**Cut rule:** if R4 is not passing on the phone after 3 hours, revert to the existing dial for the demo and keep R4 in `LATER.md`.

### P2: future, design for it now

- Calendar write: R1 must not block a future "Add to calendar" secondary action.
- Drag-and-drop rescheduling in the strip.
- Tracking pre-reveal rating completion as a product metric, and a weekly prompt if it falls below target.
- The Felt vs forecast screen reading `beforeReveal` ratings only.

## 7. Success metrics

**Leading (measured before and during the hackathon)**

| Metric | Target | Method |
|---|---|---|
| Plan stated correctly after 5 seconds on Today | ≥ 2 of 3 testers | 5-second test, same 3 people as the colour test |
| Hardest day and suggestion effect stated after 10 seconds on Week | ≥ 2 of 3 | Same session |
| "Could the plan change?" answered correctly (R4 only) | ≥ 2 of 3 | Same session |
| Morning step completion time | ≤ 3 s from screen load to reveal | Stopwatch during rehearsal |
| Demo length | ≤ 3:00 | Two timed rehearsals (closes G44) |

**Lagging (after launch; hypotheses, not commitments)**

| Metric | Success / stretch | Window |
|---|---|---|
| Pre-reveal rating completion | ≥ 60% / 75% of mornings | 4 weeks |
| Plan Fit answer rate | ≥ 50% / 65% of evenings | 4 weeks |
| Weekly active planners (redefined, see OQ2) | Baseline in month 1 | Monthly |

## 8. Open questions

| # | Question | Owner | Blocking? |
|---|---|---|---|
| OQ1 | Does the plan engine expose score thresholds per day type for the zones in R4? | Person B (data) | Blocks R4 only |
| OQ2 | The North Star Metric says "accepted or adjusted a day plan". Redefine it as "viewed the morning plan and answered Plan Fit on at least 4 days a week"? | Fernando (product) | Blocks updating `DECISIONS.md`, not the build |
| OQ3 | Should "Did something else" count in the denominator of the Plan Fit Rate, or be excluded as R1 proposes? | Fernando + Person B | Non-blocking (R1 default: excluded) |
| OQ4 | Is the 12:00 cut-off for the morning step right for shift workers? | Design, after the hackathon | Non-blocking |
| OQ5 | Does the fixture data include morning ratings to drive the demo's pre-reveal step, or is a value needed for the scripted morning? | Person B | Blocks the R2 demo script |

## 9. Timeline

| When | What |
|---|---|
| 1 Oct, evening | Approve this spec. Answer OQ1, OQ2 and OQ5 |
| 2 Oct, morning | Claude Code builds R1, then R2, then R3, with a device check after each |
| 2 Oct, afternoon | R4 time-boxed to 3 hours, or revert. 5-second tests on the new Today and Week |
| 2 Oct, evening | Fallback recording, two timed rehearsals, scope freeze |
| 3–4 Oct | Hackathon. No new features; fixes only |

**Scope rule:** nothing enters this spec without something leaving it. New ideas go to `LATER.md`.
