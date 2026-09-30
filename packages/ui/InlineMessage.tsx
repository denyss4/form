// Layout plan. Job: say what happened and what to do next. Focal element: the title. Quiet: the body.
// No apology, never vague (MASTER_PROMPT §7). No box around it: an icon, text and, if there is one, an action. Warning haptic once.
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import CircleAlert from 'lucide-react-native/icons/circle-alert';

import { size, space } from '@tokens';

import { haptic } from './haptics';
import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

export function InlineMessage({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.icon);

  useEffect(() => {
    haptic.warning();
  }, []);

  return (
    <View accessibilityRole="alert" style={styles.wrap}>
      <View style={styles.row}>
        <CircleAlert color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
        <View style={styles.text}>
          <Text variant="bodyStrong">{title}</Text>
          <Text variant="body" tone="secondary">
            {body}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  text: { flex: 1, gap: space.xxs },
});
