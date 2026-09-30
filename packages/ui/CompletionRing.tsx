// Layout plan. Job: show how far through the log you are. Focal element: the ring. Quiet: everything else.
// One arc per question, filled as it is answered. When all are answered the gaps close into a full ring (opacity only).
// Progress is real: it never shows more than what was answered (MASTER_PROMPT §2, goal-gradient).
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

export function CompletionRing({
  done,
  total,
  diameter = size.ring,
  stroke = size.outline,
  label,
  marks,
}: {
  done: number;
  total: number;
  diameter?: number;
  stroke?: number;
  /** Spoken name. Defaults to "N of M answered", the evening log's wording. */
  label?: string;
  /** One flag per arc, in order. Lets an arc stand for a specific day. Without it the first `done` arcs fill. */
  marks?: boolean[];
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
        {Array.from({ length: total }, (_, i) => (
          <Path
            key={i}
            d={arc(centre, radius, i * slice + GAP_DEGREES / 2, (i + 1) * slice - GAP_DEGREES / 2)}
            stroke={(marks ? marks[i] : i < done) ? color.text.primary : color.stroke.control}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, full]}>
        <Svg width={diameter} height={diameter}>
          <Circle cx={centre} cy={centre} r={radius} stroke={color.text.primary} strokeWidth={stroke} fill={color.bg.raised} />
        </Svg>
      </Animated.View>
    </View>
  );
}
