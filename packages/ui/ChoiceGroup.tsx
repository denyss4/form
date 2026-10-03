// Layout plan. Job: one explicit answer per question. Focal element: the two options, side by side. Quiet: nothing else.
// Equal weight before an answer: neither option is filled, neither is preselected (GDPR: no defaults). At most 4 options (Hick).
// Selected = the sage fill with canvas text (D5, no check), cross-faded over `motion.quick` (opacity only), with a selection haptic (MASTER_PROMPT §6).
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion, radius, size, space, type } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { Text } from './Text';
import { useTextScale } from './textScale';
import { useTheme } from './theme';
import { useFontScale } from './useFontScale';
import { usePress } from './usePress';

export interface Choice<T extends string> {
  value: T;
  label: string;
}

function Option({
  label,
  selected,
  onPress,
  columns,
  onLines,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  columns: number;
  onLines: (lines: number) => void;
}) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const press = usePress();
  const focus = useFocus();
  const on = useSharedValue(selected ? 1 : 0);
  // Native reports the label's line count; the web build does not, so there the label's height against one line stands in.
  const webLine = type.bodyStrong.lineHeight! * useTextScale();

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
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={{ flexGrow: 1, flexBasis: `${Math.floor(100 / columns) - 2}%` }}
    >
      <Animated.View style={[styles.option, { borderColor: color.stroke.control }, press.style]}>
        <FocusRing visible={focus.focused} radius={radius.full} />
        <Animated.View
          pointerEvents="none"
          style={[styles.fill, { backgroundColor: color.state.selected }, shown]}
        />
        {/* Selected is the solid sage fill with canvas text; unselected is the outline (Figma, D5: no check mark). Fill versus outline is the
            non-colour cue, and the radio state is announced. */}
        <View>
          <Animated.View style={hidden}>
            <Text
              variant="bodyStrong"
              style={styles.labelText}
              onTextLayout={(e) => onLines(e.nativeEvent.lines.length)}
              onLayout={Platform.OS === 'web' ? (e) => onLines(e.nativeEvent.layout.height > webLine * 1.5 ? 2 : 1) : undefined}
            >
              {label}
            </Text>
          </Animated.View>
          <Animated.View pointerEvents="none" style={[styles.overlay, shown]}>
            <Text variant="bodyStrong" tone="inverse" style={styles.labelText}>
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
  columns: preferred = options.length,
}: {
  label: string;
  options: Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** Options per row. Four options read better as two rows of two. */
  columns?: number;
  /** Kept for call sites from before D5 (short labels such as times); the pill no longer reserves room for a check, so it changes nothing. */
  compact?: boolean;
}) {
  // Larger text needs wider options, so the group stacks: two per row above 1.3x, one per row from 2x.
  // And if any label still breaks onto a second line in a shared row, the whole group goes one per row, so no pill is taller than its
  // neighbour or splits a phrase (iPhone, 2 Oct: "Did something / else"). Sticky until the text size or the labels change.
  const scale = useFontScale();
  // Remembered per text size and label set: a change starts the check again.
  const key = `${scale}|${options.map((o) => o.label).join('|')}`;
  const [wrapsAt, setWrapsAt] = useState<string | null>(null);
  const wraps = wrapsAt === key;
  const sized = scale >= 2 ? 1 : scale > 1.3 ? Math.min(preferred, 2) : preferred;
  const columns = wraps ? 1 : sized;
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.group}>
      {options.map((option) => (
        <Option
          key={option.value}
          label={option.label}
          selected={option.value === value}
          columns={columns}
          onLines={(lines) => {
            if (lines > 1 && columns > 1) setWrapsAt(key);
          }}
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
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  option: {
    minHeight: size.touch,
    paddingHorizontal: space.xs, // 8: leaves about 151 pt for a label in a 2-column row at 390 pt, so "Did something else" fits at 1x
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
  labelText: { textAlign: 'center' },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
