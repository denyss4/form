// Loading placeholder in the final layout shape (MASTER_PROMPT §6: 300 ms to 1 s). Static: nothing loops, so there is no shimmer.
// The hairline colour is decorative, which is what a placeholder is.
import { View, type DimensionValue } from 'react-native';

import { radius, size } from '@tokens';

import { useTheme } from './theme';

export function Skeleton({ width, height = size.iconSm }: { width: DimensionValue; height?: number }) {
  const { color } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width, height, borderRadius: radius.control, backgroundColor: color.stroke.hairline }}
    />
  );
}
