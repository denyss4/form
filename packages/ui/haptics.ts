// Haptics (MASTER_PROMPT §6). Web has none, and a failed haptic must never break an action.
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const run = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const haptic = {
  /** Selecting a log or consent option. */
  selection: () => run(() => Haptics.selectionAsync()),
  /** Completing the 3-tap log. */
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** An error message appears. */
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  /** Accepting a "move session" suggestion, and each step of the demo clock. */
  light: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** The morning reveal settling. */
  soft: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)),
};
