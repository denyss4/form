// Layout plan. Job: a calm first impression that becomes the product's own dial. Focal element: the rings merging.
// Quiet: everything else. Play once per launch, about 1.6 s, static under reduced motion.
//
// From the Open_10 reference: thin line circles laid out as a flower glide together while everything eases in and out.
// Here six rings and a centre ring, each half the dial's radius, slide to the centre and grow to exactly the dial's track radius,
// so they merge into one ring. That ring then fades into the dial's empty state, which is the truth on day 1: no score yet.
// Transform and opacity only. This is a second orchestrated moment beyond the Master's one (§6), added at the user's direction (GAPS G25).
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { motion, size } from '@tokens';

import { dialGeometry, ScoreDial } from './ScoreDial';
import { useTheme } from './theme';

const OUTER = 6;
let played = false; // once per launch

function Ring({
  progress,
  dx,
  dy,
  radius,
  grow,
  diameter,
  stroke,
}: {
  progress: SharedValue<number>;
  dx: number;
  dy: number;
  radius: number;
  grow: number;
  diameter: number;
  stroke: string;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.75, 1], [1, 1, 0]),
    transform: [
      { translateX: (1 - progress.value) * dx },
      { translateY: (1 - progress.value) * dy },
      { scale: 1 + progress.value * (grow - 1) },
    ],
  }));
  return (
    <Animated.View style={[styles.layer, { width: diameter, height: diameter }, style]}>
      <Svg width={diameter} height={diameter}>
        <Circle cx={diameter / 2} cy={diameter / 2} r={radius} stroke={stroke} strokeWidth={size.hairline} fill="none" />
      </Svg>
    </Animated.View>
  );
}

/** `progress` (0 to 1) holds the animation at a frame, for review. */
export function IntroMark({ progress: held }: { progress?: number }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const { g, valueRadius, height } = dialGeometry('app');
  const p = useSharedValue(held ?? (reduceMotion || played ? 1 : 0));

  useEffect(() => {
    if (held !== undefined) {
      p.value = held;
    } else if (reduceMotion || played) {
      p.value = 1;
    } else {
      played = true;
      p.value = withTiming(1, {
        duration: motion.intro.duration,
        easing: Easing.bezier(...motion.intro.easing),
      });
    }
  }, [held, reduceMotion, p]);

  const start = valueRadius / 2; // six rings around one, each half the track radius
  const grow = valueRadius / start;
  const dial = useAnimatedStyle(() => ({ opacity: interpolate(p.value, [0.7, 1], [0, 1]) }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: g.diameter, height }}
    >
      <Ring progress={p} dx={0} dy={0} radius={start} grow={grow} diameter={g.diameter} stroke={color.text.primary} />
      {Array.from({ length: OUTER }, (_, i) => {
        const angle = (i * 2 * Math.PI) / OUTER;
        return (
          <Ring
            key={i}
            progress={p}
            dx={start * Math.cos(angle)}
            dy={start * Math.sin(angle)}
            radius={start}
            grow={grow}
            diameter={g.diameter}
            stroke={color.text.primary}
          />
        );
      })}
      <Animated.View style={[styles.layer, dial]}>
        <ScoreDial score={null} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0 },
});
