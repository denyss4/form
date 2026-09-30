// Layout plan. Job: one explicit answer per question. Focal element: the two options, side by side. Quiet: nothing else.
// Equal weight before an answer: neither option is filled, neither is preselected (GDPR: no defaults). At most 4 options (Hick).
// Selected = filled with a checkmark, cross-faded over `motion.quick` (opacity only), with a selection haptic (MASTER_PROMPT §6).
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Check from 'lucide-react-native/icons/check';

import { motion, radius, size, space } from '@tokens';

import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';
import { usePress } from './usePress';

export interface Choice<T extends string> {
  value: T;
  label: string;
}

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const press = usePress();
  const on = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(selected ? 1 : 0, {
      duration: reduceMotion ? motion.reducedFade : motion.quick.duration,
      easing: Easing.bezier(...motion.quick.easing),
    });
  }, [selected, reduceMotion, on]);

  const shown = useAnimatedStyle(() => ({ opacity: on.value }));
  const hidden = useAnimatedStyle(() => ({ opacity: 1 - on.value }));

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      aria-checked={selected}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={styles.grow}
    >
      <Animated.View style={[styles.option, { borderColor: color.stroke.control }, press.style]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.fill, { backgroundColor: color.text.primary }, shown]}
        />
        <Animated.View pointerEvents="none" style={[styles.check, shown]}>
          <Check color={color.bg.canvas} size={size.iconSm} strokeWidth={size.outline} />
        </Animated.View>
        <View>
          <Animated.View style={hidden}>
            <Text variant="bodyStrong">{label}</Text>
          </Animated.View>
          <Animated.View pointerEvents="none" style={[styles.overlay, shown]}>
            <Text variant="bodyStrong" tone="inverse">
              {label}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.group}>
      {options.map((option) => (
        <Option
          key={option.value}
          label={option.label}
          selected={option.value === value}
          onPress={() => {
            if (option.value !== value) haptic.selection();
            onChange(option.value);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', gap: space.xs },
  grow: { flex: 1 },
  option: {
    minHeight: size.touch,
    paddingHorizontal: space.md,
    borderRadius: radius.full,
    borderWidth: size.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The fill covers the border too, so a selected option reads as one solid pill.
  fill: {
    position: 'absolute',
    top: -size.outline,
    left: -size.outline,
    right: -size.outline,
    bottom: -size.outline,
    borderRadius: radius.full,
  },
  check: { position: 'absolute', left: space.md },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
