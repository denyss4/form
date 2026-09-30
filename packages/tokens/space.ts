// Spacing (MASTER_PROMPT §5.2): 4-pt base. Inner spacing is always smaller than outer spacing:
// 12-16 inside a group, 32 between groups, 48 before a new section.
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  margin: 20, // documented exception to the scale: horizontal screen margin, equal left and right
} as const;
