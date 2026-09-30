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
