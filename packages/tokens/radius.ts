// Radius follows hierarchy (REDESIGN-PROMPT §1): there is no single radius for everything.
export const radius = {
  control: 12, // controls and inputs
  surface: 16, // the one content surface (Week day detail, Profile sections)
  sheet: 24, // bottom sheets, top corners only
  full: 999, // toggles, pills, the slider, Plan Fit segments
} as const;
