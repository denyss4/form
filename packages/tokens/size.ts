// Sizes that are not spacing: touch targets, strokes, icons and the ScoreDial geometry.
export const size = {
  touch: 48, // covers 44 pt on iOS and 48 dp on Android
  hairline: 1,
  outline: 2, // secondary button border and the focus ring
  focusOffset: 2, // gap between a control and its focus ring
  icon: 24,
  iconSm: 20,
  iconMaxScale: 2, // icons follow the text size, up to this multiple
  ring: 32, // the log's completion ring
  ringStroke: 8,
  ringStrokeSm: 4, // the log's completion ring: thick enough to see it fill
  marker: 16, // forecast and felt markers on the felt-vs-forecast bar
  track: 4, // slider track thickness
  thumb: 28, // slider thumb
  tick: 8, // slider step mark: with no thumb yet, the dots are what you tap
  segment: 12, // Plan Fit segment height: a meter, not a row of buttons
  check: 24, // the checkbox box, centred in a 48 pt row
  // Profile (REDESIGN-PROMPT §5): the header button, and the capsule avatar that echoes the pills and the week-strip columns.
  avatar: { button: 36, capsuleWidth: 112, capsuleHeight: 168, weekCapsule: 40 },

  // ScoreDial: a 270-degree arc that opens at the bottom, and a thin bracket outside it for the likely range.
  // [GAP G21: dial sizes are not in the Master. These are proposals; revisit at Review 1.]
  dial: {
    startAngle: 135, // degrees clockwise from the 3 o'clock direction: lower left
    sweep: 270,
    app: { diameter: 264, stroke: 16, band: 6, bandGap: 6 },
    widget: { diameter: 120, stroke: 10, band: 4, bandGap: 4 },
    watch: { diameter: 88, stroke: 8, band: 3, bandGap: 3 },
  },
} as const;

export type DialSize = 'app' | 'widget' | 'watch';
