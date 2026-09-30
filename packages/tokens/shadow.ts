// One shadow token, for bottom sheets only (MASTER_PROMPT §5.4). Cards get no shadows.
// [GAP G20: "low opacity, large blur" has no numbers in the Master. Proposal; revisit at Review 1.]
import type { ViewStyle } from 'react-native';

import { lightColor } from './color';

export const shadow: { sheet: ViewStyle } = {
  sheet: {
    shadowColor: lightColor.text.primary,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16, // Android
  },
};
