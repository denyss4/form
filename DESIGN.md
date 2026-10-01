---
name: Form
description: Plan your week around how you'll feel.
colors:
  night: "#0E1B2A"
  dusk: "#172A3E"
  moonlight: "#E8EEF5"
  haze: "#9DB0C3"
  control-stroke: "#6B7C8D"
  ember-night: "#FF8A66"
  ochre-night: "#F2BE5C"
  tide-night: "#6FB9DB"
  iris-night: "#A99BF2"
  dawn: "#F3F6FA"
  white-raised: "#FFFFFF"
  ink: "#13263A"
  slate-text: "#4A5B6C"
  hairline-light: "#C9D3DD"
  ember: "#B83A1B"
  ember-field: "#FBE8E1"
  ochre: "#8A5A10"
  ochre-field: "#FAF0DA"
  tide: "#1F6280"
  tide-field: "#E1EEF4"
  iris: "#51479E"
  iris-field: "#ECE9F7"
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
  control: "10px"
  sheet: "20px"
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
    backgroundColor: "{colors.moonlight}"
    textColor: "{colors.night}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "48px"
  button-secondary:
    textColor: "{colors.moonlight}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "48px"
  button-text:
    textColor: "{colors.moonlight}"
    typography: "{typography.body-strong}"
    height: "48px"
  choice-option:
    textColor: "{colors.moonlight}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "48px"
  choice-option-selected:
    backgroundColor: "{colors.moonlight}"
    textColor: "{colors.night}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "48px"
  sheet:
    backgroundColor: "{colors.dusk}"
    rounded: "{rounded.sheet}"
    padding: "8px 20px 16px"
  slider-thumb:
    backgroundColor: "{colors.moonlight}"
    rounded: "{rounded.full}"
    size: "28px"
  fit-segment:
    backgroundColor: "{colors.moonlight}"
    rounded: "{rounded.full}"
    height: "12px"
---

# Design System: Form

## Overview

**Creative North Star: "The Night Planner"**

Form looks like a calm dark desk at the end of the day. One plan is set down quietly, and colour appears only where the plan lives: the dial's arc, the plan's title on Today, and one glyph per row in a list. Everything else is moonlight text on a deep navy night. The system is calm, precise and honest. It shows a likely range instead of a falsely exact number, says which inputs it used, and names the reasons.

Density is low and the rhythm is generous: one focal element per screen, grouped by space before lines, and lines before containers. There are no cards. Depth comes from one raised surface (the bottom sheet) and nothing else. Type does the work of hierarchy: Manrope, set tight, for what you decide on; Source Sans 3 for everything you read.

Dark is the app theme (user decision, 1 Oct 2026). The light theme ("Dawn" and "Ink") stays defined and is used in the gallery.

**Key Characteristics:**
- One flat dark canvas; colour reserved for the plan.
- One focal element per screen: the dial on Today, the plan glyphs on Week, the fit sentence on Progress.
- Honest numbers: a range, an inputs count, signed drivers.
- Tight display type, open body type, 48 pt targets everywhere.

## Colors

A deep navy night with moonlight text and four plan hues that each mean exactly one plan.

### Primary
- **Moonlight** (#E8EEF5): primary text, icons, the primary button fill, the selected choice pill, the slider's filled track and thumb, filled Plan Fit segments, focus rings.

### Secondary
The four plan hues. Each is the colour of one plan and nothing else.
- **Ember Night** (#FF8A66): Train hard.
- **Ochre Night** (#F2BE5C): Train light.
- **Tide Night** (#6FB9DB): Recover.
- **Iris Night** (#A99BF2): Deep-work day.

### Neutral
- **Night** (#0E1B2A): the canvas behind every screen, the tab bar and the Today field (the field equals the canvas in dark).
- **Dusk** (#172A3E): the one raised surface (bottom sheets), and decorative hairlines between list rows.
- **Haze** (#9DB0C3): secondary text, captions, the "Fit" status, estimated plans.
- **Control Stroke** (#6B7C8D): outlines of unselected choice pills, the slider track and its step dots. Shared with the light theme.

### Light theme (alternate)
Dawn (#F3F6FA) canvas, White (#FFFFFF) raised, Ink (#13263A) text and primary fill, Slate (#4A5B6C) secondary, Light Hairline (#C9D3DD). Plan hues Ember (#B83A1B), Ochre (#8A5A10), Tide (#1F6280), Iris (#51479E), each with a pale field tint behind the Today dial (#FBE8E1, #FAF0DA, #E1EEF4, #ECE9F7).

### Named Rules
**The Plan Owns Colour Rule.** A plan hue appears only where that plan is shown: the dial arc and range bracket, the plan title on Today, and the plan glyph in a list row. In lists the plan's word is plain moonlight text.

**The Never Alone Rule.** A plan is never colour alone. Every plan shows its glyph (Dumbbell, Footprints, Moon, Focus) and its label.

**The Night Field Rule.** In dark, Today has no colour field. The field token equals Night, because the dial's reveal cover is drawn in the field colour and must match what is behind it.

## Typography

**Display Font:** Manrope (ExtraBold 800, Bold 700, SemiBold 600; system sans fallback)
**Body Font:** Source Sans 3 (Regular 400, SemiBold 600; system sans fallback)

**Character:** Manrope is geometric and decisive, set tight for the things you act on. Source Sans 3 is open and plain, for the things you read. The fonts are fixed by the user.

### Hierarchy
- **Display** (800, 72/72, −1.5 tracking, tabular figures): the Form score inside the dial, and nowhere else. Scales to 1.3× at most so it never wraps.
- **Headline** (700, 28/34, −0.6): one screen title per screen. On Today it is the plan, in the plan's hue, with its glyph.
- **Title** (600, 20/26, −0.3): section headings ("What moved your score") and the sheet title.
- **Plan** (700, 17/22, −0.2): a plan label where the plan is the subject.
- **Body** (400, 16/24): sentences, sessions, list rows. About 70 characters per line at most.
- **Body Strong** (600, 16/24): button labels, driver names, day names, signed values.
- **Label** (400, 13/18): dates, captions, tags, legends, helper lines.

### Named Rules
**The Decide and Read Rule.** Manrope never sets a paragraph and is never italic. Anything longer than a label is Source Sans 3.

**The Tabular Rule.** Every number that changes uses tabular figures.

**The Wrap Rule.** Dynamic Type stays on. Text wraps and is never truncated; a label cell shrinks and wraps rather than running off the screen.

## Layout

A single left-aligned column with a 20 pt margin on both sides, on a 4 pt base (4, 8, 12, 16, 24, 32, 48, 64). Inside a group 12 to 16; between groups 32; before a new section 48. Only the ScoreDial and empty-state art are centred.

Each screen is a header (title, a one-line caption, the settings gear on the right), then groups separated by space, then hairlines between list rows. A footer action sits in the thumb zone above the tab bar with no rule between them. Safe areas come from the platform. Lists are rows, never grids: a day per row, the day name on the left, the plan glyph and word on the right, the session under it, the tags under that.

### Named Rules
**The Space First Rule.** Group with space; add a hairline only between rows of a list; add a container only for a sheet.

## Elevation & Depth

Flat. Depth is one step: the bottom sheet, on Dusk, with a soft shadow and a scrim that dims the screen behind it (Night at 72% in dark, Ink at 40% in light). Nothing else casts a shadow. Lists, messages and summaries sit directly on the canvas.

### Shadow Vocabulary
- **Sheet** (`shadow-color: Ink; opacity 0.12; radius 24; offset 0 −8; elevation 16`): bottom sheets only.

### Named Rules
**The One Lift Rule.** Only the bottom sheet is raised. If something needs emphasis, give it space or weight, not a shadow.

## Shapes

Corners follow hierarchy: gently rounded controls and inputs (10px), softer sheets and the one raised surface (20px), and full pills for choices, toggles, the slider and Plan Fit segments (999px). Lines are 1 pt hairlines for decoration and 2 pt outlines for anything interactive. The dial is a 270° arc open at the bottom, with a thin flat bracket outside it for the likely range.

## Components

### Buttons
Quiet and certain: one solid action per screen, everything else lighter.
- **Shape:** gently rounded (10px), 48 pt tall, 24 pt side padding.
- **Primary:** Moonlight fill, Night label in Body Strong. Full width in a footer, hugging its label inline.
- **Secondary:** 2 pt Moonlight outline, Moonlight label.
- **Text:** an underlined Moonlight label on the text margin, with a 48 × 48 target. Also used for destructive actions, behind a confirmation.
- **States:** press scales to 0.97 with 0.8 opacity in 100 ms; disabled at 40% opacity; loading swaps the label for a spinner without changing size; focus draws a 2 pt Moonlight ring 2 pt outside the control.

### Chips (choice pills)
- **Style:** full pills, 48 pt tall, 2 pt Control Stroke outline, Moonlight label.
- **State:** selected fills with Moonlight (covering the outline) and shows a check; Night label. Pairs such as Not now / Allow sit side by side with equal weight.

### Cards / Containers
None. Content sits on the canvas, grouped by space and hairlines. The only container is the bottom sheet (Dusk, 20px top corners, 8 pt top, 20 pt sides, 16 pt plus the safe area at the bottom).

### Inputs / Fields
- **Slider (morning check-in):** a 4 pt Control Stroke track with 8 pt step dots and the numbers 0 to 10 under them. The thumb (28 pt circle, 2 pt Moonlight outline) rests hollow on 0 until touched, then fills with Moonlight; the track fills to it. The readout above reads "7 of 10".
- **Focus:** the shared 2 pt ring wraps the track and the numbers together.

### Navigation
The platform's bottom tab bar (Today, Week, Progress) on the Night canvas with no rule above it. Icons Sun, CalendarDays, TrendingUp in 2 pt strokes. Active is Moonlight with a SemiBold label; inactive is Haze. Labels stop growing at 1.3×. Sub-screens show a "Back" link with an arrow at the top left.

### ScoreDial (signature)
The one instrument. A 264 pt dial with a 16 pt arc in the plan hue over a faint track of the same hue, a 6 pt range bracket outside it, and the score in Display at its centre. Under it, "Likely 34–68" in Body and the inputs count in Label. The morning reveal (600 ms ease-in-out, once a day) uncovers the arc from its start to the score; under Reduce Motion it is instant.

### Plan Fit meter
Up to seven 12 pt full pills in a row, one per answered day. Filled Moonlight means the plan fit; a 2 pt outline means it was too hard or too easy. Shape carries the meaning, never colour; a dashed outline is reserved for "Estimated".

### Driver row
An up or down arrow, the driver's name in Body Strong with its basis ("vs. a typical day") in Label under it, and the signed value (+6, −4) in Body Strong with tabular figures on the right. Hairline between rows.

## Do's and Don'ts

### Do:
- **Do** keep a plan hue to the plan: the dial, the Today title, and one glyph per list row (The Plan Owns Colour Rule).
- **Do** give every plan its glyph and its word (The Never Alone Rule).
- **Do** set Manrope tight (−0.6 headline, −0.3 title, −0.2 plan) and Source Sans 3 at default tracking.
- **Do** use 48 between sections, 32 between groups, 12 to 16 inside a group, and a 20 pt margin.
- **Do** keep every target at least 48 pt and every state (default, pressed, focused, disabled, loading) designed.
- **Do** show the range and the inputs count whenever the score is shown.

### Don't:
- **Don't** change the fonts; Manrope and Source Sans 3 are fixed by the user.
- **Don't** put a colour field behind the Today dial in dark (The Night Field Rule).
- **Don't** raise anything but the bottom sheet (The One Lift Rule).
- **Don't** truncate text; wrap it (The Wrap Rule).
