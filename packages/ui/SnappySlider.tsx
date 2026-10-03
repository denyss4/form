// Layout plan. Job: pick a whole number on a short scale (Profile: training days, 1-7). Focal element: the value. Quiet: the detents.
// Snappy slider (REDESIGN-PROMPT §6, rebuilt): the thumb follows the finger, a selection haptic marks each detent it crosses, and on
// release it springs onto the nearest one (motion.standard). Never the morning rating (§6). Reduce Motion: it jumps, no spring.
// Accessible as an adjustable: swipe up or down, arrow keys, Home and End. Every detent is numbered; at 2x text and above, only the ends
// and the middle, so the numbers never touch.
// D5 (the user's pick 11B): the shared SliderTrack look, the value beside the label, and a bubble over the thumb while dragging.
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { SLIDER_THUMB, SliderTrack } from './SliderTrack';
import { Text } from './Text';
import { useFontScale } from './useFontScale';

export function SnappySlider({
  label,
  value,
  onChange,
  min,
  max,
  valueText,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  valueText: string;
}) {
  const focus = useFocus();
  const scale = useFontScale();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const steps = max - min;
  const span = Math.max(width - SLIDER_THUMB, 1);
  const [over, setOver] = useState<number | null>(null); // the detent under the finger while dragging, for the bubble
  const x = useSharedValue(0);
  const last = useRef(value); // the detent the finger is over, for one haptic per detent
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const at = (v: number) => ((v - min) / steps) * span;

  // Follow the value: a spring onto the detent (or a jump under Reduce Motion).
  useEffect(() => {
    if (width === 0) return;
    x.set(reduceMotion ? at(value) : withSpring(at(value), motion.standard));
    last.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, width, reduceMotion]);

  const commit = (v: number) => {
    const next = clamp(v);
    if (next !== value) onChange(next);
    else x.set(reduceMotion ? at(next) : withSpring(at(next), motion.standard)); // the same detent: spring back onto it
  };

  const pos = (e: GestureResponderEvent) => Math.min(span, Math.max(0, e.nativeEvent.locationX - SLIDER_THUMB / 2));
  const nearest = (px: number) => Math.round((px / span) * steps) + min;
  const follow = (e: GestureResponderEvent) => {
    const px = pos(e);
    x.set(px);
    const detent = nearest(px);
    setOver(detent);
    if (detent !== last.current) {
      last.current = detent;
      haptic.selection();
    }
  };
  const release = (e: GestureResponderEvent) => {
    setOver(null);
    commit(nearest(pos(e)));
  };

  const keys = {
    focusable: true,
    onKeyDown: (e: { key: string; preventDefault?: () => void }) => {
      const next =
        e.key === 'ArrowRight' || e.key === 'ArrowUp'
          ? value + 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
            ? value - 1
            : e.key === 'Home'
              ? min
              : e.key === 'End'
                ? max
                : null;
      if (next === null) return;
      e.preventDefault?.();
      haptic.selection();
      commit(next);
    },
  };

  const numbered = (i: number) => scale < 2 || i === 0 || i === steps || i === Math.round(steps / 2);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text variant="bodyStrong" style={styles.grow}>
          {label}
        </Text>
        <Text variant="body" tone="secondary" tabular>
          {valueText}
        </Text>
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        accessibilityValue={{ min, max, now: value, text: valueText }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => commit(e.nativeEvent.actionName === 'increment' ? value + 1 : value - 1)}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        {...keys}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={follow}
        onResponderMove={follow}
        onResponderRelease={release}
        onResponderTerminate={() => setOver(null)}
        style={styles.touch}
      >
        <FocusRing visible={focus.focused} />
        <SliderTrack x={x} bubble={over === null ? null : String(over)} />
        <View pointerEvents="none" style={styles.numbers}>
          {Array.from({ length: steps + 1 }, (_, i) =>
            numbered(i) ? (
              <Text
                key={i}
                variant="caption"
                tone={min + i === value ? 'primary' : 'secondary'}
                tabular
                style={[styles.number, { left: at(min + i) + SLIDER_THUMB / 2 - size.touch / 2 }]}
              >
                {min + i}
              </Text>
            ) : null,
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  head: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: space.sm },
  grow: { flexGrow: 1 },
  touch: { minHeight: size.touch + size.iconSm * 2, marginTop: space.md }, // room above for the bubble
  numbers: { minHeight: size.iconSm * 2 },
  number: { position: 'absolute', width: size.touch, textAlign: 'center' },
});
