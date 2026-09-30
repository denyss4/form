// Layout plan. Job: say "working" without a number. Focal element: the indicator. Quiet: everything else.
// An indeterminate native indicator, because there is no real progress to show. It is a decided exception to "no loops" (DECISIONS.md).
// Under reduced motion it is a static icon. Always sits beside a line of text that says what is happening.
import { ActivityIndicator } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import LoaderCircle from 'lucide-react-native/icons/loader-circle';

import { size } from '@tokens';

import { useIconSize } from './useIconSize';

export function Busy({ color, small = false, forceMotion = false }: { color: string; small?: boolean; forceMotion?: boolean }) {
  // `forceMotion` is for review only: it shows the moving indicator even when the device asks for reduced motion.
  const reduceMotion = useReducedMotion() && !forceMotion;
  const px = useIconSize(small ? size.iconSm : size.icon);
  return reduceMotion ? (
    <LoaderCircle color={color} size={px} strokeWidth={size.outline} />
  ) : (
    <ActivityIndicator color={color} />
  );
}
