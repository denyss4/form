// Press feedback shared by every pressable: scale 0.97 plus opacity, 100 ms ease-out, transform and opacity only.
// Reduced motion: no scale, and the opacity change becomes a short cross-fade.
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@tokens';

export function usePress(held = false) {
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(held ? 1 : 0);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * (1 - motion.press.opacity),
    transform: [{ scale: reduceMotion ? 1 : 1 - pressed.value * (1 - motion.press.scale) }],
  }));

  const to = (value: number) => {
    pressed.value = withTiming(value, {
      duration: reduceMotion ? motion.reducedFade : motion.press.duration,
      easing: Easing.bezier(...motion.press.easing),
    });
  };

  return { style, onPressIn: () => to(1), onPressOut: () => to(0) };
}
