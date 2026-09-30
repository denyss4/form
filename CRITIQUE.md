# Critique log

Each entry: `/design:design-critique` run at a Review, with the context "Form, mobile readiness planner, stage: X, persona Marta". Critical and Moderate findings are fixed, or the entry says why not.

## Review 1: P1 gallery (stage: exploration)

Screenshots: `docs/screens/p1/`. Web preview at 390 wide (react-native-web). The device run is still pending, so motion, haptics, native Dynamic Type and native text rendering are unreviewed. The `-3x` files simulate large text.

### Overall impression

The dial is the identity element and it works: a 270° arc with the likely range drawn as a separate flat bracket outside it. It does not look like a Fitbit or Oura ring, and it shows the uncertainty instead of hiding it. The weakness is hierarchy: a 72 pt number beside a 13 pt range line invites the false precision the brief warns against. There are no Critical findings in the components. Every Moderate finding needs either your decision or the real Today layout (P3), so none is fixed blindly here.

### Findings

| # | Area | Finding | Severity | Status |
|---|---|---|---|---|
| 1 | Honesty | The range line is `type.caption` (13/18, secondary) while the score is 72 pt ExtraBold. The most important honesty message is the smallest, quietest text on the screen. Master §5.3 assigns "range line" to caption | 🟡 Moderate | **Question for you.** Alternative: set the range line in `type.body` (16/24, secondary). It is an existing token, no new style. This overrides one line of the Master, so it needs your OK |
| 2 | Honesty | The range is constant (±17.2), so the bracket is the same width every day and carries no day-to-day information. It also spans about a third of the arc and takes visual weight for a fixed message. The variable, honest signal is input completeness ("Based on N of 11 inputs") | 🟡 Moderate | Deferred to P3. Try the bracket at lower emphasis and put the completeness line next to it on the real Today layout |
| 3 | Hierarchy | On the plan field the answer to "what kind of day should I plan?" is a 17 pt label at the bottom, below the number and the range. Principle 1 (decision over data) is not met by order alone | 🟡 Moderate | Deferred to P3. Options to compare on Today: plan label above the dial as the field headline, or directly under the number |
| 4 | Colour meaning | The arc takes the plan colour, so "Train hard" is an Ember (red) arc. Red reads as warning, so a strong day may look like a bad one. The glyph and label help, but the arc is the biggest coloured shape | 🟡 Moderate | Open risk, no change. The palette is fixed by the Master. Mitigation: test with two or three people at Review 2, and keep the label next to the arc |
| 5 | Legibility | The bracket is 3 px on the watch size and 4 px on the widget. Likely too thin to read at those sizes | 🟢 Minor | Watch and widget are token-level only in this build. Revisit in P5, or drop the bracket at watch size |
| 6 | Accessibility | Dark: control stroke `#5C7189` on raised is 2.91:1 (needs 3:1). The four dark field tints are placeholders | 🟡 Moderate | **Approval needed.** Proposal with no new colour: reuse the light control stroke `#6B7C8D` in dark (4.05:1 on canvas, 3.40:1 on raised). Dark stays secondary; decide in P5 |
| 7 | Accessibility | Disabled controls use 0.4 opacity. WCAG exempts inactive controls, but the label is hard to read | 🟢 Minor | Opacity values are proposals (GAPS G20). Revisit at Review 2 with the device |
| 8 | Accessibility | The ScoreDial track at 16% opacity is about 1.2:1. It marks where 100 sits, but the value is also given as text, so no information is lost | 🟢 Minor | Accepted. Noted so a reviewer does not read it as a miss |
| 9 | Consistency | The dev picker's selected pill looks like a primary button. Log options in P3 need a selected state with a checkmark (Master §6), not this pill | 🟢 Minor | Dev-only. Build a separate `Option` in P3 |
| 10 | Consistency | Driver values are whole points (+6, −4, −2) and cannot sum to the score, and the heading "Why 51" implies they explain all of it. They explain the difference from a typical day, and only the top three are shown | 🟡 Moderate | Deferred to P3 copy review. Candidate heading "What moved it". Each row already says "vs. a typical day" |
| 11 | Empty state | The day-1 dial shows the track and "No score yet" but no action. Master §7: empty states invite one action | 🟡 Moderate | Deferred to P3, where the Today day-1 state carries the "log" action. The gallery shows the dial alone |
| 12 | Interaction | Pressed secondary and text-only buttons look close to default in a still image. The press is scale 0.97 plus opacity for 100 ms, which needs a hand to judge | 🟢 Minor | Judge on the device |

### Fixed during P1 (found while building and reviewing)

- Plan glyphs and driver arrows stayed 24 px while text grew to 51 px at 3× text, which broke the glyph-label relationship. Icons now follow the text size, capped at 2×.
- The plan label could not wrap at large sizes. It now shrinks and wraps.
- The dial container left about 40 px of dead space under the arc's opening, and the range bracket was clipped at scores 0 and 100. The container now stops at the lowest of the arc caps and the bracket.
- The text-only button was indented 16 px from the text margin. It now sits on the margin with a 48 × 48 target.
- A React warning from icons on web (`accessible={false}` passed to the DOM). Removed.

### What works well

- A flat, unshaded range bracket: honest by construction, and it avoids implying a probability shape the model does not have.
- Four plan glyphs with distinct silhouettes (Dumbbell, Footprints, Moon, Focus) that pass contrast on their own fields (4.85:1 to 6.40:1).
- Every colour pair in the light theme passes: 26 pairs, lowest 3.59:1. The gallery recomputes them, and it reproduces the dark failure exactly.
- The score stays inside the ring at 3× text (capped at 1.3×), and the range and plan label wrap outside it.
- Driver rows carry direction as a glyph, a sign and words, never colour alone.

### Questions for Review 1

1. Range line at `type.body` instead of `type.caption` on Today (finding 1)?
2. Reuse `#6B7C8D` as the dark control stroke (finding 6)?
3. Any objection to an Ember arc for "Train hard" before testing it with people (finding 4)?

## Review 2: P3, Today and the evening log (stage: refinement)

Screenshots: `docs/screens/p3/`. Web preview at 390 wide. Still unreviewed: a run on the demo device, native VoiceOver and TalkBack, real haptics, and the reveal playing at speed (this machine reports reduced motion and the browser pane was hidden, so the reveal was checked frame by frame with `?reveal=0.4` and on the instant path).

Review 1 questions, answered by "go to P2": the range line is now `type.body`, and the plan label leads the field. Both are built. The dark stroke reuse (`#6B7C8D`) is still to apply in P5.

### Accessibility pass (WCAG 2.2 AA), run against the live web build

| # | Finding | Criterion | Severity | Status |
|---|---|---|---|---|
| 1 | Icon buttons, choice options, links, the slider and the tab bar showed no focus indicator | 2.4.7 | 🔴 Critical | **Fixed.** One shared `FocusRing`, plus a web focus style for the tab bar. Verified with real Tab presses |
| 2 | Every heading was an `h1` | 1.3.1 | 🟡 Moderate | **Fixed.** Screen titles are level 1, section headings level 2 |
| 3 | Status changes ("Plan accepted.", "Logged.", "Moved…") were silent to screen readers | 4.1.3 | 🟡 Moderate | **Fixed.** The footers are live regions, and iOS gets `announce()`. The web announcement helper creates no live region, hence the footer approach |
| 4 | The slider had no keyboard control | 2.1.1 | 🟡 Moderate | **Fixed.** Arrows, Home and End. Screen readers get increment and decrement |
| 5 | Radios, the slider and the progress ring did not expose checked or value state on the web (`accessibilityState` and `accessibilityValue` are ignored there) | 4.1.2 | 🟡 Moderate | **Fixed.** Moved to `aria-*` props everywhere |
| 6 | The sheet: the scrim was a second "Close" tab stop, and focus fell to the page body on close | 2.4.3 | 🟡 Moderate | **Fixed.** The scrim is not focusable; focus returns to the opener on the web. Focus is trapped inside and Escape closes it (verified) |
| 7 | Tab bar labels were clipped at large text | 1.4.4 | 🟡 Moderate | **Fixed.** Chrome labels cap at 1.3×, as platform tab bars do (`chromeMaxFontScale`) |
| 8 | Log options squashed into tall ovals at 2× text | 1.4.4, 1.4.10 | 🟡 Moderate | **Fixed.** ChoiceGroup stacks: two per row above 1.3×, one per row from 2× |
| 9 | Native screen readers, hardware keyboards and real Dynamic Type were not tested | all | Unknown | **Open.** Judge on the demo phone (GAPS G31) |

Passed: every interactive element measured is at least 44 px (2.5.8 needs 24); every control has an accessible name; `lang="en"`; colour is never the only signal (plan glyph and label, driver arrow and sign, selected check); every colour pair in the light theme passes (lowest 3.59:1); the score stays inside the ring at 3× text; reduced motion gives an instant, static result.

### Design critique

**Overall impression.** Today now looks and reads like a product. The plan-coloured field is the one bold move and it works: the day's answer tints the whole top of the screen. The dial with its separate range bracket is distinctive and honest. The main weakness was clarity of meaning, not looks: the reason line mixed up why the plan is what it is with why the score is what it is.

| # | Area | Finding | Severity | Status |
|---|---|---|---|---|
| 1 | Honesty | The reason said "A lighter session is suggested. Training load and alcohol are pulling your score down." But 51 is a typical score. The plan was light because of the score band and the hard session, not because of those drivers. The line implied a cause that was not true | 🟡 Moderate | **Fixed.** Two parts now: the plan rule first ("Your score is near a typical day, so Push is kept light."), then the drivers. Tested, and it never names a driver the model did not return |
| 2 | Friction | "Did today's plan fit?" appeared even when no plan had been accepted, so the log looked like four questions | 🟡 Moderate | **Fixed.** Asked only after "Accept plan". Otherwise the log is the three core questions |
| 3 | Clarity | "Not used yet: morning readiness, sleep hours…" promised an action that could not change today's score | 🟢 Minor | **Fixed.** "Left out of this forecast: …" |
| 4 | Copy | The error said "Check your log" on a morning screen, before any log | 🟢 Minor | **Fixed.** "Try again in a moment." |
| 5 | Hierarchy | The plan label is 17 pt and the score is 72 pt. The decision still reads smaller than the number. The colour field and the label's position carry it, but a first glance goes to "51" | 🟡 Moderate | **Question for you.** Option: make the plan the screen's title ("Train light", `type.title`) and move "Today, Monday 5 Oct" to the caption. It changes the header pattern, so I did not do it unasked |
| 6 | Discoverability | The morning check-in is the model's strongest input (importance 0.946), yet it sits below the drivers, under the fold at 844 pt. If people rarely rate, forecasts fall to "1 of 11 inputs", as they did in the demo run | 🟡 Moderate | **Question for you.** Option: place it directly under the field, before the drivers. Costs about 130 pt of driver visibility |
| 7 | Demo scaffolding | "Demo: jump to tomorrow morning" is a demo control on a real screen | 🟢 Minor | Kept for the demo. Hide or remove in P5 or P6 (GAPS G32) |
| 8 | Plan honesty | Guessed days on Week still show a confident plan label (Review 1, GAPS G27) | 🟡 Moderate | Open. Decide with you: mute or drop the label on guessed days |
| 9 | Colour meaning | An Ember (red) field for "Train hard" may read as a warning (Review 1 finding 4) | 🟡 Moderate | Open. Not testable without people. Two or three people at Review 3 |
| 10 | Reveal | The sweep is a rotating cover; the bracket and number fade in; the field settles. It works frame by frame. Not yet seen at speed | 🟢 Minor | Judge on the phone |

### What works well

- The plan colour field, and the fact that colour never carries meaning alone (glyph, label, sign, check).
- Honest inputs: "Based on 1 of 11 inputs" and the low-input notice appear when only a workout was logged, and every review state comes from real model runs, never invented numbers.
- The loop is closed and real: accept, log, save, and the next morning's score comes from the model on tonight's answers.
- Day 1 shows no fake score: an empty dial, one sentence, one action.
- The sheet is short, keyboard-safe (trap, Escape, focus return) and readable at 3× text.

### Questions for Review 2

1. Plan as the screen title on Today (finding 5)?
2. Check-in under the field, before the drivers (finding 6)?
3. Mute or drop the plan label on guessed days (finding 8)?
