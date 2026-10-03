// Glass for floating layers only (REDESIGN-PROMPT §2.2): the tab bar today; sheets and the morph modal later.
// A blur under a canvas tint of at least 0.70, so Text High stays 6.43:1 even over pure white behind it. Text Muted never sits on glass.
// Edge: a 1 pt hairline on top. Fallbacks: Reduce Transparency on, or Android, gives the solid raised surface.
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { opacity, size, space } from '@tokens';

import { useTheme } from './theme';

const BLUR_INTENSITY = 40;
const TAB_BAR_HEIGHT = size.touch + space.xs; // 56: a 48 pt target plus breathing room, above the home indicator

/** The floating tab bar's full height, including the bottom safe area. Tab screens reserve this much at their bottom. */
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom;
}

function useReduceTransparency() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    // iOS has the setting; react-native-web does not implement it, so the web treats it as off.
    if (typeof AccessibilityInfo.isReduceTransparencyEnabled !== 'function') return;
    let alive = true;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((on) => alive && setReduce(on))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => {
      alive = false;
      sub?.remove();
    };
  }, []);
  return reduce;
}

export function GlassBar() {
  const { color, scheme } = useTheme();
  const reduce = useReduceTransparency();
  const solid = reduce || Platform.OS === 'android';
  const edge = { borderTopWidth: size.hairline, borderTopColor: color.stroke.hairline };

  if (solid) return <View style={[StyleSheet.absoluteFill, edge, { backgroundColor: color.bg.raised }]} />;

  return (
    <View style={[StyleSheet.absoluteFill, edge]}>
      <BlurView intensity={BLUR_INTENSITY} tint={scheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: color.bg.canvas, opacity: opacity.glassTint }]} />
    </View>
  );
}
