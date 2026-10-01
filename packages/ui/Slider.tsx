// Layout plan. Job: one 0-10 rating in one gesture. Focal element: the thumb. Quiet: the step marks and the end labels.
// Built on React Native's responder events (no slider library is approved). A tap sets the value; a drag changes it.
// The thumb starts on 0 and the readout shows 0, as an outline and in the secondary tone. Nothing is recorded until it is touched, even
// a tap on 0 (the user's decision: show 0, record nothing until touched). Screen readers hear "Not rated" until then.
// Each dot has its number under it. Tapping a dot or its number sets that value. A selection haptic on each step.
// Screen readers get the adjustable role with increment and decrement.
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useState } from 'react';

import { radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';
import { useFontScale } from './useFontScale';

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  valueText,
  spokenText,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  valueText: string; // what is shown, e.g. "7 of 10", or "0 of 10" before it is touched
  spokenText?: string; // what a screen reader says when it differs, e.g. "Not rated"
  lowLabel: string;
  highLabel: string;
}) {
  const { color } = useTheme();
  const focus = useFocus();
  const scale = useFontScale();
  const [width, setWidth] = useState(0);
  const steps = max - min;
  const span = Math.max(width - size.thumb, 1);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const set = (v: number) => {
    const next = clamp(v);
    if (next === value) return; // an untouched slider is null, so the first tap always counts, even on 0
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
  const shownValue = value ?? min; // the thumb rests on 0 until it is touched
  const filled = value === null ? 0 : at(value) + size.thumb / 2;
  // Every number under its dot. At very large text they would touch, so only the ends and the middle stay.
  const numbersHeight = size.iconSm * Math.min(Math.max(scale, 1), 2); // the number row grows with the text, so it never touches the end labels
  const numbered = (i: number) => scale < 2 || i === 0 || i === steps || i === steps / 2;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text variant="bodyStrong" tone={value === null ? 'secondary' : 'primary'} tabular>
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
        aria-valuetext={spokenText ?? valueText}
        accessibilityValue={{ text: spokenText ?? valueText }}
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
        style={[styles.touch, { height: size.touch + numbersHeight }]}
      >
        {/* The focus ring wraps the track and the numbers together, so it never cuts through them. */}
        <FocusRing visible={focus.focused} />
        <View pointerEvents="none" style={styles.fill}>
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
                left: at(shownValue),
                backgroundColor: value === null ? color.bg.canvas : color.text.primary,
                borderColor: color.text.primary,
              },
            ]}
          />
        </View>
        <View pointerEvents="none" style={[styles.numbers, { height: numbersHeight }]}>
          {Array.from({ length: steps + 1 }, (_, i) =>
            numbered(i) ? (
              <View key={i} style={[styles.number, { left: at(min + i) }]}>
                <Text variant="caption" tone="secondary" tabular>
                  {min + i}
                </Text>
              </View>
            ) : null,
          )}
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
  touch: { height: size.touch + size.iconSm },
  numbers: { position: 'absolute', left: 0, right: 0, top: size.touch - space.xxs, height: size.iconSm },
  number: { position: 'absolute', width: size.thumb, alignItems: 'center' },
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
