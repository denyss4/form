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
- Icon library: `lucide-react-native` (nothing in `/Components` to prefer). Imported per icon (`lucide-react-native/icons/<name>`). Plan glyphs: Dumbbell, Footprints, Moon, Focus (`Waves` does not exist in lucide 1.49).
- ScoreDial (P1): a 270° arc, opening at the bottom. The likely range is a thin flat bracket outside the arc in the plan colour, with no shading or taper, because the model's range is not a calibrated interval. The plan colour tints the field behind it, not the arc's meaning. Range text and plan label sit outside the dial so they can wrap.
- Icons follow the text size (Dynamic Type), up to 2×. The score number caps at 1.3×.
- Theme: light is primary. Dark tokens exist for review only; dark plan fields and hairline are placeholders (GAPS G8, G9).
- P2 (approved by "go to phase P2"): the Review 1 recommendations stand. Range line at `type.body` on Today (P3). Dark control stroke reuses `#6B7C8D` (still to apply, P5). Palette unchanged.
- Motion reference: `Open_10` (chosen). Its thin-circle geometry drives the onboarding intro (rings merge into the dial's empty state). Its scroll-driven feel is not used: the Master bans scroll-jacking and parallax.
- Calendar provider for the mock: Google Calendar, as text only (no logo, no imitation of its sign-in). Proposal, GAPS G10.
- Demo state lives in memory and resets each launch; Settings has "Reset demo".
- Consent: Allow and Not now are equal weight, nothing preselected, Continue stays off until all four are answered. Withdrawal in Settings is the same control.
- P3: Today puts the plan label first in the field, then the plan's reason, then the dial, then the range line at `type.body` (Review 1). The reason has two parts: why this plan (the plan rule, score band x day type), then why the score is what it is (only the drivers the model returned).
- Plan engine (proposal, GAPS G2): a low score (below 40) is always recovery; a session is hard only when it is a hard session and the score is 60 or more, otherwise light; with no session a work day is deep work, and travel or rest is recovery.
- The evening log is three questions (effort only when the calendar has a session, alcohol, anything unusual), plus "Did the plan fit?" only after a plan was accepted. The effort words map to the model's scale by proposal (GAPS G30).
- The morning 0-10 rating sits below the drivers for now (Review 2 question). It feeds tomorrow's forecast; it does not change today's score.
- Navigation chrome (tab labels) stops growing at 1.3×. Choice options stack at larger text.
- Gallery: deep-linkable state (`?theme=dark&scale=3&plan=recover&state=high`), so any review screenshot can be reproduced. Text-size simulation is web preview only.
- No skills from `/Skills` are installed. Skills that conflict with the Master are not used (see the plan, section D).
- Explanation text under the plan uses only drivers the model returned. The "gets sharper as you log" line is not shipped.
- The move suggestion is one scripted scenario from fixtures, not a general engine.

## Made in P4 (design engineer, for Review 3)

- Plan Fit counts the days the person answered "Yes" to "Did the plan fit?". A followed Recover day counts like a followed training day. No streak, no points. Each ring arc is one day, in the same order as the list beneath it.
- The second screen is called "Felt vs forecast", not "Felt vs Measured": nothing on it is measured. It shows each morning's rating beside the forecast, and the likely range. It shows a count of days inside the range, never an accuracy score, because the ratings in the demo are scripted and the range is not a calibrated interval.
- The Health data and Calendar changes screens start with "Preview. Nothing is connected in this demo." Allow and Not now look the same (consent rule, GDPR Art. 9). Calendar changes is separate from reading the calendar, and the consent text now says "Form only reads your calendar."
- Screen titles stop growing at 2x text (GAPS G34).

## Decided by the user on the P4 questions

- **Progress list.** All 7 days stay. One line per day. The "Felt vs forecast" link sits directly under the meter summary. No "Load more" on a fixed 7-day list. At 1.5x text and above the plan drops to its own line, so nothing is cut.
- **Felt vs forecast.** One summary line: "6 of 6 days landed inside the likely range." A per-row marker appears only for a day outside the range. The outside-range state stays in the state picker (`/felt-vs-forecast?state=outside`) and in `/gallery/range`. Fixture data is not changed: that state moves one day's felt value at run time, for review only.
- **Connecting.** An indeterminate native ActivityIndicator plus the line "Connecting to your calendar" (Health data: "Connecting to your health data"). Under reduced motion: a static icon and the same line. **This is a decided exception to the no-loop rule (Master §6).** There is no real progress to show, so there is no determinate bar. GAPS G36 is closed.
- **Connectors.** None are authorised. None are in scope.

## Provisional product rules (not model facts, pending Person B)

- **3 = too few to read much.** With fewer than 3 answered days (Progress) or 3 labelled days (Felt vs forecast) the screen says "Too few to read much." The number 3 is a product rule, not a model fact. The 21-day threshold is different: it is `minimum_pairs` in `model.json`. (GAPS G33.)
- **Felt = morning rating x 10.** This puts the rating on the score's 0 to 100 scale for the comparison. The fit answers and ratings in Marta's week are scripted. (GAPS G35.)
- **Titles stop growing at 2x text.** (GAPS G34.)

## Made in P5 (design engineer, for Review 3)

- **One plan per day, on every screen.** Where the model has a forecast for a day, the score decides that day's plan, on Week as on Today. Days ahead follow the calendar, and Week says so in one line. (Found on the iPhone: Week said "Train hard" for Monday while Today said "Train light".)
- **Week opens on the move.** When a suggestion is open, Week scrolls just far enough to show both days it names, so the session's travel is on screen when it plays.
- **Session names are named as sessions.** "Your Push session is kept light", not "Push is kept light". "Answer 3 more to save."
- **Dark control stroke** reuses `#6B7C8D`. No new colour.
- **Polish-length test** is `?pseudo=1` on the web or `EXPO_PUBLIC_PSEUDO=1` on the phone. Review only, no library.
- **Review 3 fixes.** The driver heading is "What moved your score" (it was "Why 51", which promised to explain all of 51 while the rows are only the top three differences from a typical day). The screen title sits at the same height on every tab. On Progress, "Fit" is quiet and "Too hard" or "Too easy" carry weight. Week stops its scroll on a row boundary.
- **Busy indicator.** One shared component: the native indicator, and a static icon under reduced motion (the exception decided at P4). The calendar connect screen keeps its Back button while it loads.

## Decided by the user on the Review 3 questions (1 Oct 2026)

1. **The plan is Today's title**, in `type.title` and the plan colour. Order: plan, ScoreDial, range and confidence, drivers. `type.score` keeps its size. VoiceOver order must match. Built: the title is the plan's glyph and label, the caption reads "Today, Monday 5 Oct", then the dial, the range and confidence, then the one-sentence reason (my placement, after the confidence line, so it does not sit between the plan and the dial), then the drivers. GAPS G41 says what is unverified.
2. **The morning check-in stays below the fold.** When the rating is missing, one line under the drivers reads "2 taps to sharpen tomorrow" (no card), hidden once rated. "Sharpen" means the rating becomes an input for tomorrow's forecast. It is not a claim that the model learns. Check-in completion is logged as a metric to watch (`METRICS.md`, `checkinCompletion()`, tested).
3. **Estimated days** (no calendar events) show a muted plan colour, an outlined glyph, and the text "Estimated"; screen readers say "estimated". Built: the glyph is the plan colour at 0.75 and dashed (every glyph is a line icon already, so "outlined" is a dashed outline), the label is in the secondary tone (a plan colour at reduced opacity cannot keep 4.5:1 for text: 3.7 to 4.4 at 0.8), and the word "Estimated" sits under it.
4. **No EAS development build.** Demo in production mode: `npm run demo` (`expo start --no-dev --minify`). The result of the tools-button check is in GAPS G37 and `docs/demo/DEMO.md`: not confirmed on SDK 57. The fallback recording is prepared as a runbook; it needs the phone.
5. **Hard-plan hue.** The user runs the 5-second test. Candidate `#A64B00` is prepared and **not applied** (`docs/hard-hue-candidate.md`, GAPS G42).

## Made in P6

- **The demo path is locked** (`docs/demo/DEMO.md`, path B: morning ratings 7 and 9, Moderate, No, No, Yes both evenings, Heavy legs moved to Wednesday). It ends on Wed 7 at Train hard, 65, Likely 48–82.
- **Production mode hides the gallery link** in Settings (`__DEV__`). "Reset demo" and "Demo: jump to tomorrow morning" stay: the path needs them.
- **A credit slide** for PMData (`docs/demo/pmdata-credit-slide.html`). GAPS G43.

## Decided by the user before recording (1 Oct 2026)

1. **Consent: no pre-selected answers.** Allow and Not now look identical until tapped, and Continue enables once every purpose is answered. Already true in the app (checked: all 8 options start unchecked with one style, Continue starts disabled). Nothing needed changing there. I also made the calendar connect screen's Allow and Skip equal weight: it had a solid Allow beside a text link, the same miss as the Health preview in P4.
2. **Week: the suggestion previews its result and sits inline.** It now reads "Wednesday becomes Train hard. Thursday becomes Deep-work day." and sits directly under the Thursday row (no pinned bottom block). The preview comes from the same week the move produces, so the two cannot disagree. After accepting, both rows update.
3. **Progress: solid segments, not a dashed ring.** One segment per answered day, up to a week: filled = the plan fit, outlined = it did not. A short legend says so. **Dashes mean "Estimated" only.**
4. **Evening log:** the three-way "Did today's plan fit?" is a 2 + 1 layout, and every option now reserves room for its checkmark, so no label can run under it. The header ring is thicker (4 px against 2) and each arc fades from the grey track to the answered colour as its question is answered.
5. **Check-in slider:** no thumb until the first tap. The dots are the targets; tapping one sets the value and the thumb appears there. Screen readers read "Not rated" until then.
6. **Today after "Accept plan":** "Plan accepted." and no primary button. "Log tonight" is the primary only from 17:00 (GAPS G46); before that it is a text-only action beside it.
7. **Copy:** "One tap to sharpen tomorrow." (replaces "2 taps to sharpen tomorrow").
8. **Onboarding dial** shows a filled example day, labelled "Example", instead of the empty arc. The numbers are the demo's first morning from the fixtures (51, likely 34–68). It is read to screen readers as "Example: Form score 51. Likely 34 to 68."
9. **GAPS G45** records that the rating sits below the score and is anchored by it.

## Fixes from the iPhone screenshots (1 Oct 2026)

1. **Consent: Not now first, Allow second.** Settings shares the same options, so the two screens stay the same control. The calendar connect and Health and Calendar-changes preview screens still stack Allow above Not now or Skip: say if you want those swapped too.
2. **Gallery dial page** lays out its app-size example like Today: the plan as the title, the dial, the range at body size, then the inputs line. (My reading of "make the progress bar like on the third screen": that screenshot was the gallery's Score dial page. Say if you meant something else.)
3. **Settings: no Demo section.** "Reset demo" and "Open gallery" are gone. To start again, close Expo Go and open the app again, or shake and choose Reload. The gallery routes still exist for development, reached by link only.
4. **Check-in slider:** the thumb starts on 0 and the readout shows "0 of 10", as an outline in the secondary tone. **Nothing is recorded until it is touched**, even a tap on 0. Every dot has its number under it (0 to 10; at very large text only 0, 5 and 10). Tapping a dot or its number sets the value. Screen readers hear "Not rated" until then (GAPS G47). This replaces the earlier "no thumb until the first tap".

## P7: final polish (1 Oct 2026)

A pass, not a phase of features. Checked in production mode at 375 × 812: every interactive element has a name, none is under 44 px, nothing scrolls sideways, there are no console errors, and the new slider holds at 2x text (numbers 0, 5 and 10, 12 px clear of the end labels). Removed the repository path from the licence line (GAPS G39) and one unused size token. The build is frozen: from here only fixes for what the phone, VoiceOver or the rehearsals show.

## Still open

- Demo phones (decision 7).
- ~~A lighter dark-theme control stroke~~ Closed in P5: `#6B7C8D` (the light stroke) is reused in dark.
- Calendar provider name for the mocked OAuth.
- Definition of "fit" for Plan Fit Rate (proposal: the user's own yes / too hard / too easy answer).
- Plan thresholds (score band × day type). Person B proposes; approve at Review 2.

## Dark, minimalist restyle (1 Oct 2026, from the user)

User instruction: "Restyle everything right before the demo. Don't change the fonts; it must be in minimalistic style; switch to dark mode." This supersedes "Theme: light is primary" above and the "one bold move" rule in `CLAUDE.md` and MASTER_PROMPT §5.1.
- Dark is the app theme (root `ThemeProvider`, status bar, `app.json` `userInterfaceStyle`). Light stays defined and in the gallery.
- No colour field on Today (user's choice of three options). Dark plan fields equal the dark canvas, so the plan shows in the title, its glyph and the dial arc. The dial's reveal cover is drawn in the field colour, so this keeps the reveal correct. No new colour.
- Minimalist rules: one flat canvas; no rule above the tab bar or the Today footer; in lists (Week, Progress) the plan colour is only in the glyph, at full size, and the word is plain text.
- Sheet scrim per theme: Ink at 0.4 in light, the dark canvas at 0.72 in dark (`bg.scrim`, `opacity.scrimDark`). Ink lightened a dark screen. No new hex value.
- Fonts unchanged.

## Banned patterns and motion limits removed (1 Oct 2026, from the user)

User instruction: "Unban the whole patterns and motion." This supersedes MASTER_PROMPT §5.5 (banned template patterns, including "check the layout plan against this list") and the restrictive parts of §6: one orchestrated moment only, no list entrances, loops or parallax, animate only transform and opacity, reveal-only use of the reveal token, and "Load more, never infinite scroll".
- Kept, because they are not pattern bans: the motion tokens as defaults, the reduced-motion fallback (accessibility), haptics, loading timings, interactive states, and the 3-line layout plan.
- Not changed by this decision: colour rules (tokens only, new colours need approval, no gradients except the dial band, never colour alone), copy and health language, consent, the no-streaks rule, scope.
- No code changed. Existing comments that cite 5.5 describe why the current design looks as it does; they are not rules any more.

## Colour, icon, copy, consent, streak and scope rules removed (1 Oct 2026, from the user)

User instruction: unban the colour rules (tokens only, no gradients except the dial band, new colours need approval), "only lucide icons", copy and health language, consent, no streaks, and scope. This supersedes the matching parts of MASTER_PROMPT §5.1, §5.5 #7, the copy and consent sections, the gamification rule, and the scope list, plus "Icon library: lucide-react-native" above (lucide stays in use, it is no longer required).
- Removed from `CLAUDE.md`: "tokens only / a hard-coded colour is a violation / a new colour needs approval", "nothing else as background", "colour carries meaning only", "no gradients", the whole "Copy and health language" section (forbidden health words, food and weight neutrality, GDPR Art. 9 per-purpose consent, no streaks or points), and the whole "Scope" section with `SCOPE FLAG`.
- Kept: "Never colour alone" (accessibility), the model facts, facts and gaps, execution and environment, and the product principle "wellness, not diagnosis" (a principle, not in the list).
- No code changed. The consent screens, copy and the Plan Fit meter stay as built.
- Note for anything beyond the demo: GDPR Art. 9 consent for health data and avoiding diagnostic claims are legal requirements in the EU, not style rules.

## "Lichen" redesign: Step 1 approved (1 Oct 2026, from the user)

Source: `docs/prompts/REDESIGN-PROMPT.md`. Plan: Step 1 sections A–H, approved with these changes.
- Health-language, consent and no-streaks rules are reinstated in `CLAUDE.md` (MDR, GDPR and data integrity). The scope list is updated, not deleted: mocked auth is in; real auth, sync and social sign-in stay out. This supersedes the 1 Oct removal of those rules. The banned-pattern and motion removals still stand.
- No demo freeze. After v2 Item 2 passes on the phone, the git tag `demo-v2` marks the fallback build.
- Radius tiers 12 (control), 16 (surface), 24 (sheet), full (pill). The Today plan glow (a radial falloff behind the dial) replaces "no field on Today in dark". The old light tokens stay for the gallery only, unmaintained.
- Phases: v2-1, v2-2, `demo-v2` tag, section E rerun against the white-space guideline's 2.4 checklist, D0a (tokens, radius, glass tab bar, Today glow, dial fix, dividers), D0b (Day 1, R3 Week strip with inline detail), D1 Welcome and onboarding, D2 Profile and mocked auth, D3 component upgrades, D4 critique and demo. A phone check after each.
- Wireframes and fixtures: "Marta", initial "M", no invented surname; `marta@example.com` is a fixture value; no middle-dot meta strings.
- Liquid metal (Welcome "Create account" only): a sage fill with a one-time metallic sheen that settles. No chrome look, no second accent.
- Dependencies: expo-blur, expo-image-picker and expo-notifications approved; expo-linear-gradient skipped (react-native-svg draws the gradients); Skia rejected. The notifications pre-prompt stays mocked whenever the demo clock is on; the real OS prompt appears only in normal builds.
- Q1: Marigold #faab3f and Butter #eada78 are shown at D0a. If rejected, Data Muted changes and is re-tested, not the plan colours. Q2 guest mode: yes. Q3 inline Week detail now; the morph modal in D3 behind its own check. Q4: header profile button, no fourth tab. Q5: Welcome A, "Dawn over the week". Q7: profile training and work fields are stored, with a GAP for the engine; a display-name map for sessions.
- Rejected components: rainbow button (decoration with no job, and a second accent), radar chart (angle and area are read inaccurately, and no data fits it), checkbox todo list (no real use).

## D0a accepted (2 Oct 2026, from the user)

- Q1: Marigold `#faab3f` (Train hard) and Butter `#eada78` (Train light) accepted after the iPhone check of D0a. Data Muted stays `#94A8B6`.
- D0a as built: Lichen tokens (dark app theme; light palette kept for the gallery only), radius 12/16/24, sage primary and selection, glass floating tab bar (expo-blur, canvas tint 0.70, Text High labels, sage active icon; solid under Reduce Transparency and on Android), Today plan glow at 0.16, dial order track → arc → band with a dash-drawn reveal, dividers removed on Today and Week.

## D0b: Day 1 and the Week strip (2 Oct 2026)

- Day 1 (v2 Item 3): the empty dial (control-stroke track, 4.60:1 on canvas), the calendar's day types with icons (`DayTypes`: work, training, social, travel, rest; never the plan glyphs) and "Your plan arrives tomorrow, after tonight's log." No provisional plan (GAP G49).
- Week strip (spec R3, v2 Item 4) as the hero, with the inline detail (Q3: the morph modal waits for D3). Today: a Text High underline under the date. Selected: the raised fill. Estimated: a solid glyph in Text Muted plus a hollow ring (no dashes). While the move is offered, Wednesday and Thursday are outlined in the selection colour (sage, a state, not a second action).
- **Against spec R3:** day letters and dates stop growing at 2× text, and the glyph drops to the small size from 2×. R3 lets the date wrap, but a number cannot wrap: at 3× two-digit dates ran together and 48 pt glyphs touched in 50 pt columns.
- The suggestion's reason is built from the engine's reasons ("Heavy legs on Thursday sits before a late dinner and a Friday flight."); "late" is backed by the engine's 19:00 rule. After a move: "Heavy legs moved to Wednesday." with Undo (restores the week and the suggestion). "Keep Thursday" dismisses it for the week.
- The dashed "estimated" glyph is retired everywhere: estimated plans show a solid glyph in Text Muted with the word or the ring.

## D1: Welcome and onboarding (2 Oct 2026)

- Order (REDESIGN-PROMPT §4.2): Welcome → (Create account / Sign in → account step, or Continue without an account) → carousel → consent → calendar (only if allowed) → notifications pre-prompt → Today. Onboarding completes on the pre-prompt, not on consent.
- Welcome A, "Dawn over the week": the wordmark in the `score` style (Manrope 800, 72; capped at 1.3× like the dial), the tagline in Text Muted, the demo week's seven plan glyphs rising through a thin horizon line, a faint sage "first light" glow (0.14). 1.1 s, once per launch (G52), tap to skip, Reduce Motion shows the end state. Liquid metal on "Create account" waits for D3.
- **Left-aligned wordmark and tagline**, against the centred Step 1 wireframe: CLAUDE.md centres only the dial and empty-state art.
- Per white-space audit E: the three actions sit together under the horizon (4 pt apart, 48 pt targets), and the info icon moved to the top right. The carousel has a plain canvas behind every slide, not the dimmed chips and glyphs §4.2 describes, because they competed with the focal object.
- Carousel: slide 1 is the demo's first-morning result from the fixtures (Train light, 51, Likely 34–68); slide 2 the Week strip; slide 3 the log's three questions. Skip is always visible; screen readers hear "Page n of 3". Titles cap at 2× text, like screen titles.
- Stepper: guest 3 steps (consent, calendar, notifications); account path 4 (account first). The total stays fixed when calendar is declined, so the count jumps from 1 to 3 rather than changing while consent is being answered.
- Notifications pre-prompt: "Allow notifications" (primary) and "Not now" (text). Unlike the per-purpose consents, this is a system permission, not health-data consent, so the equal-weight rule does not apply; "Not now" is still a full 48 pt target. The real system prompt runs only when the demo clock is off and not on the web.
- The Legal sheet is glass, Text High only (Text Muted on glass is 2.11:1). It covers terms and privacy only and says that health-data consent is asked separately.

## D2: Profile and mocked auth (2 Oct 2026)

- The gear on Today, Week and Progress is now a profile button (Q4): a 36 pt circle in a 48 pt target with the photo, the initials, or a person icon for a guest. Settings folds into Profile; its consent controls are the Privacy screen (`/privacy`), opened from Profile.
- Mocked auth: accounts made this launch are kept by name and email only. Passwords are checked for 8 characters and never stored. Sign in finds an account by email; an unknown email gets an inline message. In the demo build, "Continue as Marta" (and signing in with marta@example.com) uses the demo account. Forgot password never says whether an account exists.
- **The name on the profile arc is set in capitals**: the one display exception to sentence case (REDESIGN-PROMPT §5). Screen readers hear the name once, as plain text, with the email.
- The profile header is centred as one composition (backdrop, arc, capsule), like the dial; everything below it is left-aligned. The backdrop is the Welcome horizon at 30% with no glow (no glow on Profile). The capsule has a canvas fill with a control-stroke outline ("hollow"), so the horizon line does not cross the initials.
- A guest sees what an account adds and "Create account" / "Sign in" at the top (white-space audit E: no empty capsule), so the Account section is not repeated for guests.
- Profile defaults come from the fixture calendar, not invented values: 4 sessions (Push, Pull, Heavy legs, Full body), 4 training days, usually 18:00, work days Mon–Fri. Profile says these settings do not change plans yet (G55).
- Session renames reach Week (detail and the move suggestion) and the evening log through a display-name map (Q7). Removing a session from the list only drops its rename; the calendar still decides the week.
- The email under the avatar stops growing at 2× text: an address has no spaces, so it cannot wrap.
- Destructive actions: a new text-only `destructive` button in Status Over (5.45:1). Delete my data asks in a sheet and then really clears the in-memory state; Delete account needs DELETE typed. Both follow CLAUDE.md (text-only with confirmation).
- Notifications on Profile: morning plan and evening reminder switches, with 20:00, 21:00 or 22:00 for the reminder (21:00 by default, a proposal; G53). Allowing notifications in onboarding turns both on.
- New components: TextField (label above, inline error with icon, show/hide for secure entry), Checkbox (unchecked by default), SwitchRow, ProfileButton. The snappy slider, animated checkbox and spotlight surfaces are D3.
- expo-image-picker installed (approved 1 Oct): photo library only, camera disabled in the plugin config; the photo lives in memory.
