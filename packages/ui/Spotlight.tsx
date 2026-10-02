// Spotlight (REDESIGN-PROMPT §6, spotlight-card rebuilt): on press, a soft light appears at the press point and fades within 200 ms of
// release. Hover becomes press. One level only, never nested. Used on the Week day detail and Profile's rows.
// The light is Text High at 8% fading to nothing: press feedback, never a colour or a second accent. Reduce Motion: a cross-fade under
// 150 ms in both directions.
import { useId, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { motion, opacity, space } from '@tokens';

import { useTheme } from './theme';

const LIGHT_RADIUS = space.xxxl * 2; // 128 pt: about a thumb's reach around the press point

/** The light layer and the handlers that move it. Pass onPressIn/onPressOut from a Pressable, `attach` as the surface ref, and render
 * `layer` first inside the surface. */
export function useSpotlight() {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  // A callback ref kept in state: the surface is measured on press to place the light under the finger.
  const [node, attach] = useState<View | null>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const lit = useSharedValue(0);
  const id = `spot-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const onPressIn = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    node?.measureInWindow((x, y) => setPoint({ x: pageX - x, y: pageY - y }));
    lit.set(withTiming(1, { duration: reduceMotion ? motion.reducedFade : motion.spotlight.in }));
  };
  const onPressOut = () => lit.set(withTiming(0, { duration: reduceMotion ? motion.reducedFade : motion.spotlight.out }));

  const style = useAnimatedStyle(() => ({ opacity: lit.value }));

  const layer = (
    // Its own clip, so the light stays inside the surface while a focus ring drawn outside it is never cut.
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip, style]}>
      {point ? (
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id={id} cx={point.x} cy={point.y} r={LIGHT_RADIUS} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={color.text.primary} stopOpacity={opacity.spotlight} />
              <Stop offset="1" stopColor={color.text.primary} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={point.x} cy={point.y} r={LIGHT_RADIUS} fill={`url(#${id})`} />
        </Svg>
      ) : null}
    </Animated.View>
  );

  return { attach, onPressIn, onPressOut, layer };
}

/** A non-interactive surface that answers a press with the light only. Not a control: screen readers skip the wrapper. */
export function SpotlightSurface({ style, children }: { style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const { attach, onPressIn, onPressOut, layer } = useSpotlight();
  return (
    <Pressable accessible={false} onPressIn={onPressIn} onPressOut={onPressOut}>
      <View ref={attach} style={[styles.clip, style]}>
        {layer}
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});
