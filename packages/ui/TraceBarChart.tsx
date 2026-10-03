// D5 (the user's pick), hover-trace bar chart): the recharts chart rebuilt in react-native-svg and Reanimated. One bar is picked, the others
// step back; a dashed line springs to the picked bar's height with its value in a pill at the left; the header counts to the same value
// (the original's NumberFlow). It starts on the highest bar, as the original does.
// Touch instead of hover: tap or drag across the bars to pick one (a selection haptic at each bar). The pick stays after the finger
// lifts; the original resets on mouse-leave, which on a phone would erase the value the moment you read it.
// Colours: the picked bar and the line are Text High (the original's foreground); the others are the control stroke (4.74:1), not the
// original's 20% opacity, which would fall to 1.9:1 on the canvas and fail WCAG 1.4.11 for graphics. Rounded 4 pt tops as in the original.
// Screen readers: one adjustable; swipe up or down moves between days and reads the day and value. Reduce Motion: no spring, no count.
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Line, Rect } from 'react-native-svg';

import { chromeMaxFontScale, radius, size, space } from '@tokens';

import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';

export interface TraceBar {
  key: string;
  label: string; // under the bar, e.g. "M\n5"
  day: string; // in the header, e.g. "Mon 5"
  spoken: string; // for screen readers, e.g. "Monday 5 October"
  value: number;
}

const PLOT = space.xxxl * 2; // 128 pt of plot, as BarChart
const LEAD = space.xl + space.xs; // 40 pt on the left for the value pill (the original's chart margin)
const PILL = space.md + space.xxs; // 20 pt pill height
const DOT = space.xs - size.outline; // 6 pt dot at the right end of the line
const BAR_SHARE = 0.56;
const SPRING = { stiffness: 110, damping: 20 }; // the original's spring

export function TraceBarChart({ title, dayCaption, hint, bars, max }: { title: string; dayCaption: string; hint: string; bars: TraceBar[]; max: number }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const highest = useMemo(() => bars.reduce((best, b, i) => (b.value > (bars[best]?.value ?? -1) ? i : best), 0), [bars]);
  const [picked, setPicked] = useState<number | null>(null);
  const index = picked ?? highest;
  const bar = bars[index];
  const target = bar?.value ?? 0;

  const v = useSharedValue(target);
  const [shown, setShown] = useState(target);
  useEffect(() => {
    v.set(reduceMotion ? target : withSpring(target, SPRING));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduceMotion]);
  useAnimatedReaction(
    () => Math.round(v.value),
    (n, prev) => {
      if (n !== prev) runOnJS(setShown)(n);
    },
  );
  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: PLOT - (Math.min(Math.max(v.value, 0), max) / max) * PLOT - PILL / 2 }],
  }));

  const plot = Math.max(width - LEAD, 0);
  const column = plot / Math.max(bars.length, 1);
  const barWidth = column * BAR_SHARE;
  const y = (value: number) => PLOT - (Math.min(Math.max(value, 0), max) / max) * PLOT;

  const pick = (i: number) => {
    const next = Math.min(Math.max(i, 0), bars.length - 1);
    if (next !== index) haptic.selection();
    setPicked(next);
  };
  const fromTouch = (e: GestureResponderEvent) => {
    if (column > 0) pick(Math.floor((e.nativeEvent.locationX - LEAD) / column));
  };

  if (!bar) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.grow}>
          <Text variant="caption" tone="secondary">
            {title}
          </Text>
          <Text variant="title" tabular>
            {shown}
          </Text>
        </View>
        <View style={styles.right}>
          <Text variant="caption" tone="secondary">
            {dayCaption}
          </Text>
          <Text variant="bodyStrong">{bar.day}</Text>
        </View>
      </View>

      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={title}
        accessibilityHint={hint}
        accessibilityValue={{ text: `${bar.spoken}, ${bar.value}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => pick(index + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}
        // box-only: touches land on this view, so locationX is measured from its left edge, not from a bar's.
        pointerEvents="box-only"
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={fromTouch}
        onResponderMove={fromTouch}
        style={styles.plot}
      >
        {plot > 0 ? (
          <Svg width={plot} height={PLOT} style={{ marginLeft: LEAD }}>
            {bars.map((b, i) => (
              <Rect
                key={b.key}
                x={i * column + (column - barWidth) / 2}
                y={y(b.value)}
                width={barWidth}
                height={PLOT - y(b.value)}
                rx={space.xxs}
                fill={i === index ? color.text.primary : color.stroke.control}
              />
            ))}
          </Svg>
        ) : null}
        <Animated.View style={[styles.trace, lineStyle]}>
          <View style={[styles.pill, { backgroundColor: color.text.primary }]}>
            <Text variant="caption" tone="inverse" tabular maxFontSizeMultiplier={chromeMaxFontScale}>
              {target}
            </Text>
          </View>
          <Svg style={styles.grow} height={PILL}>
            <Line x1={0} x2="100%" y1={PILL / 2} y2={PILL / 2} stroke={color.text.primary} strokeWidth={size.hairline} strokeDasharray="3 3" />
          </Svg>
          <View style={[styles.dot, { backgroundColor: color.text.primary }]} />
        </Animated.View>
      </View>

      <View style={[styles.labels, { marginLeft: LEAD }]}>
        {bars.map((b, i) => (
          <Text
            key={b.key}
            variant="caption"
            tone={i === index ? 'primary' : 'secondary'}
            maxFontSizeMultiplier={chromeMaxFontScale}
            style={styles.label}
          >
            {b.label}
          </Text>
        ))}
      </View>
      <Text variant="caption" tone="secondary">
        {hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, marginBottom: space.xs },
  right: { alignItems: 'flex-end' },
  grow: { flex: 1 },
  plot: { height: PLOT },
  trace: { position: 'absolute', top: 0, left: 0, right: 0, height: PILL, flexDirection: 'row', alignItems: 'center' },
  pill: { width: LEAD - space.xxs, height: PILL, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  dot: { width: DOT, height: DOT, borderRadius: radius.full },
  labels: { flexDirection: 'row' },
  label: { flex: 1, textAlign: 'center' },
});
