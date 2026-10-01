// Layout plan. Job: show how far through the log you are. Focal element: the ring. Quiet: everything else.
// One arc per question. Each arc fills (opacity only) the moment its question is answered, so the ring visibly fills as you go.
// When all are answered the gaps close into a full ring. Progress is real: it never shows more than what was answered (MASTER_PROMPT §2).
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { copy } from '@copy';
import { motion, size } from '@tokens';

import { useTheme } from './theme';

const GAP_DEGREES = 24;

function arc(centre: number, radius: number, from: number, to: number) {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180; // 0 degrees at 12 o'clock
    return `${centre + radius * Math.cos(rad)} ${centre + radius * Math.sin(rad)}`;
  };
  return `M ${point(from)} A ${radius} ${radius} 0 ${to - from > 180 ? 1 : 0} 1 ${point(to)}`;
}

/** One arc in the answered colour. It fades in when `on` turns true. */
function Filled({ on, d, stroke, diameter, width }: { on: boolean; d: string; stroke: string; diameter: number; width: number }) {
  const reduceMotion = useReducedMotion();
  const shown = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    shown.set(
      withTiming(on ? 1 : 0, {
        duration: reduceMotion ? motion.reducedFade : motion.quick.duration,
        easing: Easing.bezier(...motion.quick.easing),
      }),
    );
  }, [on, reduceMotion, shown]);
  const style = useAnimatedStyle(() => ({ opacity: shown.value }));
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width={diameter} height={diameter}>
        <Path d={d} stroke={stroke} strokeWidth={width} strokeLinecap="round" fill="none" />
      </Svg>
    </Animated.View>
  );
}

export function CompletionRing({
  done,
  total,
  diameter = size.ring,
  stroke = size.ringStrokeSm,
  label,
}: {
  done: number;
  total: number;
  diameter?: number;
  stroke?: number;
  /** Spoken name. Defaults to "N of M answered", the evening log's wording. */
  label?: string;
}) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const complete = total > 0 && done >= total;
  const closed = useSharedValue(complete ? 1 : 0);

  useEffect(() => {
    closed.set(
      withTiming(complete ? 1 : 0, {
        duration: reduceMotion ? motion.reducedFade : motion.quick.duration,
        easing: Easing.bezier(...motion.quick.easing),
      }),
    );
  }, [complete, reduceMotion, closed]);

  const full = useAnimatedStyle(() => ({ opacity: closed.value }));
  const centre = diameter / 2;
  const radius = centre - stroke;
  const slice = 360 / Math.max(total, 1);
  const arcs = Array.from({ length: total }, (_, i) =>
    arc(centre, radius, i * slice + GAP_DEGREES / 2, (i + 1) * slice - GAP_DEGREES / 2),
  );

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? copy.log.ring(Math.min(done, total), total)}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(done, total)}
      style={{ width: diameter, height: diameter }}
    >
      <Svg width={diameter} height={diameter}>
        {arcs.map((d, i) => (
          <Path key={i} d={d} stroke={color.stroke.control} strokeWidth={stroke} strokeLinecap="round" fill="none" />
        ))}
      </Svg>
      {arcs.map((d, i) => (
        <Filled key={i} on={i < done} d={d} stroke={color.text.primary} diameter={diameter} width={stroke} />
      ))}
      <Animated.View style={[StyleSheet.absoluteFill, full]}>
        <Svg width={diameter} height={diameter}>
          <Circle cx={centre} cy={centre} r={radius} stroke={color.text.primary} strokeWidth={stroke} fill={color.bg.raised} />
        </Svg>
      </Animated.View>
    </View>
  );
}
