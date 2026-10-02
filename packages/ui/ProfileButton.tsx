// Layout plan. Job: open Profile from the top right of Today, Week and Progress, replacing the gear (REDESIGN-PROMPT §5, Q4).
// Focal element: none; quiet chrome beside the title. A 36 pt circle in a 48 pt target: the photo, else the initials, else a person icon
// for a guest. Outlined in the control stroke, so it reads as a control without a fill.
import { Image, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import User from 'lucide-react-native/icons/user';

import { copy } from '@copy';
import { chromeMaxFontScale, radius, size } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { Text } from './Text';
import { useTheme } from './theme';
import { usePress } from './usePress';

export function ProfileButton({ initials, photo, onPress }: { initials: string | null; photo: string | null; onPress: () => void }) {
  const { color } = useTheme();
  const press = usePress();
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copy.nav.profile}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={styles.target}
    >
      <Animated.View style={[styles.circle, { borderColor: color.stroke.control }, press.style]}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} accessibilityIgnoresInvertColors />
        ) : initials ? (
          <Text variant="bodyStrong" maxFontSizeMultiplier={chromeMaxFontScale}>
            {initials}
          </Text>
        ) : (
          <User color={color.text.primary} size={size.iconSm} strokeWidth={size.outline} />
        )}
        <FocusRing visible={focus.focused} radius={radius.full} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: { width: size.touch, height: size.touch, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: size.avatar.button,
    height: size.avatar.button,
    borderRadius: radius.full,
    borderWidth: size.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: size.avatar.button, height: size.avatar.button },
});
