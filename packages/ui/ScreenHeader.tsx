// Screen title, optional caption, optional back link and a right-hand action. One title per screen (MASTER_PROMPT §5.3).
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';

import { copy } from '@copy';
import { size, space, titleMaxFontScale, type PlanId } from '@tokens';

import { FocusRing, useFocus } from './focus';
import { PlanGlyph } from './PlanGlyph';
import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';
import { usePress } from './usePress';

const LONG_PRESS_MS = 500; // the platform default; long enough not to fire on a scroll or a tap

export function IconButton({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.icon);
  const press = usePress();
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
    >
      <Animated.View style={[styles.icon, press.style]}>
        <Icon color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
        <FocusRing visible={focus.focused} />
      </Animated.View>
    </Pressable>
  );
}

export function ScreenHeader({
  title,
  caption,
  onBack,
  right,
  plan,
  onCaptionLongPress,
}: {
  title: string;
  caption?: string;
  onBack?: () => void;
  right?: ReactNode;
  /** When set, the title is this plan: its glyph, and the text in the plan colour. Today uses it. */
  plan?: PlanId;
  /** Demo build only: Today passes the demo clock here. No visible affordance (user decision, 1 Oct 2026). */
  onCaptionLongPress?: () => void;
}) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.icon);
  const backFocus = useFocus();
  return (
    <View style={styles.wrap}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel={copy.nav.back} onPress={onBack}
          onFocus={backFocus.onFocus}
          onBlur={backFocus.onBlur}
          style={styles.back}
        >
          <ArrowLeft color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
          <Text variant="bodyStrong">{copy.nav.back}</Text>
          <FocusRing visible={backFocus.focused} />
        </Pressable>
      ) : null}
      <View style={styles.titleRow}>
        <View style={styles.grow}>
          {plan ? (
            <View style={styles.planTitle}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <PlanGlyph plan={plan} />
              </View>
              <Text
                variant="title"
                tone={plan}
                accessibilityRole="header"
                level={1}
                maxFontSizeMultiplier={titleMaxFontScale}
                style={styles.shrink}
              >
                {title}
              </Text>
            </View>
          ) : (
            <Text variant="title" accessibilityRole="header" level={1} maxFontSizeMultiplier={titleMaxFontScale}>
              {title}
            </Text>
          )}
          {caption && onCaptionLongPress ? (
            // A Pressable, not Text.onLongPress: react-native-web's Text ignores long-press, and the demo is rehearsed on web too.
            // Not a focus stop and not announced: the demo clock is a presenter gesture, not a feature.
            <Pressable onLongPress={onCaptionLongPress} delayLongPress={LONG_PRESS_MS} accessible={false} focusable={false}>
              <Text variant="caption" tone="secondary">
                {caption}
              </Text>
            </Pressable>
          ) : caption ? (
            <Text variant="caption" tone="secondary">
              {caption}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xxs },
  back: { minHeight: size.touch, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  grow: { flex: 1 },
  planTitle: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  shrink: { flexShrink: 1 },
  icon: { width: size.touch, height: size.touch, alignItems: 'center', justifyContent: 'center' },
});
