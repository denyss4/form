// Layout plan. Job: the terms and the privacy notice, one tap from Welcome (and from Profile's About in D2). Focal element: the two links.
// Quiet: the health-consent note and the planning notice. A glass sheet (REDESIGN-PROMPT §4.2), so every line is Text High: Text Muted on
// glass is 2.11:1 at the 0.70 tint. Terms and privacy only, never health-data consent, which stays its own per-purpose screen (CLAUDE.md).
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChevronRight from 'lucide-react-native/icons/chevron-right';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';
import { FocusRing, Sheet, Text, useFocus, useIconSize, usePress, useTheme } from '@ui';

export type LegalDoc = 'terms' | 'privacy';

function PillLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.icon);
  const press = usePress();
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
    >
      <Animated.View style={[styles.pill, { borderColor: color.stroke.control }, press.style]}>
        <Text variant="bodyStrong" style={styles.label}>
          {label}
        </Text>
        <ChevronRight color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
        <FocusRing visible={focus.focused} />
      </Animated.View>
    </Pressable>
  );
}

export function LegalSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const open = (doc: LegalDoc) => {
    onClose();
    router.push(`/legal/${doc}`);
  };
  return (
    <Sheet visible={visible} onClose={onClose} title={copy.legal.title} glass>
      <Text variant="body">{copy.legal.body}</Text>
      <View style={styles.links}>
        <PillLink label={copy.legal.terms} onPress={() => open('terms')} />
        <PillLink label={copy.legal.privacy} onPress={() => open('privacy')} />
      </View>
      <View style={styles.notes}>
        <Text variant="caption">{copy.legal.health}</Text>
        <Text variant="caption">{copy.legal.notice}</Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  links: { gap: space.xs },
  pill: {
    minHeight: size.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    borderWidth: size.hairline,
    borderRadius: radius.full,
  },
  label: { flex: 1 },
  notes: { gap: space.xs, marginTop: space.xs },
});
