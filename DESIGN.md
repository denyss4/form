---
name: Form
description: Plan your week around how you'll feel.
colors:
  surface-100: "#121212"
  surface-200: "#1E1E1E"
  sunken: "#181818"
  text-high: "#F5F5F7"
  text-muted: "#8E9298"
  control-stroke: "#808080"
  hairline: "#2C2C2C"
  sage: "#b3be8b"
  sage-pressed: "#9ba47a"
  status-over: "#C87A65"
  data-muted: "#94A8B6"
  marigold: "#faab3f"
  butter: "#eada78"
  sea-glass: "#75d1c5"
  iris: "#b0a6ed"
typography:
  display:
    fontFamily: "Manrope-ExtraBold, Manrope, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 800
    lineHeight: "72px"
    letterSpacing: "-1.5px"
    fontFeature: "tnum"
  headline:
    fontFamily: "Manrope-Bold, Manrope, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "34px"
    letterSpacing: "-0.6px"
  title:
    fontFamily: "Manrope-SemiBold, Manrope, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "26px"
    letterSpacing: "-0.3px"
  plan:
    fontFamily: "Manrope-Bold, Manrope, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: "22px"
    letterSpacing: "-0.2px"
  body:
    fontFamily: "SourceSans3-Regular, 'Source Sans 3', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-strong:
    fontFamily: "SourceSans3-SemiBold, 'Source Sans 3', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  label:
    fontFamily: "SourceSans3-Regular, 'Source Sans 3', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
rounded:
  control: "12px"
  surface: "16px"
  sheet: "24px"
  full: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  xxxl: "64px"
  margin: "20px"
components:
  button-primary:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.surface-100}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "48px"
  button-primary-pressed:
    backgroundColor: "{colors.sage-pressed}"
    textColor: "{colors.surface-100}"
    rounded: "{rounded.control}"
    height: "48px"
  button-secondary:
    textColor: "{colors.text-high}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "48px"
  button-text:
    textColor: "{colors.text-high}"
    typography: "{typography.body-strong}"
    height: "48px"
  choice-option:
    textColor: "{colors.text-high}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "48px"
  choice-option-selected:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.surface-100}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "48px"
  sheet:
    backgroundColor: "{colors.surface-200}"
    rounded: "{rounded.sheet}"
    padding: "8px 20px 16px"
  day-detail:
    backgroundColor: "{colors.surface-200}"
    rounded: "{rounded.surface}"
    padding: "16px"
  week-column-selected:
    backgroundColor: "{colors.surface-200}"
    rounded: "{rounded.control}"
    width: "50px"
  rating-target:
    textColor: "{colors.text-high}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    height: "48px"
  fit-segment:
    backgroundColor: "{colors.text-high}"
    rounded: "{rounded.full}"
    height: "12px"
---

# Design System: Form

## Overview

**Creative North Star: "The Night Planner"**

Form is a calm planning desk at the end of the day, now in "Lichen": a muted sage on dark stone. One plan is set down quietly, and colour appears only where it carries meaning. The plan's colour marks the dial, Today's title, the glyphs in the Week strip and a faint glow behind the score. Sage marks the one action on a screen and the thing you chose. Everything else is off-white text on stone. The system is calm, precise and honest. It shows a likely range instead of a falsely exact number, says which inputs are missing, and names the reasons.

Density is low and the rhythm is generous. Each screen has one focal element: the dial on Today, the seven-day strip on Week, the fit sentence on Progress. Space groups the content and dividers are removed wherever spacing already does the work (white-space guidelines). Depth comes only from floating layers: the glass tab bar and the bottom sheet. Manrope, set tight, carries what you decide on; Source Sans 3 carries what you read.

Dark Lichen is the app theme (approved 1 Oct 2026). The previous light palette is kept for the gallery only and is not maintained.

**Key Characteristics:**
- Dark stone surfaces; sage only for the one action and for selection; plan colours only for plans.
- One focal element per screen, isolated by space (nothing within 32 pt of the dial).
- Honest numbers: a range, a missing-inputs line when inputs are missing, signed drivers.
- Glass only on floating layers, with Text High only.
- Tight display type, open body type, 48 pt targets everywhere.

## Colors

Dark stone with off-white text, one sage accent, and four plan hues that each mean exactly one plan.

### Primary
- **Sage** (#b3be8b): the primary button fill (canvas text on it, 9.51:1), its pressed state (#9ba47a), focus rings, selected choice pills, the active tab icon, the outline on the two days a move would change. At most once per screen as an action. Never a plan colour, never decoration.

### Secondary
The four plan hues. Each is the colour of one plan and nothing else.
- **Marigold** (#faab3f): Train hard.
- **Butter** (#eada78): Train light.
- **Sea Glass** (#75d1c5): Recover.
- **Iris** (#b0a6ed): Deep-work day.

### Tertiary
- **Status Over** (#C87A65): errors, destructive text and over-limit states, always with an icon and words.
- **Data Muted** (#94A8B6): non-plan chart data only, never next to Iris in one chart.

### Neutral
- **Surface 100** (#121212): the canvas behind every screen.
- **Surface 200** (#1E1E1E): the one raised level: sheets, the selected Week column, the day detail, the tab bar's solid fallback.
- **Sunken** (#181818): input fills and pressed rows.
- **Text High** (#F5F5F7): text, icons, filled Plan Fit segments, the today underline; the only text on glass.
- **Text Muted** (#8E9298): secondary text, captions, estimated plans. Never on glass.
- **Control Stroke** (#808080): outlined pills, secondary button outlines, the dial track, the empty Day 1 dial.
- **Hairline** (#2C2C2C): decorative edges only (the glass bar's top edge).

### Named Rules
**The Plan Owns Its Colour Rule.** A plan hue appears only where that plan is shown: the dial arc and range band, Today's title, the plan glyph, and the Today glow. In lists and details the plan's word is plain text.

**The One Sage Rule.** Sage marks the single action on a screen and the state of what you chose. A second sage button on one screen is a bug.

**The Never Alone Rule.** A plan is never colour alone: every plan shows its glyph (Dumbbell, Footprints, Moon, Focus) and its label. Estimated days add a hollow ring and the word "Estimated".

**The Glass Carries Text High Rule.** Glass sits at a canvas tint of at least 0.70, and only Text High goes on it (6.43:1 at the worst case). Text Muted on glass drops to 2.11:1.

## Typography

**Display Font:** Manrope (ExtraBold 800, Bold 700, SemiBold 600; system sans fallback)
**Body Font:** Source Sans 3 (Regular 400, SemiBold 600; system sans fallback)

**Character:** Manrope is geometric and decisive, set tight for the things you act on; Source Sans 3 is open and plain for the things you read. The fonts are fixed by the user.

### Hierarchy
- **Display** (800, 72/72, −1.5, tabular): the Form score inside the dial only; scales to 1.3× at most.
- **Headline** (700, 28/34, −0.6): one screen title per screen; on Today it is the plan, in its hue, with its glyph. Stops growing at 2×.
- **Title** (600, 20/26, −0.3): section headings and the sheet title.
- **Plan** (700, 17/22, −0.2): a plan label where the plan is the subject.
- **Body** (400, 16/24): sentences, sessions, the plan word in lists and details.
- **Body Strong** (600, 16/24): buttons, driver and day names, signed values, the Week strip dates.
- **Label** (400, 13/18): dates, captions, tags, legends, the Week strip day letters.

### Named Rules
**The Decide and Read Rule.** Manrope never sets a paragraph and is never italic.

**The Tabular Rule.** Every number that changes uses tabular figures.

**The Wrap Rule.** Dynamic Type stays on; text wraps and is never truncated. The exceptions are chrome that cannot wrap: tab labels stop at 1.3×; the Week strip's letters and dates stop at 2× and its glyphs drop to the small size.

## Layout

A single left-aligned column with a 20 pt margin on both sides, on a 4 pt base (4, 8, 12, 16, 24, 32, 48, 64). Inside a group 12 to 16; between groups 32; before a new section 48. Only the ScoreDial and empty-state art are centred.

Each tab screen is a header (title, a one-line caption, the settings gear), then its focal element, then its groups. The tab bar floats on glass, so every tab screen reserves the bar's height at its bottom and its content scrolls under the glass. The Week strip is seven equal columns across the width (50 pt each at 390 pt).

### Named Rules
**The Space First Rule.** Group with space. Remove a divider wherever space already groups the content; keep one only where rows are dense and tappable.

**The Gallery Isolation Rule.** The focal element sits alone in its field: nothing within 32 pt of the dial on Today.

## Elevation & Depth

Flat content on stone, with two floating layers. The tab bar floats on glass (`expo-blur`, canvas tint 0.70, a hairline top edge; solid Surface 200 under Reduce Transparency and on Android). The bottom sheet sits on Surface 200 with a soft shadow and a scrim of the canvas at 72%. Content surfaces (the Week day detail) are Surface 200 with no shadow. One ambient glow is allowed per screen: on Today, the plan colour at 16% behind the dial, fading to nothing.

### Shadow Vocabulary
- **Sheet** (`shadow-color: #13263A; opacity 0.12; radius 24; offset 0 −8; elevation 16`): bottom sheets only.

### Named Rules
**The Float Only Rule.** Glass and shadow belong to floating layers only. Content never floats.

**The One Glow Rule.** At most one glow per screen, behind the focal element, in the plan's colour. No neon edges, no gradient text.

## Shapes

Corners follow hierarchy: controls and inputs 12 pt, the content surface 16 pt, sheets 24 pt on the top corners, and full pills for choices, the slider and Plan Fit segments. Lines are 1 pt hairlines for decoration and 2 pt outlines for anything interactive or meaningful (focus ring, today underline, the move outline). The dial is a 270° arc open at the bottom: the track first, the plan arc on top, the likely-range band last.

## Components

### Buttons
One sage action per screen; everything else quieter.
- **Shape:** 12 pt corners, 48 pt tall, 24 pt side padding.
- **Primary:** Sage fill with Surface 100 text; Sage Pressed while held. Full width in a footer or under the Week suggestion.
- **Secondary:** a 2 pt Control Stroke outline with Text High.
- **Text:** an underlined Text High label on the text margin, with a 48 × 48 target; also for destructive actions, behind a confirmation.
- **States:** press scales to 0.97 with 0.8 opacity in 100 ms; disabled at 40%; loading swaps the label for a spinner; focus is a 2 pt sage ring 2 pt outside.

### Chips (choice pills)
- **Style:** full pills, 48 pt tall, 12 pt side padding, a 2 pt Control Stroke outline, Text High label centred, 20 pt kept for the checkmark on each side.
- **State:** selected fills Sage with a check and Surface 100 text. Pairs (Not now / Allow) and 2 × 2 grids keep equal weight; nothing is preselected.

### Cards / Containers
One content surface: the Week day detail (Surface 200, 16 pt corners, 16 pt padding, no shadow). Spotlight-on-press arrives in D3. The bottom sheet is the only other container.

### Inputs / Fields
- **Morning rating:** eleven 51 × 48 pt targets in two rows (0–5, 6–10, same column widths), 12 pt corners, Control Stroke outline. No default value; one tap records and starts the reveal; "Skip to my plan".

### Navigation
The platform tab bar (Today, Week, Progress) floating on glass. Labels are Text High (semibold when active); the active icon is Sage, the others Text High. Sub-screens show "Back" with an arrow.

### ScoreDial (signature)
A 264 pt dial: a 16 pt Control Stroke track, the plan-coloured arc on top with round caps, a 6 pt range band outside it, and the score in Display at the centre. The morning reveal (600 ms, once a day) draws the arc along its length while the number and band fade in; under Reduce Motion it is instant. Behind it, the plan glow.

### Week strip (signature)
Seven columns: day letter (Label, Text Muted), date (Body Strong), plan glyph in its hue. Today has a Text High underline under the date; the selected day has the Surface 200 fill; an estimated day has a Text Muted glyph and a hollow ring; while a move is offered, the two days it changes are outlined in Sage. Accepting the move sends the session's glyph across the columns with the standard spring. VoiceOver reads each column as "Thursday 8 October, Train hard".

### Plan Fit meter
One 12 pt pill per followed day: filled Text High means the plan fit, a 2 pt outline means too hard or too easy. "Did something else" days have no segment. The headline and the VoiceOver value are the same sentence.

### Driver row
An up or down arrow, the driver's name (Body Strong) with its basis (Label, Text Muted), and the signed value (Body Strong, tabular). 16 pt between rows, no dividers.

## Do's and Don'ts

### Do:
- **Do** keep a plan hue to the plan: the dial, Today's title, the glyph, the Today glow (The Plan Owns Its Colour Rule).
- **Do** give every plan its glyph and its word (The Never Alone Rule).
- **Do** use Sage for the one action and for selection only (The One Sage Rule).
- **Do** put only Text High on glass, at a 0.70 tint or more (The Glass Carries Text High Rule).
- **Do** use 48 between sections, 32 between groups, 12 to 16 inside a group, and a 20 pt margin.
- **Do** keep every target at least 48 pt and every state (default, pressed, focused, disabled, loading) designed.

### Don't:
- **Don't** change the fonts; Manrope and Source Sans 3 are fixed by the user.
- **Don't** put Text Muted on glass, or glass on content.
- **Don't** add a second glow, a gradient on text, or a neon edge (The One Glow Rule).
- **Don't** draw a divider where space already groups the content (The Space First Rule).
- **Don't** truncate text; wrap it (The Wrap Rule).
