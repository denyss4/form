// Layout plan. Job: cover the app's start (fonts and state loading) with the brand, briefly. Focal element: the logo, centred (CLAUDE.md
// allows centring for the dial and art; this screen is art). Quiet: everything; nothing else is on the canvas, no glow, no spinner.
// The logo assembles stroke by stroke (motion.launch, 900 ms), holds for a beat, then the screen fades into the app once the fonts are
// ready. Once per launch. Reduce Motion: the finished logo, then a fade under 150 ms. It never waits on anything but the fonts: if they
// fail, the app falls back to system fonts and the launch screen still leaves.
// Review only: `hold` (the root layout's ?launch=0.4) freezes the assembly at that point and keeps the screen up.
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { copy } from '@copy';
import { motion, space } from '@tokens';
import { Logo, useTheme } from '@ui';

const LOGO_WIDTH = space.xxxl * 3; // 192 pt, about half the screen width

export function LaunchScreen({ ready, onDone, hold }: { ready: boolean; onDone: () => void; hold?: number }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(hold ?? (reduceMotion ? 1 : 0));
  const shown = useSharedValue(1);
  const [assembled, setAssembled] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion || hold !== undefined) return;
    progress.set(withTiming(1, { duration: motion.launch.duration, easing: Easing.bezier(...motion.launch.easing) }));
    const t = setTimeout(() => setAssembled(true), motion.launch.duration + motion.launch.hold);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !assembled || hold !== undefined) return;
    shown.set(
      withTiming(0, { duration: reduceMotion ? motion.reducedFade : motion.launch.out }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, assembled]);

  const fade = useAnimatedStyle(() => ({ opacity: shown.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.screen, { backgroundColor: color.bg.canvas }, fade]}>
      <View accessibilityLiveRegion="polite">
        <Logo width={LOGO_WIDTH} progress={progress} label={copy.launch.label} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', justifyContent: 'center' },
});
