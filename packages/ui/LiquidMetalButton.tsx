// D5 (the user's picks 4B and 10: "download the WebGL and implement the liquid metal button"): Welcome's "Create account". A dark pill
// (raised to canvas, like the original's #202020 to black) inside a 2 pt rim of liquid metal. The rim is the real shader: Paper Shaders'
// liquid metal (WebGL 2 through expo-gl, MetalShader), with the original component's uniforms. It flows at speed 0.6 and runs at 2.4 for
// 300 ms on a press, as the original does on click, and a soft ripple spreads from the touch point. The label is Text High (the
// original's #666 on black is 3.5:1, below 4.5:1).
// Fallback: if the device cannot compile the shader, the earlier rim stands in (bands of light that turn slowly, react-native-svg).
// Reduce Motion: the shader draws one still frame and there is no ripple.
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { alpha } from './alpha';
import { MetalShader } from './MetalShader';

const RIM = size.outline; // 2 pt
const LOOP_MS = 7000; // one slow turn (the shader's speed 0.6)
const BANDS = 4;
const REST_SPEED = 0.6; // the original's speed at rest
const PRESS_SPEED = 2.4; // and on a click, for 300 ms

export function LiquidMetalButton({ label, onPress, fullWidth = true }: { label: string; onPress?: () => void; fullWidth?: boolean }) {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const [box, setBox] = useState({ w: 0, h: 0 });
  const turn = useSharedValue(45);
  const ripple = useSharedValue(0);
  const [at, setAt] = useState({ x: 0, y: 0 });
  const side = Math.max(box.w, box.h) * 1.6;
  const [glFailed, setGlFailed] = useState(false);
  const speed = useRef(reduceMotion ? 0 : REST_SPEED);
  const slow = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (slow.current) clearTimeout(slow.current);
    },
    [],
  );

  useEffect(() => {
    if (reduceMotion || !glFailed) return;
    turn.set(withRepeat(withTiming(405, { duration: LOOP_MS, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(turn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, glFailed]);

  const onPressIn = (e: GestureResponderEvent) => {
    if (reduceMotion) return;
    setAt({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
    ripple.set(0);
    ripple.set(withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }));
    speed.current = PRESS_SPEED;
    if (slow.current) clearTimeout(slow.current);
    slow.current = setTimeout(() => (speed.current = REST_SPEED), 300);
    if (!glFailed) return;
    // A quicker turn for a moment, then back to the slow loop.
    turn.set(withSequence(withTiming(turn.value + 120, { duration: 300 }), withRepeat(withTiming(turn.value + 120 + 360, { duration: LOOP_MS, easing: Easing.linear }), -1, false)));
  };

  const rim = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value}deg` }] }));
  const wave = useAnimatedStyle(() => ({ opacity: 0.6 * (1 - ripple.value), transform: [{ scale: ripple.value * 8 }] }));

  const stops = [];
  for (let i = 0; i <= BANDS * 2; i++) {
    const offset = i / (BANDS * 2);
    const c = i % 2 === 0 ? color.text.primary : i % 4 === 1 ? color.stroke.control : color.bg.canvas;
    stops.push(<Stop key={i} offset={offset} stopColor={c} />);
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} onPressIn={onPressIn} style={fullWidth ? styles.stretch : styles.hug}>
      <View style={styles.outer} onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        {!glFailed ? (
          <MetalShader speed={speed} still={reduceMotion} onFail={() => setGlFailed(true)} />
        ) : side > 0 ? (
          <Animated.View pointerEvents="none" style={[styles.rim, { width: side, height: side, left: (box.w - side) / 2, top: (box.h - side) / 2 }, rim]}>
            <Svg width={side} height={side}>
              <Defs>
                <LinearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
                  {stops}
                </LinearGradient>
              </Defs>
              <Rect width={side} height={side} fill="url(#metal)" />
            </Svg>
          </Animated.View>
        ) : null}
        <View style={[styles.inner, { backgroundColor: color.bg.canvas }]}>
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="pill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color.bg.raised} />
                <Stop offset="1" stopColor={color.bg.canvas} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#pill)" />
          </Svg>
          <Animated.View pointerEvents="none" style={[styles.ripple, { left: at.x - space.sm, top: at.y - space.sm, backgroundColor: alpha(color.text.primary, 0.4) }, wave]} />
          <Text variant="bodyStrong">{label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  hug: { alignSelf: 'flex-start' },
  outer: { minHeight: size.touch, borderRadius: radius.full, overflow: 'hidden', padding: RIM },
  rim: { position: 'absolute' },
  inner: { flex: 1, minHeight: size.touch - RIM * 2, borderRadius: radius.full, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg },
  ripple: { position: 'absolute', width: space.lg, height: space.lg, borderRadius: radius.full },
});
