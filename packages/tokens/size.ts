// Sizes that are not spacing: touch targets, strokes, icons and the ScoreDial geometry.
export const size = {
  touch: 48, // covers 44 pt on iOS and 48 dp on Android
  hairline: 1,
  outline: 2, // secondary button border and the focus ring
  focusOffset: 2, // gap between a control and its focus ring
  icon: 24,
  iconSm: 20,
  iconMaxScale: 2, // icons follow the text size, up to this multiple

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
