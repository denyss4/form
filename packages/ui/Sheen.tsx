// A band of light that crosses a control once (REDESIGN-PROMPT §6). Two uses, one mechanism:
// - highlight: the press sweep on primary and secondary buttons, 280 ms (≤ 300 ms), confirming the press.
// - metal: liquid metal on Welcome's "Create account" only. A slower, wider band with a darker edge on each side (light between two
//   shadows reads as metal, not chrome), played once when Welcome settles, then still. Sage stays the only colour: the band is white and
//   canvas at low opacity over the sage fill, never a second accent.
// Opacity and position only (left in percent, so nothing is measured). Drawn under the label, inside its own clip, so the label and the focus ring are never covered or cut.
// Reduce Motion: nothing plays.
import { useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { motion, opacity, radius } from '@tokens';

import { useTheme } from './theme';

export type SheenKind = 'highlight' | 'metal';

export function Sheen({ play, kind, tone }: { play: number; kind: SheenKind; tone: 'onFill' | 'onCanvas' }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const spec = motion.sheen[kind];
  const band = spec.band * 100; // percent of the control: no measuring, so it works the same on every platform

  useEffect(() => {
    if (play === 0 || reduceMotion) return;
    progress.set(0);
    const [x1, y1, x2, y2] = spec.easing;
    progress.set(withTiming(1, { duration: spec.duration, easing: Easing.bezier(x1, y1, x2, y2) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  const style = useAnimatedStyle(() => ({
    // Fades in and out at the ends, so it never pops at the edges.
    opacity: interpolate(progress.value, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
    left: `${interpolate(progress.value, [0, 1], [-band, 100])}%`,
  }));

  const light = tone === 'onFill' ? opacity.sheenOnFill : opacity.sheenOnCanvas;
  // One gradient per instance: several buttons on a screen must not share (and overwrite) one definition.
  const id = `sheen-${kind}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <View pointerEvents="none" style={styles.clip}>
      <Animated.View style={[styles.band, { width: `${band}%` }, style]}>
        <Svg width="100%" height="100%">
          <Defs>
            {kind === 'metal' ? (
              <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={color.bg.canvas} stopOpacity={0} />
                <Stop offset="0.25" stopColor={color.bg.canvas} stopOpacity={opacity.sheenShadow} />
                <Stop offset="0.5" stopColor={color.text.primary} stopOpacity={light} />
                <Stop offset="0.75" stopColor={color.bg.canvas} stopOpacity={opacity.sheenShadow} />
                <Stop offset="1" stopColor={color.bg.canvas} stopOpacity={0} />
              </LinearGradient>
            ) : (
              <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={color.text.primary} stopOpacity={0} />
                <Stop offset="0.5" stopColor={color.text.primary} stopOpacity={light} />
                <Stop offset="1" stopColor={color.text.primary} stopOpacity={0} />
              </LinearGradient>
            )}
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { ...StyleSheet.absoluteFill, borderRadius: radius.control, overflow: 'hidden' },
  band: { position: 'absolute', top: 0, bottom: 0 },
});
