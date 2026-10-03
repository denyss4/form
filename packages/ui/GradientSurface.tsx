// D5 (the user's pick 7B, "gradient card, style only"): the dark-gradient pricing card's surface, without its pricing layout. A surface
// that runs diagonally from canvas to raised, a hairline edge, radius.surface, no shadow (cards get none, CLAUDE.md). Used on Today
// around "What moved your score".
// The original blurs in on scroll; React Native has no view blur, so with `enter` the surface fades and settles in (opacity and a 0.98
// scale, 500 ms, after 250 ms). Reduce Motion: it appears at once. Today passes enter={false}: its own reveal already moves the page.
import { useEffect, useId, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { radius, size, space } from '@tokens';

import { useTheme } from './theme';

export function GradientSurface({ children, enter = true }: { children: ReactNode; enter?: boolean }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const id = `surface-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const still = reduceMotion || !enter;
  const shown = useSharedValue(still ? 1 : 0);
  useEffect(() => {
    if (still) return;
    shown.set(withDelay(250, withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const settle = useAnimatedStyle(() => ({ opacity: shown.value, transform: [{ scale: 0.98 + shown.value * 0.02 }] }));

  return (
    <Animated.View style={[styles.surface, { borderColor: color.stroke.hairline }, settle]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color.bg.canvas} />
            <Stop offset="1" stopColor={color.bg.raised} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  surface: { borderRadius: radius.surface, borderWidth: size.hairline, padding: space.lg, gap: space.md, overflow: 'hidden' },
});
