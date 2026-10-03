// D5 (the user's pick), sheen pill button): the web's glass pill, dark. A Text High wash at 8% on the canvas, a light edge, an inner rim inset
// 4 pt, and two soft light bands in the top-left and bottom-right corners (the original's 45° highlight). React Native has no inset
// shadows or CSS blur, so the light is drawn with an SVG gradient and borders. Hover becomes press (scale 0.98 and brighter bands).
// The label is Text High (the original's #3e3e3e is for a white page).
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { alpha } from './alpha';

export function SheenPill({ label, onPress, fullWidth = true }: { label: string; onPress?: () => void; fullWidth?: boolean }) {
  const { color } = useTheme();
  const [pressed, setPressed] = useState(false);
  const light = pressed ? 0.5 : 0.32;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[fullWidth ? styles.stretch : styles.hug, pressed ? styles.down : undefined]}
    >
      <View style={[styles.shell, { backgroundColor: alpha(color.text.primary, 0.08), borderColor: alpha(color.text.primary, 0.18) }]}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient id="sheen-pill" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={color.text.primary} stopOpacity={light} />
              <Stop offset="0.18" stopColor={color.text.primary} stopOpacity={0} />
              <Stop offset="0.82" stopColor={color.text.primary} stopOpacity={0} />
              <Stop offset="1" stopColor={color.text.primary} stopOpacity={light} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={size.touch} fill="url(#sheen-pill)" />
        </Svg>
        <View pointerEvents="none" style={[styles.rim, { borderColor: alpha(color.text.primary, pressed ? 0.45 : 0.2) }]} />
        <Text variant="bodyStrong">{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  hug: { alignSelf: 'flex-start' },
  down: { transform: [{ scale: 0.98 }] },
  shell: {
    minHeight: size.touch + space.xs,
    borderRadius: radius.full,
    borderWidth: size.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    overflow: 'hidden',
  },
  rim: { position: 'absolute', top: space.xxs, bottom: space.xxs, left: space.xxs, right: space.xxs, borderRadius: radius.full, borderWidth: size.hairline },
});
