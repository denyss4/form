# Gaps

Facts that are missing. Nothing here may be invented. Each gap is also marked `[GAP: ...]` in code comments where it applies.

| # | Gap | Where it bites | Owner | Status |
|---|---|---|---|---|
| G1 | `confidence` has no source in `predict.mjs`. `error_band` is a constant 17.2 | Data contract, Today | B | Show the range plus "Based on N of 9 inputs". No label |
| G2 | `plan` is not produced by the kit. Thresholds for score band × day type are undefined | Today, Week | B | Proposal at P3, approve at Review 2 |
| G3 | `top_drivers` can contain tiny values (points are rounded to 0.1) | Driver list | B | Proposal: hide \|points\| < 0.5 |
| G4 | `missing_inputs` returns snake_case feature names (`sleep_hours`, `readiness_dev`) | Partial-input prompt | B | Needs a human label map; derived features are not user inputs |
| G5 | "Anything unusual?" has no model field | 3-tap log | A | Stored as `notes` only |
| G6 | Definition of "right" in "Form got 5 of 7 days right" and of "fit" | Plan Fit Rate | A + B | Proposal: the user's own yes / too hard / too easy |
| G7 | What "Measured" means on Felt vs Measured (no wearable sync in scope) | Felt vs Measured | B | Proposal: felt rating vs Form's forecast, from fixtures |
| G8 | Dark-theme plan-field tints are undefined | Dark theme | A | Dark is secondary; decide in P5 |
| G9 | Dark control stroke on raised is 2.91:1 (< 3) | Dark inputs | A | Proposal, no new colour: reuse the light stroke `#6B7C8D` in dark (4.05:1 on canvas, 3.40:1 on raised). Needs approval (CRITIQUE finding 6) |
| G10 | Calendar provider for the mocked OAuth | Onboarding | A | Ask before P2 |
| G11 | "Once per day" reveal needs persistence, and no storage library is listed | Today reveal | A | In-memory plus a dev reset for the demo. A storage dependency needs approval |
| G12 | Marta's scripted week (`/fixtures`) does not exist yet | All demo data | B | Built in P1 from real `predict` runs |
| G13 | Font licences | Fonts | A | Resolved. You added `OFL.txt` (Source Sans 3) and `OFL2.txt` (Manrope). Copied unchanged to `assets/licenses/`; Settings names them. Showing the full text in-app is in LATER |
| G14 | Two `.mov` inspiration files could not be viewed | Motion reference | User | Ask which motion to take |
| G15 | 21st.dev pages gave no detail for `spotlight-card` and `course-design-cards` | Component audit | User | Rejected as unverified; check the live previews if wanted |
| G16 | Master §7 copy example cites sleep as a reason; the model says sleep matters little | Copy | A | Explanations use returned drivers only |
| G17 | Which Expo Go the demo phone can install (SDK support) | Demo device | User | P0.1 gate |
| G18 | App icon, adaptive icon and splash are Expo placeholders (`assets/`) | Store and launch | A | Replace after the identity is set; generated assets go in `assets/generated/LOG.md` |
| G19 | Tabular digits, fonts and layout were verified in the web preview only. Native rendering and largest Dynamic Type are unverified | Type | User | Open `/gallery/type` on the demo phone and compare digit widths |
| G20 | The Master gives no values for press opacity, disabled opacity, spring stiffness, the ScoreDial track opacity, or the sheet shadow (opacity, radius, offset) | Motion, shadow, controls | A | Proposals in `packages/tokens` (0.8, 0.4, 200, 0.16, 0.12 / 24 / −8). Revisit at Review 1 and 2 |
| G21 | ScoreDial sizes (app 264, widget 120, watch 88) and stroke and bracket widths are not in the Master | ScoreDial | A | Proposals in `size.dial`. The bracket is likely too thin at watch size (CRITIQUE finding 5) |
| G22 | The reveal ("arc sweeps to the score") is naturally a stroke-dash animation, which is neither transform nor opacity (Master §6) | Today reveal, P3 | A | Decide in P3: a rotating mask driven by transform, or a one-off exception for you to approve |
| G23 | The scripted demo clock is a proposal: logs run Mon 28 Sep to Sun 4 Oct 2026, and "today" in the demo is Mon 5 Oct | Fixtures, demo | B | Confirm, or give another week. Changing it means editing `fixtures/build.mjs` and re-running `npm run fixtures` |
| G24 | Lucide 1.49 has no `waves` icon, so Recover uses `Moon` instead of the planned `Waves` | PlanGlyph | A | Decided. Moon may read as "sleep"; check with people at Review 2 |
| G25 | The onboarding intro (from Open_10) is a second orchestrated moment. The Master allows one (§6) | Onboarding | User | Built at your direction: transform and opacity only, about 1.6 s, once per launch, static under reduced motion. Say the word and I remove it (`IntroMark` is used in one place) |
| G26 | Consent wording is demo text. Where the personal model runs, where data is stored and retention are not decided | Consent | User | The screen says "Demo wording. The final text needs legal review." Needs legal review before any real use |
| G27 | Plan labels for guessed days ("Deep-work day", "Recover" for a weekday with no events) read as confidently as calendar-based ones | Week | A | Open critique item for Review 2: mute or drop the plan label when the day is guessed |
| G28 | The session marker's travel animation was not watched playing: this machine reports reduced motion, and the browser pane was hidden (no frame callbacks). The instant path and the final layout were verified | Week | User | Judge on the demo phone. `?motion=full` on `/week` forces the animation on web |
| G29 | The week's plan rules (session decides, then travel, then work, then rest) and the suggestion rule (hard session with an evening social event that day or travel the next day, moved to the nearest earlier free day) are proposals | Week | B | Approve at Review 2 (GAPS G2) |
