// Layout plan. Job: one explicit yes, given by a tap (v-checkbox-6). Focal element: the box. Quiet: nothing else.
// Unchecked by default, always: a preselected box is not consent (GDPR Art. 7). Checked: sage fill with a canvas check, so the state is a
// shape (the check), not only a colour. The whole row is the target, at least 48 tall.
// v-checkbox-6 (D3): the check draws itself in one stroke (motion.quick, 180 ms). Reduce Motion: it appears at once.
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { motion, radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { useTheme } from './theme';
import { usePress } from './usePress';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK = 'M6 12.5 L10 16.5 L18 8'; // in the 24 pt box
const CHECK_LENGTH = 18; // the path's length, a little over, so the dash fully hides it

function CheckMark({ checked, color }: { checked: boolean; color: string }) {
  const reduceMotion = useReducedMotion();
  const drawn = useSharedValue(checked ? 1 : 0);
  useEffect(() => {
    const [x1, y1, x2, y2] = motion.quick.easing;
    drawn.set(
      reduceMotion ? (checked ? 1 : 0) : withTiming(checked ? 1 : 0, { duration: motion.quick.duration, easing: Easing.bezier(x1, y1, x2, y2) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, reduceMotion]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: CHECK_LENGTH * (1 - drawn.value) }));
  return (
    // The box has a 2 pt border, so the mark scales into the space inside it.
    <Svg width="100%" height="100%" viewBox="0 0 24 24" style={StyleSheet.absoluteFill}>
      <AnimatedPath
        d={CHECK}
        stroke={color}
        strokeWidth={size.outline + 1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={CHECK_LENGTH}
        animatedProps={props}
      />
    </Svg>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  children,
  error = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** What a screen reader hears. The visible label is `children`, which may hold links. */
  label: string;
  children: ReactNode;
  error?: boolean;
}) {
  const { color } = useTheme();
  const press = usePress();
  const focus = useFocus();
  const border = error ? color.status.attention : checked ? color.action.primary : color.stroke.control;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked }}
        aria-checked={checked}
        onPress={() => {
          haptic.selection();
          onChange(!checked);
        }}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        style={styles.target}
      >
        <Animated.View
          style={[
            styles.box,
            { borderColor: border, backgroundColor: checked ? color.action.primary : 'transparent' },
            press.style,
          ]}
        >
          <CheckMark checked={checked} color={color.action.onPrimary} />
          <FocusRing visible={focus.focused} radius={radius.control / 2} />
        </Animated.View>
      </Pressable>
      <View style={styles.label}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs },
  target: { width: size.touch, minHeight: size.touch, alignItems: 'flex-start', justifyContent: 'center' },
  box: {
    width: size.check,
    height: size.check,
    borderRadius: radius.control / 2,
    borderWidth: size.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, minHeight: size.touch, justifyContent: 'center' },
});
