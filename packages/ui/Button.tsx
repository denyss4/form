// Layout plan. Job: one clear action. Focal element: the label. Quiet: everything else, no icons, no shadow.
// One primary per screen (5.5 #8): Ink solid, Dawn text. Secondary: Ink outline. Text-only: for low-emphasis and destructive actions.
// States: default, pressed, focused, disabled, loading (MASTER_PROMPT §6). Press = scale 0.97 + opacity, 100 ms, transform and opacity only.
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion, opacity, radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

export type ButtonVariant = 'primary' | 'secondary' | 'text';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
  /** Gallery only: hold a state in place so it can be reviewed and screenshotted. */
  forceState?: 'pressed' | 'focused';
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  accessibilityHint,
  forceState,
}: ButtonProps) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(forceState === 'pressed' ? 1 : 0);
  const [focused, setFocused] = useState(false);
  const inactive = disabled || loading;

  const animated = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * (1 - motion.press.opacity),
    transform: [{ scale: reduceMotion ? 1 : 1 - pressed.value * (1 - motion.press.scale) }],
  }));

  // Reduced motion: no scale, and the opacity change becomes a short cross-fade.
  const animateTo = (value: number) => {
    pressed.value = withTiming(value, {
      duration: reduceMotion ? motion.reducedFade : motion.press.duration,
      easing: Easing.bezier(...motion.press.easing),
    });
  };

  const labelTone = variant === 'primary' ? 'inverse' : 'primary';
  const labelColor = variant === 'primary' ? color.bg.canvas : color.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      onPressIn={forceState ? undefined : () => animateTo(1)}
      onPressOut={forceState ? undefined : () => animateTo(0)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        fullWidth ? styles.stretch : styles.hug,
        disabled ? { opacity: opacity.disabled } : undefined,
      ]}
    >
      <Animated.View
        style={[
          styles.base,
          variant === 'primary' ? { backgroundColor: color.text.primary } : undefined,
          variant === 'secondary'
            ? { borderWidth: size.outline, borderColor: color.text.primary }
            : undefined,
          variant === 'text' ? styles.textOnly : undefined,
          animated,
        ]}
      >
        <Text
          variant="bodyStrong"
          tone={labelTone}
          style={[variant === 'text' ? styles.underline : undefined, loading ? styles.hidden : undefined]}
        >
          {label}
        </Text>
        {loading ? (
          <View style={styles.spinner} pointerEvents="none">
            <ActivityIndicator color={labelColor} />
          </View>
        ) : null}
        {focused || forceState === 'focused' ? (
          <View pointerEvents="none" style={[styles.ring, { borderColor: color.text.primary }]} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const ringInset = -(size.focusOffset + size.outline);

const styles = StyleSheet.create({
  hug: { alignSelf: 'flex-start' },
  stretch: { alignSelf: 'stretch' },
  base: {
    minHeight: size.touch,
    paddingHorizontal: space.lg,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Text-only sits on the text margin, so its label lines up with the text above it. The touch target is still 48 x 48.
  textOnly: { paddingHorizontal: 0, minWidth: size.touch, alignItems: 'flex-start' },
  underline: { textDecorationLine: 'underline' },
  hidden: { opacity: 0 },
  spinner: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    top: ringInset,
    left: ringInset,
    right: ringInset,
    bottom: ringInset,
    borderWidth: size.outline,
    borderRadius: radius.control + size.focusOffset,
  },
});
