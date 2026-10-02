// Layout plan. Job: pick a whole number on a short scale (Profile: training days, 1-7). Focal element: the value. Quiet: the detents.
// Snappy slider (REDESIGN-PROMPT §6, rebuilt): the thumb follows the finger, a selection haptic marks each detent it crosses, and on
// release it springs onto the nearest one (motion.standard). Never the morning rating (§6). Reduce Motion: it jumps, no spring.
// Accessible as an adjustable: swipe up or down, arrow keys, Home and End. Every detent is numbered; at 2x text and above, only the ends
// and the middle, so the numbers never touch.
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion, radius, size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';
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
  const { color } = useTheme();
  const focus = useFocus();
  const scale = useFontScale();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const steps = max - min;
  const span = Math.max(width - size.thumb, 1);
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

  const pos = (e: GestureResponderEvent) => Math.min(span, Math.max(0, e.nativeEvent.locationX - size.thumb / 2));
  const nearest = (px: number) => Math.round((px / span) * steps) + min;
  const follow = (e: GestureResponderEvent) => {
    const px = pos(e);
    x.set(px);
    const over = nearest(px);
    if (over !== last.current) {
      last.current = over;
      haptic.selection();
    }
  };
  const release = (e: GestureResponderEvent) => commit(nearest(pos(e)));

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

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fill = useAnimatedStyle(() => ({ width: x.value + size.thumb / 2 }));
  const numbered = (i: number) => scale < 2 || i === 0 || i === steps || i === Math.round(steps / 2);

  return (
    <View style={styles.wrap}>
      <Text variant="bodyStrong">{label}</Text>
      <Text variant="heading" tabular>
        {valueText}
      </Text>
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
        style={styles.touch}
      >
        <FocusRing visible={focus.focused} />
        <View pointerEvents="none" style={styles.fillArea}>
          <View style={[styles.track, { backgroundColor: color.stroke.control }]} />
          <Animated.View style={[styles.filled, { backgroundColor: color.text.primary }, fill]} />
          {Array.from({ length: steps + 1 }, (_, i) => (
            <View
              key={i}
              style={[styles.tick, { left: at(min + i) + size.thumb / 2 - size.tick / 2, backgroundColor: color.stroke.control }]}
            />
          ))}
          <Animated.View
            style={[styles.thumb, { backgroundColor: color.text.primary, borderColor: color.text.primary }, thumb]}
          />
        </View>
        <View pointerEvents="none" style={styles.numbers}>
          {Array.from({ length: steps + 1 }, (_, i) =>
            numbered(i) ? (
              <Text
                key={i}
                variant="caption"
                tone={min + i === value ? 'primary' : 'secondary'}
                tabular
                style={[styles.number, { left: at(min + i) + size.thumb / 2 - size.touch / 2 }]}
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
  touch: { minHeight: size.touch + size.iconSm * 2 },
  fillArea: { height: size.touch, justifyContent: 'center' },
  track: { position: 'absolute', left: size.thumb / 2, right: size.thumb / 2, height: size.track, borderRadius: radius.full },
  filled: { position: 'absolute', left: size.thumb / 2, height: size.track, borderRadius: radius.full },
  tick: { position: 'absolute', width: size.tick, height: size.tick, borderRadius: radius.full },
  thumb: {
    position: 'absolute',
    left: 0,
    width: size.thumb,
    height: size.thumb,
    borderRadius: radius.full,
    borderWidth: size.outline,
  },
  numbers: { minHeight: size.iconSm * 2 },
  number: { position: 'absolute', width: size.touch, textAlign: 'center' },
});
