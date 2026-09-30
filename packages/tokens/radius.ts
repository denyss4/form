// Radius follows hierarchy (MASTER_PROMPT §5.4): there is no single radius for everything.
export const radius = {
  control: 10, // controls and inputs
  sheet: 20, // sheets and the one raised surface
  full: 999, // toggles and segmented pills
} as const;
