// Motion tokens (MASTER_PROMPT §6). Animate only transform and opacity.
// Easings are cubic-bezier control points for Reanimated's Easing.bezier.
export const motion = {
  press: {
    duration: 100,
    easing: [0, 0, 0.58, 1], // ease-out
    scale: 0.97,
    opacity: 0.8, // [GAP G20: the Master says "scale 0.97 plus opacity" without a value; proposal]
  },
  quick: {
    duration: 180,
    easing: [0.215, 0.61, 0.355, 1], // ease-out cubic
  },
  standard: {
    damping: 20,
    stiffness: 200, // [GAP G20: the Master gives damping only; proposal]
    mass: 1,
  },
  reveal: {
    duration: 600, // the morning score reveal only, once per day
    easing: [0.42, 0, 0.58, 1], // ease-in-out
    field: 0.6, // the plan colour field settles over the first 60% of it
  },
  // First-launch intro on onboarding, from the Open_10 reference: thin rings glide into one ring, then the dial appears.
  // Transform and opacity only, once, static under reduced motion. [GAP G25: a second orchestrated moment, at the user's direction]
  intro: {
    duration: 1600,
    easing: [0.42, 0, 0.58, 1], // ease-in-out
  },
  // Welcome, 'Dawn over the week' (REDESIGN-PROMPT §4.1): the wordmark assembles and the week's glyphs rise, in 1.2 s at most, once per
  // launch (GAP G52: once per install needs storage). Tap skips to the end state; Reduce Motion shows it static.
  welcome: {
    duration: 1100,
    easing: [0.215, 0.61, 0.355, 1], // ease-out cubic
  },
  reducedFade: 120, // ms, under the 150 ms limit, when reduce-motion is on
} as const;
