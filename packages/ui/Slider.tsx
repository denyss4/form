// Layout plan. Job: one 0-10 rating in one gesture. Focal element: the thumb. Quiet: the step marks and the end labels.
// Built on React Native's responder events (no slider library is approved). A tap sets the value; a drag changes it.
// Nothing is preselected: until it is touched the thumb is an outline and the value reads "Not rated". A selection haptic on each step.
// Screen readers get the adjustable role with increment and decrement.
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useState } from 'react';

import { radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  valueText,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  valueText: string; // e.g. "7 of 10" or "Not rated"
  lowLabel: string;
  highLabel: string;
}) {
  const { color } = useTheme();
  const focus = useFocus();
  const [width, setWidth] = useState(0);
  const steps = max - min;
  const span = Math.max(width - size.thumb, 1);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const set = (v: number) => {
    const next = clamp(v);
    if (next === value) return;
    haptic.selection();
    onChange(next);
  };
  const fromTouch = (e: GestureResponderEvent) =>
    set(Math.round(((e.nativeEvent.locationX - size.thumb / 2) / span) * steps) + min);

  // Hardware and web keyboards: arrows step by one, Home and End go to the ends (WCAG 2.1.1).
  const keys = {
    focusable: true,
    onKeyDown: (e: { key: string; preventDefault?: () => void }) => {
      const from = value ?? min - 1;
      const next =
        e.key === 'ArrowRight' || e.key === 'ArrowUp'
          ? from + 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
            ? from - 1
            : e.key === 'Home'
              ? min
              : e.key === 'End'
                ? max
                : null;
      if (next === null) return;
      e.preventDefault?.();
      set(next);
    },
  };

  const at = (v: number) => ((v - min) / steps) * span; // thumb's left edge
  const filled = value === null ? 0 : at(value) + size.thumb / 2;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text variant="bodyStrong" tabular>
          {valueText}
        </Text>
      </View>

      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value ?? undefined}
        aria-valuetext={valueText}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => {
          const from = value ?? min - 1;
          set(e.nativeEvent.actionName === 'increment' ? from + 1 : from - 1);
        }}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        {...keys}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={fromTouch}
        onResponderMove={fromTouch}
        style={styles.touch}
      >
        <View pointerEvents="none" style={styles.fill}>
          <FocusRing visible={focus.focused} />
          <View style={[styles.track, { backgroundColor: color.stroke.control }]} />
          <View style={[styles.track, styles.filled, { width: filled, backgroundColor: color.text.primary }]} />
          {Array.from({ length: steps + 1 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.tick,
                { left: at(min + i) + size.thumb / 2 - size.tick / 2, backgroundColor: color.stroke.control },
              ]}
            />
          ))}
          <View
            style={[
              styles.thumb,
              {
                left: value === null ? 0 : at(value),
                backgroundColor: value === null ? color.bg.canvas : color.text.primary,
                borderColor: color.text.primary,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.row}>
        <Text variant="caption" tone="secondary">
          {lowLabel}
        </Text>
        <Text variant="caption" tone="secondary">
          {highLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xxs },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: space.sm },
  touch: { height: size.touch, justifyContent: 'center' },
  fill: { height: size.touch, justifyContent: 'center' },
  track: { position: 'absolute', left: 0, right: 0, height: size.track, borderRadius: radius.full },
  filled: { right: undefined },
  tick: {
    position: 'absolute',
    top: (size.touch - size.tick) / 2 + size.track * 2,
    width: size.tick,
    height: size.tick,
    borderRadius: radius.full,
  },
  thumb: {
    position: 'absolute',
    width: size.thumb,
    height: size.thumb,
    borderRadius: radius.full,
    borderWidth: size.outline,
  },
});
