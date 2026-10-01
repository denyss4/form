# FORM: Redesign Prompt (final): dark premium, "Lichen" theme

> **Final version. Replaces v1–v4 entirely.** The Komanda Media, navy and Pre-dawn palettes are all withdrawn.
>
> **How to run**
> 1. Save this file as `docs/prompts/REDESIGN-PROMPT.md`, replacing any earlier version.
> 2. Also save:
>    - `docs/references/white-space-guidelines.md`
>    - `docs/references/profile/any-distance-47.png` and `any-distance-61.png` (profile design references)
>    - Delete `komanda-theme.css` and `theme.css` if present: there is no third-party theme any more
>    - the reference screenshots, in `docs/references/redesign/`
> 3. Start Claude Code with `claude --permission-mode plan` and send:
>    `Read docs/prompts/REDESIGN-PROMPT.md in full and follow it, starting with Step 1.`
> 4. Use high effort for Step 1.

---

<role>
You are the senior product designer and design engineer on Form. You are moving the app to a dark, premium visual system built on the user's "Lichen" theme and the white-space guidelines, and adding onboarding, auth and a full user profile. You are objective and critical. Every weakness you name comes with a concrete alternative or a question.
</role>

<priority>
1. The user's latest instruction in chat.
2. This file. On visual design, it wins over `MASTER_PROMPT.md`.
3. `DECISIONS.md`, `docs/specs/SPEC-today-week-v2.md`, `MASTER_PROMPT.md`. Product, data, health-language, consent and scope rules still apply in full.
4. `docs/references/white-space-guidelines.md`, which governs composition and density.
5. Skills and existing code.
If sources conflict, quote both passages and ask. Never resolve a conflict silently.
</priority>

<user_decisions date="2026-10-01">
- **Theme:** "Lichen", the user's own (section 1): a muted sage accent on dark stone. Dark is the default and the demo theme. The Train hard and Train light colours are proposed in section 1.4, to be confirmed in Step 1.
- **Profile design:** follows the Any Distance references for layout and feel (section 5), not content.
- **Premium look:** glass and depth effects are allowed under the rules in section 2. The white-space guidelines apply throughout, on black.
- **Fonts do not change:** Manrope for display, plus the body font in `DECISIONS.md`. Ignore any font the theme names.
- **Dial:** draw the active arc on top of the inactive track (z-order).
- **Spotlight card:** the hover effect becomes an animation on press.
- **Welcome background:** option (a), ambient light and Form's own glyphs, made more original (section 4.1). **No photos of faces or bodies.**
- **Components:** the recommended picks are accepted. Rainbow button and radar chart are rejected; the todo list is dropped unless a real use appears.
- **Scope:** no deadline. All phases, including former P2 items, are in scope.
- **Auth:** Sign in and Sign up live inside the Profile section, alongside a full user page for viewing, editing and adding personal information (section 5).
</user_decisions>

---

## 1. Tokens: the "Lichen" theme (the user's own)

**This replaces every earlier palette.** "Lichen" is a muted sage accent on dark stone surfaces, with a cool off-white for text. The user supplied the seven core tokens; the derived tokens fill gaps the core set doesn't cover (sunken, hairline, control stroke, pressed). All ratios were computed with the WCAG 2.2 formula; re-measure any value you change. The radius tiers stay: `radius.control` 12, `radius.surface` 16, `radius.sheet` 24 (top corners), `radius.pill` full.

### 1.1 Core tokens (from the user)

| User token | Hex | Form token | Verified contrast |
|---|---|---|---|
| Surface 100 | `#16181A` | `color.bg.canvas` | — |
| Surface 200 | `#232528` | `color.bg.raised` | 1.16:1 vs canvas, so separate surfaces with space plus a hairline |
| Brand Accent | `#b3be8b` | `color.action.primary`, `color.focus.ring`, `color.state.selected`, `color.status.success` | 9.03:1 on canvas, 7.80:1 on raised |
| Data Muted | `#94A8B6` | `color.chart.neutral` (non-plan chart data only) | 7.24:1 on canvas, 6.25:1 on raised |
| Status Over | `#C87A65` | `color.status.attention` (errors, destructive text, over-limit states) | 5.45:1 on canvas, 4.70:1 on raised |
| Text High | `#F5F5F7` | `color.text.primary` | 16.35:1 on canvas, 14.11:1 on raised |
| Text Muted | `#8E9298` | `color.text.secondary` | 5.69:1 on canvas, 4.91:1 on raised |

### 1.2 Derived tokens

| Name | Hex | Form token | Verified contrast |
|---|---|---|---|
| Sunken | `#1d1f22` | `color.bg.sunken` (input fill, pressed rows) | Text High 15.17:1, Text Muted 5.28:1 |
| Hairline | `#2e3135` | `color.stroke.hairline`, **decorative only** | 1.36:1 |
| Control stroke | `#7d828a` | `color.stroke.control` (input borders, outlined pills, empty dial track) | 4.60:1 on canvas, 3.97:1 on raised |
| Accent pressed | `#9ba47a` | `color.action.pressed` | Surface 100 text on it 6.77:1 |

### 1.3 Rules for the core tokens
- **Primary button:** a Brand Accent fill with Surface 100 text (9.03:1). Pressed: Accent pressed. Secondary: a control-stroke outline with Text High. Focus ring: 2 px Brand Accent with a 2 px offset.
- **Sage appears at most once per screen** as an action. It is never a plan colour and never decoration.
- **Status Over** is the single attention colour (errors, destructive text, over-limit states). It is always paired with an icon and words, never colour alone. Destructive actions are text-only and confirmed.
- **Text Muted never sits on glass:** even at 88% tint it reaches only 4.0:1. Glass carries Text High only, with a tint of at least **0.70** (6.05:1 worst case over white).
- **Welcome horizon glow:** Brand Accent at very low opacity ("first light"). **Today glow:** the plan colour at low opacity.

### 1.4 Plan colours
Plan colours must stay distinct from Brand Accent, Data Muted and Status Over, including for colour-blind users. I tested every combination; only one set keeps all seven colours clearly apart:

| Plan | Hex | On canvas |
|---|---|---|
| Train hard (Marigold) | `#faab3f` | 9.29:1 |
| Train light (Butter) | `#eada78` | 12.54:1 |
| Recover (Sea glass) | `#75d1c5` | 9.90:1 |
| Deep-work day (Iris) | `#b0a6ed` | 8.07:1 |

The closest pair is Iris against Data Muted under deuteranopia, at ΔE 7.5. ΔE is the OKLab distance × 100, and around 5 is noticeable.

**Trade-off to raise in Step 1:** with this theme, cooler or pinker Train colours (Rose, Coral, Orchid) collide with Data Muted or Brand Accent under colour-blindness simulation, dropping to ΔE 2.0–3.7. The warm Marigold and Butter pair is the only robust choice, and it is close in family to the Ember and Sun pair the user rejected earlier. Show it on the Today and Week wireframes and confirm it with the user. If the user rejects it, the alternative is to change Data Muted (not the plan colours) and re-test.

Run the 5-second test on Train hard and Train light. Glyphs and text labels remain the non-colour cues.

## 2. Premium rules: white space on black, plus restrained glass

### 2.1 White-space principles applied to Form
Source: `white-space-guidelines.md`. It contains no numbers, so **all spacing comes from the existing 4-pt token scale** (4, 8, 12, 16, 24, 32, 48, 64). Premium means using the larger steps between groups. It never means new values.

| Guideline | Form rule |
|---|---|
| Density calibration (premium, curated, less price-sensitive) | Low density: one idea per section and one primary action per screen. Sections are separated by 48–64 |
| Gallery isolation | The dial on Today and the wordmark on Welcome sit alone in a large field. No other element within 32 of the dial |
| Small portion, large plate | The Profile header, empty states and the morning rating step occupy a small part of the screen. Don't stretch content to fill space |
| Figure-ground simplification | Behind any focal subject: a plain canvas or one soft glow. No photographs and no textures |
| Space as connector | Group by proximity first. **Remove hairline dividers wherever spacing already groups the content** (driver rows, Profile sections, the Week detail). Keep a divider only where rows are dense and tappable |
| Anti-pattern: ornament overload | Effects never "prove" value. Each effect must do a job: depth on a floating layer, feedback on a press, or focus on one element |
| Anti-pattern: empty space | Every large empty area must point the eye at the focal element. If it doesn't, it reads as missing content, so move content into it |

### 2.2 Glass (`expo-blur`, dark tint)
- **Allowed:** the floating tab bar, the top bar when content scrolls under it, bottom sheets (evening log, legal), and the centre morph modal.
- **Not allowed:** content surfaces, rows, the dial, glass on glass, or more than two blurred surfaces visible at once.
- **Tint opacity:** glass carries **Text High only**, with a canvas tint of at least **0.70** (6.05:1 over pure white behind the blur, the worst case). **Text Muted never sits on glass**: at 0.88 it still reaches only 4.0:1.
- **Fallbacks:** with `isReduceTransparencyEnabled` on, use a solid `color.bg.raised`. On Android, use a solid surface whenever blur drops below 60 fps.
- **Edges:** a 1 px `color.stroke.hairline` border plus an optional 1 px top inner highlight at 6–8% foreground. No outer glow.

### 2.3 Light
- At most **one ambient glow per screen**, a radial gradient behind the focal element only.
  - Today: the plan colour at low opacity behind the dial.
  - Welcome: the composition in section 4.1.
  - Everywhere else: no glow.
- Never more than one glow, never neon outlines, never a gradient on text.

---

## 3. ScoreDial fix
Render order:
1. The full 0–100 inactive track in `color.stroke.control`.
2. The active arc on top, with a round end cap.
3. The likely-range band last.

Check scores 0, 1, 51, 99 and 100 for artefacts at both caps. Apply gallery isolation: nothing within 32 of the dial.

---

## 4. Onboarding and Welcome

### 4.1 Welcome: "Dawn over the week" (default concept)
Not a photo. The composition is built from Form's own objects:
- A thin horizontal light line across the lower third of the screen: the horizon.
- The seven days of a sample week sit just below the horizon as plan glyphs in their colours, at low opacity.
- On first launch, they rise one by one, left to right, like a sunrise over the week. Above them, the "Form" wordmark assembles letter by letter. The whole sequence takes **≤ 1.2 s** and plays once per install. Tap to skip.
- **End state:** the wordmark is isolated in the upper field, the tagline sits below it, the glyph row rests on the horizon, and a faint Brand Accent (sage) glow comes from the horizon at very low opacity ("first light"). Below that: "Create account" (primary), "Sign in" (text), "Continue without an account" (text), and an info icon that opens the Legal sheet.
- **Reduce Motion:** the end state, static.
- **Alternative concept** for the user to compare in Step 1: **"Plan constellation"**. Day-type and plan glyphs drift slowly in depth and then settle into a single row that spells out one week. Wireframe both; the user chooses.

### 4.2 Remaining onboarding screens
| Screen | Rules |
|---|---|
| **Legal sheet** | Glass bottom sheet, one sentence, outlined pill links with chevron icons. Covers terms and privacy only. **Never health-data consent**, which stays a separate per-purpose screen with nothing preselected. The ToS and Privacy texts don't exist yet: log a GAP |
| **Carousel** | At most 3 slides, an always-visible "Skip", page dots, and VoiceOver announcing "Page 1 of 3". Background: Form's chips and glyphs, dimmed. Slide 1 carries the whole value on its own |
| **Stepper** | Shown from account creation through consent, calendar and notifications |
| **Notifications pre-prompt** | Copy states the purpose: "Get your plan each morning and a reminder to log at night." The illustration is a notification card built from Form components. No marketing language. The real OS prompt needs `expo-notifications` (approval required) |

Order: Welcome, then (Create account, Sign in, or continue without an account), then the carousel, consent, calendar connect, notifications, and finally Day 1 on Today.

---

## 5. Profile, auth and the user page

<entry_point>
The gear at the top right of Today becomes a profile button: the user's photo or initials in a circle, at least 44 pt. It opens Profile as a pushed screen. The three-tab bar stays. A fourth tab is the alternative; raise it in Step 1 only if you have a reason.
</entry_point>

<guest_mode>
- **Recommended: Form works without an account.** Scoring runs on the device, and the App Store review guidelines (5.1.1) don't allow requiring sign-up for features that don't depend on an account. Confirm this in Step 1.
- A guest's Profile shows a short explanation of what an account adds (for example "Keep your history if you change phones"; this is a GAP until sync exists), then "Create account" (primary) and "Sign in" (text). Guest settings (training, notifications, privacy) still work.
</guest_mode>

<auth mocked="true">
- **No backend, no network and no persisted passwords.** Everything lives in memory, and relaunching resets it.
- **Sign up:** name, email, password (secure entry with a show/hide toggle), and an unchecked terms checkbox that links to the Legal sheet. Validate format only, inline, in plain words.
- **Sign in:** email, password, and "Forgot password?" (a mocked screen).
- In demo builds only, "Continue as Marta" appears.
- Base the visuals on `premium-auth`, `v-label-12` and `v-checkbox-6`, rebuilt in React Native.
- No social sign-in. On iOS, any third-party sign-in requires Sign in with Apple; add that to LATER.md.
</auth>

<user_page>
**View mode**, top to bottom, with sections separated by space and no dividers:
1. **Header** (design reference: `docs/references/profile/any-distance-*.png`; take the design only, not the content):
   - **Backdrop:** the Welcome "Dawn over the week" horizon, dimmed to about 30% behind the header and fading into Surface 100 by the middle of the avatar. It is static, with no people and no photos.
   - **Avatar:** a **capsule (stadium) shape**, about 112 × 168 pt, echoing the pill buttons and the week-strip columns. It shows the photo, or initials in Manrope 600 on a Hollow fill.
   - **Name:** set on a gentle **arc** above the avatar, in Manrope 600, letter-spaced. This is the one display exception to the sentence-case rule: the name may be set in capitals here only. Record the exception in DECISIONS.md. VoiceOver reads the name once, as plain text.
   - **Under the avatar:** the email in Text Muted. Don't use a monospace handle; Form has no public handles.
   - **Edit:** a "Edit" text button with a pencil icon at the top right, at least 44 pt.
   - **This week:** a horizontal row of 7 small capsules under the header, each holding that day's plan glyph in its plan colour, with today marked. It is real data from the plan engine, not medals or badges. Tapping it opens Week.
   - The header is gallery isolation: nothing else within 32 pt of the avatar.
2. **Training:** training days per week, usual training time, and **my sessions** (the session names Form shows in Week, such as Push, Pull and Heavy legs). Sessions can be **added, renamed, reordered and removed** here.
3. **Work pattern:** usual work days. This helps Form predict Work days when the calendar has no events.
4. **Connections:** calendar and Apple Health or Health Connect, each with its status (mocked).
5. **Notifications:** morning plan on or off, plus the evening reminder time.
6. **Privacy:** consents per purpose (view, change, withdraw), "Export my data" and "Delete my data" (screens only, mocked).
7. **Account:** change email, change password (mocked), sign out, and "Delete account" (required in-app wherever account creation exists; destructive style, confirmation by typing "DELETE"). A guest sees "Create account" and "Sign in" here instead.
8. **About:** the Legal sheet and the app version.

**Edit mode:** a separate screen with "Cancel" and "Save".
- Inline validation.
- Leaving with unsaved changes asks for confirmation.
- "Saved." confirmation using the success haptic.
- Photo: "Add photo" or "Change photo" via `expo-image-picker` (approval required), held in memory, with "Remove photo". The initials fallback is always available.

**Field rule (data minimisation, GDPR Art. 5(1)(c)):** every field must have a stated use in the app. Use this table:

| Field | Use in Form | Include |
|---|---|---|
| Name, photo | Greeting, profile | Yes |
| Email, password | Account (mocked) | Yes |
| Training days and usual time | Plan engine and Week | Yes, if the engine reads them. Otherwise, store them and log a GAP for Person B |
| Sessions list | Session names in Week and in the evening log | Yes |
| Work days | Day-type prediction without calendar events | Yes, with the same GAP condition |
| Language (English or Polish-ready) | UI strings | Yes |
| Date of birth, height, weight, sex | **No use in the model or the UI** | **No.** Weight is also excluded by the disordered-eating safeguards |

**Components:** `snappy-slider` for training days, `v-label-12` and `textarea-08` for fields (textarea only where free text has a use), `v-checkbox-6` for toggles that need it, and `spotlight-card` on press for section surfaces (one level only, never nested).
</user_page>

---

## 6. Components (one per section, all rebuilt in React Native)
Before building each component, read its source and demo, write its intent in one line, then rebuild it with React Native primitives, Reanimated, `react-native-svg`, `expo-blur` and `expo-linear-gradient`. Use Skia only if that is impossible. Use Form tokens, never the component's own colours. Hover becomes an animation on press.

| Section | Component | Use |
|---|---|---|
| Buttons | **Highlight button** (system primary and secondary) and **liquid metal** (Welcome "Create account" only) | The highlight sweeps once on press, ≤ 300 ms. Liquid metal settles to a static state with Reduce Motion |
| Cards | **Spotlight card** | The light starts at the press point and fades within 200 ms of release. Used on the Week detail and Profile sections |
| Loader | **Progressive flux loader** | For waits over 1 s only. Static icon and text with Reduce Motion |
| Charts | **Bar chart** (`react-native-svg`) | Progress. Vertical axis, one bar per data point, flat tops, chart tokens |
| Checkbox | **v-checkbox-6** | Sign-up terms and settings. Unchecked by default |
| Modal | **Center morph modal** | A Week strip column morphs into the day detail. **This changes spec R3, so it needs the user's approval in Step 1** |
| Date picker | **Dropdown range date picker** | Progress history. **Build it only when more than one week of real data exists.** Until then, log a GAP. Scope being unlimited does not create data |
| Auth | **Premium auth** | Sign up and Sign in |
| Fields | **v-label-12, textarea-08** | Auth, Profile, and the optional note under "Anything unusual? Yes" (collapsed; the 3-tap rule stays) |
| Stepper | **Stepper** | Onboarding |
| Slider | **Snappy slider** | Profile training days. **Never the morning rating** |
| Tabs | **Slide tabs** | Progress: "Plan fit" and "Felt vs forecast" |
| Rejected | Rainbow button, radar chart, checkbox todo list | Reasons in `DECISIONS.md` |

New dependencies need approval in Step 1: `expo-blur`, `expo-linear-gradient`, `expo-image-picker`, `expo-notifications`, and `@shopify/react-native-skia` only if needed. Report the bundle impact of each.

---

## 7. Motion, accessibility and performance
- **Orchestrated moments:** the Welcome sequence (once per install) and the morning reveal (once per day). Nothing else is choreographed.
- Every new screen gets the six states where they apply.
- Contrast is measured on dark, including text on glass against its worst case.
- Touch targets are at least 44 pt. Every screen is checked at the largest Dynamic Type size, and with Reduce Motion and Reduce Transparency on.
- Today, Week and Profile keep 60 fps while scrolling with blur on, on the demo iPhone.

---

## 8. Step-by-step

### Step 1: Plan Mode (read-only)
- **A.** The status of the current v2 item, and the order of R1–R3 relative to this redesign, so no screen is built twice.
- **B.** Confirm the token table in section 1. Add colour-blindness simulations of the four plan colours together with Brand Accent, Data Muted and Status Over.
- **C.** A component audit: intent, how it's built in React Native, dependencies, hours, and accept, adapt or reject.
- **D.** ASCII wireframes for:
  - Welcome, both concepts;
  - Legal sheet, carousel slide 1, notifications pre-prompt;
  - Profile as a guest and signed in;
  - Edit profile, Sign up, Sign in;
  - Today and Week on dark.
- **E.** A white-space audit of D against the checklist in guideline 2.4. For each screen, name the focal element, which dividers are removed, and which large empty areas exist and what each one directs the eye to.
- **F.** A list of the parts that could read as generic dark-premium defaults, and how you made each one specific to Form.
- **G.** Questions, at most 7, each with a recommended answer: confirmation of the Marigold and Butter Train colours (section 1.4, shown on the wireframes), guest mode, the morph modal changing R3, a fourth tab or the header button, the Welcome concept, dependency approval, and whether the plan engine reads the training and work fields.
- **H.** Phases:

| Phase | Content |
|---|---|
| D0 | Tokens, glass, light rules, dial fix, divider removal on Today and Week |
| D1 | Welcome, Legal sheet, carousel, stepper, notifications pre-prompt |
| D2 | Profile (guest and signed in), Sign up, Sign in, Edit profile, account and privacy screens |
| D3 | Component upgrades across all screens, including liquid metal, spotlight and morph modal (if approved) |
| D4 | `/design:design-critique` on dark screenshots, white-space audit, colour test, demo recording redone |

End Step 1 with:
`Plan ready. Reply "APPROVED" (optionally with changes) to start. I will not create or modify any file until then.`

### Step 2: After approval
- Work one phase at a time, with an iPhone check after each.
- `npm run check` and `npm test` must pass before every stop.
- Screenshots go to `docs/screens/redesign/`: dark, largest Dynamic Type, Reduce Motion, Reduce Transparency.
- Update `DECISIONS.md` (this prompt's decisions and the rejected components), `GAPS.md` (ToS and Privacy texts, sync, notifications, auth, engine use of the profile fields) and `LATER.md` (Sign in with Apple, the date picker until data exists).
- Nothing unapproved: no features, files or dependencies.
