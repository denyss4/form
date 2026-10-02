// Layout plan. Job: say where the person is in onboarding (account, consent, calendar, notifications). Focal element: none; it is quiet
// chrome above the screen's own title. A caption ("Step 2 of 4") and thin segments: done and current in Text High, the rest outlined.
// Shape carries progress, not colour. Screen readers hear "Step 2 of 4, Calendar".
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

export function Stepper({ step, total, name }: { step: number; total: number; name: string }) {
  const { color } = useTheme();
  const label = copy.stepper.label(step, total, name);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={label}
      style={styles.wrap}
    >
      <Text variant="caption" tone="secondary">
        {copy.stepper.short(step, total)}
      </Text>
      <View style={styles.bar}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              i < step
                ? { backgroundColor: color.text.primary, borderColor: color.text.primary }
                : { borderColor: color.stroke.control },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  bar: { flexDirection: 'row', gap: space.xxs },
  segment: { flex: 1, height: size.track * 2, borderRadius: radius.full, borderWidth: size.hairline },
});
