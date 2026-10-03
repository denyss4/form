// The look every slider in Form shares (D5, the user's pick 11B, "use the new bar to all bars on the app"): a thick rounded track in
// sunken with a hairline edge, the range up to the thumb in Text High, and a 20 pt thumb drawn as a Text High ring on the canvas. While
// the finger is down, a small bubble above the thumb shows the value. The numbers under the track belong to each slider (they differ:
// 1-7 days, 1-10 rating), so they are not drawn here. Pointer events pass through: the slider around it owns the gesture.
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

export const SLIDER_THUMB = space.lg - space.xxs; // 20 pt
const TRACK = space.xs; // 8 pt
const BUBBLE = space.xxl + space.md; // 64 pt wide, room for "4 days a week" at 1x

/** x: the thumb's left edge in px, from 0 to the track width minus SLIDER_THUMB. */
export function SliderTrack({ x, bubble }: { x: SharedValue<number>; bubble?: string | null }) {
  const { color } = useTheme();
  const fill = useAnimatedStyle(() => ({ width: x.value + SLIDER_THUMB / 2 }));
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const tip = useAnimatedStyle(() => ({ transform: [{ translateX: x.value + SLIDER_THUMB / 2 - BUBBLE / 2 }] }));
  return (
    <View pointerEvents="none" style={styles.area}>
      <View style={[styles.track, { backgroundColor: color.bg.sunken, borderColor: color.stroke.hairline }]} />
      <Animated.View style={[styles.range, { backgroundColor: color.text.primary }, fill]} />
      <Animated.View style={[styles.thumb, { backgroundColor: color.bg.canvas, borderColor: color.text.primary }, thumb]} />
      {bubble ? (
        <Animated.View style={[styles.bubble, { backgroundColor: color.bg.raised, borderColor: color.stroke.hairline }, tip]}>
          <Text variant="caption" tabular style={styles.centre}>
            {bubble}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  area: { height: size.touch, justifyContent: 'center' },
  track: { position: 'absolute', left: 0, right: 0, height: TRACK, borderRadius: radius.full, borderWidth: size.hairline },
  range: { position: 'absolute', left: 0, height: TRACK, borderRadius: radius.full },
  thumb: { position: 'absolute', left: 0, width: SLIDER_THUMB, height: SLIDER_THUMB, borderRadius: radius.full, borderWidth: size.outline },
  bubble: {
    position: 'absolute',
    left: 0,
    bottom: size.touch / 2 + SLIDER_THUMB / 2 + space.xxs,
    width: BUBBLE,
    borderRadius: radius.control,
    borderWidth: size.hairline,
    paddingVertical: space.xxs,
    zIndex: 1,
  },
  centre: { textAlign: 'center' },
});
