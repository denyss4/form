// Layout plan. Job: go somewhere else from a list. Focal element: the label. Quiet: the caption and the chevron.
// A row, not a card: space and a hairline separate it (5.2). The whole row is the target, at least 48 tall.
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChevronRight from 'lucide-react-native/icons/chevron-right';

import { size, space } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';
import { usePress } from './usePress';

export function LinkRow({
  label,
  caption,
  onPress,
  divider = true,
}: {
  label: string;
  caption?: string;
  onPress: () => void;
  divider?: boolean;
}) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.icon);
  const press = usePress();
  const focus = useFocus();

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={caption ? `${label}, ${caption}` : label}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
    >
      <Animated.View
        style={[
          styles.row,
          divider ? { borderBottomWidth: size.hairline, borderBottomColor: color.stroke.hairline } : undefined,
          press.style,
        ]}
      >
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
