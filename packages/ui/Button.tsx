// Layout plan. Job: one clear action. Focal element: the label. Quiet: everything else, no icons, no shadow.
// One primary per screen (5.5 #8): Ink solid, Dawn text. Secondary: Ink outline. Text-only: for low-emphasis and destructive actions.
// States: default, pressed, focused, disabled, loading (MASTER_PROMPT §6). Press = scale 0.97 + opacity, 100 ms, transform and opacity only.
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { opacity, radius, size, space } from '@tokens';

import { Busy } from './Busy';
import { FocusRing, useFocus } from './focus';
import { Text } from './Text';
import { useTheme } from './theme';
import { usePress } from './usePress';

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
  const press = usePress(forceState === 'pressed');
  const focus = useFocus();
  const inactive = disabled || loading;

  const labelTone = variant === 'primary' ? 'inverse' : 'primary';
  const labelColor = variant === 'primary' ? color.bg.canvas : color.text.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      onPress={onPress}
      onPressIn={forceState ? undefined : press.onPressIn}
      onPressOut={forceState ? undefined : press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
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
          press.style,
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
            <Busy small color={labelColor} />
          </View>
        ) : null}
        <FocusRing visible={focus.focused || forceState === 'focused'} />
      </Animated.View>
    </Pressable>
  );
}

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
});
