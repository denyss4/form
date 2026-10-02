// Layout plan. Job: go somewhere else from a list. Focal element: the label. Quiet: the caption and the chevron.
// A row, not a card: space and a hairline separate it (5.2). The whole row is the target, at least 48 tall.
// spotlight (D3, Profile): the press also lights the row at the press point (Spotlight).
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChevronRight from 'lucide-react-native/icons/chevron-right';

import { size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { useSpotlight } from './Spotlight';
import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';
import { usePress } from './usePress';

export function LinkRow({
  label,
  caption,
  onPress,
  divider = true,
  spotlight = false,
}: {
  label: string;
  caption?: string;
  onPress: () => void;
  divider?: boolean;
  spotlight?: boolean;
}) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.icon);
  const press = usePress();
  const focus = useFocus();
  const spot = useSpotlight();
  const { attach, layer } = spot;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={caption ? `${label}, ${caption}` : label}
      onPress={onPress}
      onPressIn={(e) => {
        press.onPressIn();
        if (spotlight) spot.onPressIn(e);
      }}
      onPressOut={() => {
        press.onPressOut();
        if (spotlight) spot.onPressOut();
      }}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
    >
      <Animated.View
        ref={attach}
        style={[
          styles.row,
          divider ? { borderBottomWidth: size.hairline, borderBottomColor: color.stroke.hairline } : undefined,
          press.style,
        ]}
      >
        {spotlight ? layer : null}
        <View style={styles.text}>
          <Text variant="bodyStrong">{label}</Text>
          {caption ? (
            <Text variant="caption" tone="secondary">
              {caption}
            </Text>
          ) : null}
        </View>
        <ChevronRight color={color.text.secondary} size={iconPx} strokeWidth={size.outline} />
        <FocusRing visible={focus.focused} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: size.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
  },
  text: { flex: 1 },
});
