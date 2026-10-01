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

## P4 self-review: Progress, Felt vs forecast, Health data, Calendar changes (stage: refinement)

Screenshots: `docs/screens/p4/` (31 files, 390 wide, web preview). P4 has no Review gate in the roadmap, so this is my own pass against the banned-pattern list and the Master, not a `/design:design-critique` run. That run is for Review 3, after P5. Not run on a device. Still unreviewed: native VoiceOver and TalkBack, real Dynamic Type, and the spinner on a phone.

Three-line layout plans are at the top of each screen file. Progress: job "show whether the plans fit", focal element the Plan Fit ring and its sentence, quiet the day list. Felt vs forecast: job "put each felt rating beside the forecast", focal element the two markers, quiet the legend and the 21-day caption.

| # | Finding | Rule | Severity | Status |
|---|---|---|---|---|
| 1 | The ring's light arc sat last while the "Too hard" day was second in the list, so the ring and the list disagreed | Explain every number | 🟡 Moderate | **Fixed.** Each arc is one day, in list order (`marks` on `CompletionRing`) |
| 2 | Allow access beside a text link "Not now" on a Health data consent: unequal weight | Consent, GDPR Art. 9 (Master §7) | 🔴 Critical | **Fixed.** Both are the same outlined button |
| 3 | "Preview. Nothing is connected" was a small grey caption: the most important line on the screen was the quietest | Clearly mocked (Master §8) | 🟡 Moderate | **Fixed.** `bodyStrong`, directly under the title |
| 4 | The Back button disappeared while connecting, so the title jumped up by 48 | Stable layout | 🟢 Minor | **Fixed.** Back stays. Leaving cancels the mock |
| 5 | "Progress" broke mid-word at 3x text | Dynamic Type, text wraps | 🟡 Moderate | **Fixed** for titles (cap at 2x, GAPS G34). Summary row stacks at 2x. Day and verdict wrap instead of splitting "Tue 29" |
| 6 | "The plan fit on 1 of 1 days" | Copy | 🟢 Minor | **Fixed.** "day" when the count is 1 |
| 7 | The live flow showed "Train light" for a day Today called "Deep-work day": Progress used the calendar week while Today had no calendar | Facts must agree across screens | 🔴 Critical | **Fixed.** Progress uses the same week rule as Today. Re-run live: Mon 5 shows "Too easy, Deep-work day" |
| 8 | "You logged on 7 of the last 7 days" did not move after logging tonight, and the partial state still said 7 | Explain every number | 🟡 Moderate | **Fixed.** The window is the 7 days ending today, and the review states thin it out |
| 9 | Skeleton for the ring was a rounded square | Loading in the final shape | 🟢 Minor | **Fixed.** `Skeleton round` |
| 10 | Six identical "Inside the likely range" lines in a row | Banned pattern 3, in spirit | 🟡 Moderate | **Fixed.** The user decided: one summary line, and a marker only for a day outside the range. The outside state is in `?state=outside` and `/gallery/range` |
| 11 | The "Connecting" indicator loops | Motion: no loops | 🟢 Minor | **Decided.** Indeterminate indicator plus "Connecting to your calendar"; static icon under reduced motion. An exception, recorded in DECISIONS.md |
| 12 | With ±17.2, every scripted day lands inside the range, so "6 of 6 days landed inside the likely range" can read as accuracy | Never invent accuracy | 🟡 Moderate | **Argued, then the user decided to show it.** It is a count, not a score, and the range is not a calibrated interval (`model.json`). The screen still says "Too few days to read much" under 3 days, and the demo note says the ratings are scripted. Re-check the wording at Review 3 |

Pros: one number per screen, no tiles, no card in a card, hairlines and space only. The felt/forecast markers differ by shape (dot and ring), not colour. The permission previews say what would happen, then say plainly that nothing did.
Cons: Progress was long and pushed the Felt vs forecast link below the first screen. **Answered by the user:** keep 7 days, one line each, link under the summary. Built; all six scripted days and the link now sit on the first screen at 390×844.

## Device review: iPhone, Expo Go (stage: refinement)

Screenshots: `docs/screens/device/` (9 stills from the user's iPhone, 375 pt wide, Expo Go on SDK 57). First look at the app on a real screen. Not seen from these stills: haptics, the reveal at speed, Reduce Motion, VoiceOver, Dynamic Type, and the Felt vs forecast, Health data, Calendar changes and onboarding screens.

| # | Finding | Evidence | Severity | Status |
|---|---|---|---|---|
| 1 | Week said "Train hard" for Monday while Today said "Train light" for the same day. Week's plan ignored the score | `iphone-week` vs `iphone-today-top` | 🔴 Critical | **Fixed.** `withScores` gives a forecast day its plan from the score, on both screens. Tested. Week now reads "Train light" |
| 2 | The suggestion footer hid Thursday, so the move's animation (Thursday to Wednesday) would start off screen | `iphone-week` | 🟡 Moderate | **Fixed.** Week scrolls to show both days above the footer |
| 3 | Content scrolls behind the status bar on Today ("Based on 11 of 11 inputs" runs under the clock) | `iphone-today-scrolled` | 🟡 Moderate | **Fixed in code** (a strip under the status bar, opacity only). Not testable on the web, where the inset is 0. Check on the phone |
| 4 | "so Push is kept light" reads as a verb | `iphone-today-top` | 🟡 Moderate | **Fixed.** "so your Push session is kept light" |
| 5 | "3 more to save." is ambiguous | `iphone-evening-log` | 🟢 Minor | **Fixed.** "Answer 3 more to save." |
| 6 | Expo Go's blue tools button covers our Settings gear and some content | every still | 🟡 Moderate for the demo | **Not ours.** GAPS G37: hide it in Expo Go or demo from a development build |
| 7 | Low Power Mode is on in every still | battery icon | Info | GAPS G38 |
| 8 | "The full texts are in assets/licenses" is a repository path | `iphone-settings-connections` | 🟢 Minor | Open, GAPS G39 |
| 9 | The unrated morning slider keeps its thumb at the "Very low" end next to "Not rated" | `iphone-today-scrolled` | 🟢 Minor | Open, LATER.md |
| 10 | The morning check-in, the model's strongest input, is below the fold on a real phone (Review 2 finding 6) | `iphone-today-top` | 🟡 Moderate | Open. Question for Review 3 |
| 11 | Sunday, guessed from the weekday, still shows a confident "Recover" label (GAPS G27) | `iphone-week-scrolled` | 🟡 Moderate | Open. Question for Review 3 |

What the phone confirms: Manrope and Source Sans render correctly; the dial, the range bracket and the plan field look as designed, with the field running under the status bar; safe areas and the home indicator are right; the tab bar labels are not clipped; Progress's one-line rows fit at 375 pt; the consent choices keep equal weight with a check for the chosen one; the evening log's four groups fit one screen without scrolling.

## P5 checks: reduced motion, Polish length, dark contrast

Screenshots: `docs/screens/p5/`. Web preview at 375 × 812, the iPhone's size.

- **Reduced-motion pass.** Every animated file was listed and read. Seven already honoured it (press, choice options, completion ring, sheet, reveal, move marker, intro mark). Two did not: the busy indicator in `Button` (loading) and on the calendar connect screen. Both now use one `Busy` component: the native indicator normally, a static icon under reduced motion. The connect screen also lost its disappearing Back button. The screens were viewed on this machine, which reports reduced motion. Not yet seen on the phone with Reduce Motion on.
- **Polish-length test.** `?pseudo=1` grows every string in `copy.ts` by 32% in total (382 strings, with Polish letters; a test checks it, and that numbers are untouched). Viewed at 375 pt: Today, the evening log, Week, Consent, Connect calendar, Progress, Felt vs forecast. No clipped, truncated or overlapping text. The tightest spot is Progress: "Deep-work day" and the status share one line, and the plan label wraps inside its own column when it has to. Not viewed: Settings, Health data, Calendar changes, onboarding (same components). Driver labels baked into the fixture JSON are not grown (GAPS G40).
- **Dark contrast.** The gallery, recomputed: the control stroke passes 3:1 on canvas, raised and all four fields (lowest 3.40:1). GAPS G9 closed.
- **Builds.** `npm run check`, 26 tests, and `expo export` for both iOS and Android exit 0.

## Review 3: P5 (stage: final polish before the demo)

Run with `/design:design-critique` ("Form, mobile readiness planner, stage: final polish before the demo, persona Marta"). Screens: the 9 iPhone stills (`docs/screens/device`), `docs/screens/p4`, `docs/screens/p5`. Not seen on the phone: Felt vs forecast, Health data, Calendar changes, onboarding, the reveal and the move animation at speed, haptics, Reduce Motion, VoiceOver, Dynamic Type.

### Overall impression

Today, Week and Progress now look like one product on a real phone: the plan-coloured field, the dial with its separate range bracket, and hairline rows with no boxes inside boxes. The biggest remaining opportunity is order of attention on Today. The eye goes to "51" first, and the decision Marta came for ("what kind of day?") is a 17 pt label above it. The second is that the two flagship moments, the reveal and the move, have still never been watched at speed.

### Usability

| # | Finding | Severity | Recommendation and status |
|---|---|---|---|
| 1 | Today: the decision reads smaller than the number. On the phone the first glance lands on "51", then the dial, and only then "Train light" (Review 2 finding 5) | 🟡 Moderate | **Fixed (answer 1: yes).** The plan is the screen title in `type.title` and the plan colour. Order: plan, dial, range and confidence, reason, drivers |
| 2 | Today: the morning check-in is below the fold. Argued: it feeds tomorrow's forecast and Felt vs forecast, not today's score | 🟡 Moderate | **Decided (answer 2: keep).** Added "2 taps to sharpen tomorrow" under the drivers while the rating is missing. Completion is logged in `METRICS.md` |
| 3 | Week: a day guessed from the weekday ("Sun 11, Rest, guessed") showed "Recover" as confidently as a calendar day (GAPS G27) | 🟡 Moderate | **Fixed (answer 3: yes).** "Estimated": muted dashed glyph, secondary-tone label, the word, and "estimated" for screen readers |
| 4 | Week: the suggestion footer takes 29% of the screen, which hid Thursday | 🟡 Moderate | **Fixed.** Week scrolls to show both days, stopping on a row boundary. Seen on the web at 375 pt, not yet on the phone |
| 5 | Progress: the one row to notice ("Too hard") was the same weight as "Fit", beside six coloured labels | 🟡 Moderate | **Fixed.** "Fit" is quiet, "Too hard" and "Too easy" are bold |
| 6 | Today: "Why 51" promised to explain all of 51. The rows (+6, −4, −2) are the top three differences from a typical day | 🟡 Moderate | **Fixed.** "What moved your score" (Review 1 finding 10) |
| 7 | The unrated morning slider keeps its thumb at the "Very low" end next to "Not rated" | 🟢 Minor | Open, LATER.md |
| 8 | Expo Go's blue button covers our Settings gear | 🟡 Moderate for the demo | **Answer 4:** no dev build; demo in production mode. The button could not be confirmed hideable on SDK 57 (GAPS G37). Check on the phone |

### Visual hierarchy

- **What draws the eye first:** on Today the number "51"; on Week the column of coloured plan labels; on Progress the ring, then the coloured plan column. Week and Progress are right, since the week's rhythm is the point. Today is half right: the number first is fine, but the plan should be second and is third (finding 1).
- **Reading flow:** Today runs field, dial, drivers, check-in, button, which is the order of the morning question. Week reads as a list with the ask pinned at the bottom, in the thumb zone.
- **Emphasis:** the primary action is always one Ink button, and there is never more than one. The plan colour appears only for plan state.

### Consistency

| Element | Issue | Status |
|---|---|---|
| Screen title height | Today sat 8 pt higher than Week and Progress (measured: 8 vs 16), so the title jumped between tabs | **Fixed.** 16 on all three |
| Week vs Today plan | Two rules gave one day two plans | **Fixed** (device finding 1) |
| Session names | "Push is kept light" read as a verb | **Fixed.** "your Push session" |
| Choice controls | Settings shows the chosen Allow as solid Ink with a check; the Health and Calendar previews use two outlined buttons | Intended: one is a selection, the other an action. Both keep equal weight |
| Dark theme | The four plan fields are the same placeholder colour | Open, dark is secondary (LATER.md) |

### Accessibility

- **Colour contrast:** every light pair passes (lowest 3.59:1). Dark now passes too (stroke 3.40:1 on raised, on every field) after reusing `#6B7C8D`.
- **Touch targets:** every control measured is at least 44 px. The Settings gear (48 px) is covered by Expo Go's button on the phone (G37).
- **Text:** body 16/24; captions 13/18 carry the demo note and source lines, all at 6:1 or better.
- **Not verified:** VoiceOver, Dynamic Type and Reduce Motion on the phone (GAPS G31).

### What works well

- The plan field is the one bold move, and nothing else is coloured for decoration.
- Honest numbers: "Likely 34–68", "Based on 11 of 11 inputs", "Demo data" on every scripted screen, a count not a score on Felt vs forecast.
- The Polish-length test passes at 375 pt: nothing clipped at +30%.
- Consent keeps equal weight everywhere, with a check for the chosen option.
- The evening log fits four groups on one screen and says what is left ("Answer 3 more to save.").

### Priority recommendations

1. **Decide finding 1** (plan as the title). It is the single change most likely to improve the first two seconds of the demo.
2. **Watch the motion on the phone** with Low Power Mode off and Expo's button hidden: the reveal, the move, the haptics, and Reduce Motion on. They are the demo's two signature moments and have never been seen at speed (GAPS G28).
3. **Decide the guessed-day label and the check-in position** (findings 2 and 3), then rehearse the three-minute path.

### Questions for Review 3

1. Plan as the screen title on Today (finding 1)?
2. Keep the check-in where it is (finding 2)?
3. Mute the plan label on guessed days (finding 3)?
4. Hide Expo's button, or build a development build for the demo (finding 8)?
5. Show two or three people the Ember field for "Train hard" during a rehearsal (Review 1 finding 4)?

### Answers to the Review 3 questions (1 Oct 2026)

1. Plan as the title: **yes**, built. 2. Check-in below the fold: **keep**, with a one-line nudge. 3. Mute guessed days: **yes**, built as "Estimated". 4. Dev build: **no**; production mode, and the tools-button result is unconfirmed. 5. Ember test: **the user runs it**; `#A64B00` is prepared, not applied, and does not improve distinctness (`docs/hard-hue-candidate.md`).

## P6 checks

- The demo path ran end to end, by script, on the production web build (`--no-dev --minify`, 375 × 812): path A (ratings 7 and 7) ended on Train light, 59; path B (7 and 9) ended on Train hard, 65. Path B is the locked one. No person has rehearsed it (GAPS G44).
- The production iOS bundle builds (6.2 MB, `__DEV__` false). The gallery link is absent in production.
- Not checked: the Today plan title and estimated glyph on the phone; VoiceOver order (GAPS G41); the dashed glyph's legibility at 24 px.

## Pre-recording fixes (1 Oct 2026, from the user)

Screenshots: `docs/screens/p6-prerecording/`, production mode (`npm run demo`, `--no-dev --minify`), web at 375 × 812. Not on the phone.

| # | Fix | Check |
|---|---|---|
| 1 | Consent: no pre-selection, equal weight until tapped, Continue after all four | Already true. 8 of 8 options unchecked, one style, Continue disabled. Calendar connect: Allow and Skip now equal weight |
| 2 | Week: preview and inline suggestion | Reads "Wednesday becomes Train hard. Thursday becomes Deep-work day." under Thursday. After Move, Wednesday is Train hard and Thursday a Deep-work day |
| 3 | Progress: solid segments | 6 segments, 5 filled and 1 outlined, none dashed, plus a legend |
| 4 | Evening log: 2 + 1 layout, ring | Check icon 210–230 px, label 243–303 px, no overlap. Ring arcs go 0, 1, 2, 3 of 3 filled with the answers |
| 5 | Slider: no thumb until the first tap | No thumb when unrated, "Not rated"; a real click on the fourth dot sets "3 of 10" and shows the thumb |
| 6 | Accept plan: no primary after | "Plan accepted." and a text-only "Log tonight" (primary with `?evening=1`) |
| 7 | Copy | "One tap to sharpen tomorrow." |
| 8 | Onboarding example dial | 51, likely 34–68, "Example" |

Not verified: all of it on the phone; VoiceOver for the slider and the example dial; the ring's fade and the move animation at speed.

### Fixes from the iPhone screenshots (1 Oct 2026)

Screenshots: `docs/screens/p6-prerecording/` (the last five files), production mode, web at 375 × 812.

| # | Fix | Check |
|---|---|---|
| 1 | Consent: Not now first | Order Not now, Allow on all four purposes and in Settings. Nothing selected, Continue disabled |
| 2 | Gallery dial like Today | Plan title, dial, "Likely 34–68" at body size, "Based on 11 of 11 inputs" |
| 3 | Settings: no Reset demo, no gallery link | The page ends at Licences |
| 4 | Slider: 0 by default, numbers under the dots | Outline thumb on 0, "0 of 10", numbers 0 to 10. A click on 0 records 0, a click on the 4 and the 6 set "4 of 10" and "6 of 10". The focus ring wraps the track and the numbers |

Not verified on the phone: the numbers at large text, and what VoiceOver says for "Not rated" then the first increment.

## Taste pass (1 Oct 2026, from the user: "the design looks bad")

Skills: `design-taste-frontend` and `redesign-existing-projects` (Leonxlnx/taste-skill, installed in `.claude/skills`). The first says it is not for native mobile or product UI (its §13), so only its audit and anti-template checks were used, in "redesign, preserve" mode. Where it conflicts with `CLAUDE.md`, `CLAUDE.md` wins: no font swap (Manrope and Source Sans 3 stay), lucide only, no photos, no grain, no staggered entrances, and "Likely 34–68" keeps its en dash.

Screenshots: `docs/screens/taste-pass/`, web at 390 × 844, dev mode.

| # | Finding | Fix | Rule |
|---|---|---|---|
| 1 | Progress: six coloured, bold plan labels outshout the fit status, though its own layout plan says the day list is quiet | `PlanLabel quiet`: the glyph keeps the plan colour, the word is body text. "Too hard" is now the one thing that stands out | 5.1 colour for meaning, Progress layout plan |
| 2 | Progress: the fit segments are 24 high with the control radius, so they read as six buttons | 12-high full-radius pills (`size.segment`) | 5.4 full radius for segmented pills |
| 3 | Week: day types come before the session, so the line that matters is in the middle | Session first (body), tags under it (caption). "No session" is body secondary, so the slot line keeps one height | Layout plan: tags stay quiet |
| 4 | Week and Progress: 12 or 24 between the header and the content, the same as inside the list | 32 between groups | 5.2 |
| 5 | Onboarding: three plain lines with no structure | Each point leads with the icon of where it happens (log, Today tab, Week tab) | 5.5 #7: functional, not decorative |
| 6 | Week suggestion: three paragraphs at one weight | The preview line is secondary | Hierarchy |
| 7 | Week at 3× text: the plan label ran off the screen ("Train ligh"). Existed before this pass | The label cell shrinks and wraps | 5.3 wraps, never truncates |

Checks: `npm run check` passes. The move still works (Wednesday becomes Train hard with Heavy legs, Thursday Deep-work day) and the week still opens scrolled to the suggestion. Progress and Week checked at 3× text.

Not verified: anything on the phone; the move animation at speed with the new row order; VoiceOver for the onboarding icons (lucide SVGs, not labelled); dark mode.

## Dark, minimalist restyle (1 Oct 2026)

Decisions in `DECISIONS.md`. Screenshots: `docs/screens/dark-minimal/`, web at 390 × 844, dev mode.

Checks: `npm run check` passes. Seen in dark: onboarding, consent, connect calendar, Today (default, reveal held at 40%, evening log sheet), Week (default, low confidence, 3× text), Progress, Felt vs forecast, Settings, Health data, Calendar changes. The move still ends with Wednesday Train hard and Thursday a Deep-work day.

Found and fixed during the pass:
- The sheet scrim was `text.primary`, near-white in dark, so opening the evening log washed the screen grey.
- A quiet plan label on an estimated day dropped its "Estimated" marker (branch order). The estimated glyph at 20 px was nearly invisible in dark; quiet labels keep the 24 px glyph.

Open: the estimated glyph (dashed, 0.75 opacity) is still faint in dark. Primary buttons are now a light fill with dark text, the brightest thing on each screen; that is the intent but has not been seen on the phone. Not verified: the phone, OLED contrast, the reveal at speed, VoiceOver. The fallback recording `docs/demo/fallback-production.MP4` shows the light design and no longer matches.
