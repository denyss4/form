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
| G9 | Dark control stroke on raised is 2.91:1 (< 3) | Dark inputs | A | Value needed, approval required |
| G10 | Calendar provider for the mocked OAuth | Onboarding | A | Ask before P2 |
| G11 | "Once per day" reveal needs persistence, and no storage library is listed | Today reveal | A | In-memory plus a dev reset for the demo. A storage dependency needs approval |
| G12 | Marta's scripted week (`/fixtures`) does not exist yet | All demo data | B | Built in P1 from real `predict` runs |
| G13 | No OFL licence file in `/Fonts`. `OFL.txt` not added: downloading it from upstream needs the user's OK, and I will not write licence text from memory | Fonts | User | Approve the download, or drop the files in |
| G14 | Two `.mov` inspiration files could not be viewed | Motion reference | User | Ask which motion to take |
| G15 | 21st.dev pages gave no detail for `spotlight-card` and `course-design-cards` | Component audit | User | Rejected as unverified; check the live previews if wanted |
| G16 | Master §7 copy example cites sleep as a reason; the model says sleep matters little | Copy | A | Explanations use returned drivers only |
| G17 | Which Expo Go the demo phone can install (SDK support) | Demo device | User | P0.1 gate |
| G18 | App icon, adaptive icon and splash are Expo placeholders (`assets/`) | Store and launch | A | Replace after the identity is set; generated assets go in `assets/generated/LOG.md` |
| G19 | Tabular digits, fonts and layout were verified in the web preview only. Native rendering and largest Dynamic Type are unverified | Type | User | Open `/gallery/type` on the demo phone and compare digit widths |
