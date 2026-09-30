// Loading placeholder in the final layout shape (MASTER_PROMPT §6: 300 ms to 1 s). Static: nothing loops, so there is no shimmer.
// The hairline colour is decorative, which is what a placeholder is.
import { View, type DimensionValue } from 'react-native';

import { radius, size } from '@tokens';

import { useTheme } from './theme';

export function Skeleton({
  width,
  height = size.iconSm,
  round = false,
}: {
  width: DimensionValue;
  height?: number;
  /** A circle, for a ring or a dial. */
  round?: boolean;
}) {
  const { color } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width, height, borderRadius: round ? radius.full : radius.control, backgroundColor: color.stroke.hairline }}
    />
  );
}
