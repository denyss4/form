// Progressive flux loader (REDESIGN-PROMPT §6, rebuilt): for waits over 1 s only (CLAUDE.md: over 1 s, progress plus a plain line).
// A thin track with a Text High segment flowing along it, and the line writing itself in once, letter by letter. The original's glow
// becomes a flat bar: one glow per screen at most, and a wait is not the place for it (Step 1, section C).
// Reduce Motion: a static hourglass with the line and the note, nothing moving.
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Hourglass from 'lucide-react-native/icons/hourglass';

import { motion, radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

const SEGMENT = 0.35; // the moving segment's share of the track

function Letter({ char, index, count, written }: { char: string; index: number; count: number; written: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(written.value, [index / count, (index + 1) / count], [0, 1], 'clamp'),
  }));
  return <Animated.Text style={style}>{char}</Animated.Text>;
}

export function FluxLoader({ label, note }: { label: string; note?: string }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const iconPx = useIconSize(size.icon);
  const flow = useSharedValue(0);
  const written = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const [x1, y1, x2, y2] = motion.flux.easing;
    flow.set(withRepeat(withTiming(1, { duration: motion.flux.loop, easing: Easing.bezier(x1, y1, x2, y2) }), -1, false));
    written.set(withTiming(1, { duration: motion.flux.write }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const segment = useAnimatedStyle(() => ({
    left: `${interpolate(flow.value, [0, 1], [-SEGMENT * 100, 100])}%`,
  }));

  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={note ? `${label} ${note}` : label} style={styles.wrap}>
      {reduceMotion ? (
        <Hourglass color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
      ) : (
        <View style={[styles.track, { backgroundColor: color.stroke.hairline }]}>
          <Animated.View style={[styles.segment, { backgroundColor: color.text.primary }, segment]} />
        </View>
      )}
      {/* One Text, so the line still wraps as words; each letter only fades in. */}
      <Text variant="bodyStrong">
        {reduceMotion
          ? label
          : label.split('').map((char, i) => <Letter key={i} char={char} index={i} count={label.length} written={written} />)}
      </Text>
      {note ? (
        <Text variant="caption" tone="secondary">
          {note}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, alignSelf: 'stretch' },
  track: { height: size.track, borderRadius: radius.full, overflow: 'hidden' },
  segment: { position: 'absolute', top: 0, bottom: 0, width: `${SEGMENT * 100}%`, borderRadius: radius.full },
});
