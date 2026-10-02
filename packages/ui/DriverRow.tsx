// Layout plan. Job: explain one part of the score. Focal element: the label with its signed value. Quiet: the basis caption.
// Direction is a glyph, a sign and words, never colour. No card and no divider: space alone groups the rows (white-space guideline,
// space as connector; REDESIGN-PROMPT §2.1).
import { StyleSheet, View } from 'react-native';
import ArrowDown from 'lucide-react-native/icons/arrow-down';
import ArrowUp from 'lucide-react-native/icons/arrow-up';

import { copy } from '@copy';
import type { FormDriver } from '@model';
import { size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

export function DriverRow({ driver }: { driver: FormDriver }) {
  const { color } = useTheme();
  const Arrow = driver.direction === 'up' ? ArrowUp : ArrowDown;
  const basis = copy.basis[driver.basis];
  const iconPx = useIconSize(size.icon);

  return (
    <View
      accessible
      accessibilityLabel={copy.driver.a11y(driver.label, driver.direction, driver.magnitude, basis)}
      style={[
        styles.row,
      ]}
    >
      <Arrow color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{driver.label}</Text>
        <Text variant="caption" tone="secondary">
          {basis}
        </Text>
      </View>
      <Text variant="bodyStrong" tabular>
        {copy.driver.value(driver.direction, driver.magnitude)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.xs, // 16 between rows
  },
  text: { flex: 1 },
});
