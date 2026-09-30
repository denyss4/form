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

export function CompletionRing({ done, total }: { done: number; total: number }) {
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
  const centre = size.ring / 2;
  const radius = centre - size.outline;
  const slice = 360 / Math.max(total, 1);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={copy.log.ring(Math.min(done, total), total)}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.min(done, total)}
      style={{ width: size.ring, height: size.ring }}
    >
      <Svg width={size.ring} height={size.ring}>
        {Array.from({ length: total }, (_, i) => (
          <Path
            key={i}
            d={arc(centre, radius, i * slice + GAP_DEGREES / 2, (i + 1) * slice - GAP_DEGREES / 2)}
            stroke={i < done ? color.text.primary : color.stroke.control}
            strokeWidth={size.outline}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, full]}>
        <Svg width={size.ring} height={size.ring}>
          <Circle cx={centre} cy={centre} r={radius} stroke={color.text.primary} strokeWidth={size.outline} fill={color.bg.raised} />
        </Svg>
      </Animated.View>
    </View>
  );
}
