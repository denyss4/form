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
  },
  reducedFade: 120, // ms, under the 150 ms limit, when reduce-motion is on
} as const;
