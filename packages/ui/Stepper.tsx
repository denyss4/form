// Layout plan. Job: say where the person is in onboarding (account, consent, calendar, notifications). Focal element: none; it is quiet
// chrome above the screen's own title. Screen readers hear "Step 2 of 4, Calendar".
// D5 (the user's pick 2B): numbered circles joined by a line, each step's name under its circle. Done: a Text High circle with a canvas
// check and the line after it in Text High. Current: a Text High ring with its number. To come: a control-stroke ring, the number in Text
// Muted. Not sage (first-launch plan, 3 Oct, C3): sage stays the screen's one action, Continue. Fill, check and ring carry the progress.
// From 1.3x text, four names no longer fit under their circles without breaking a word ("Powiadomienia"), so the names go and one line
// under the circles says "Step 2 of 4, Calendar" instead.
import { StyleSheet, View } from 'react-native';
import Check from 'lucide-react-native/icons/check';

import { copy } from '@copy';
import { radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { useFontScale } from './useFontScale';

const CIRCLE = space.xl - space.xxs; // 28 pt

export function Stepper({ step, total, name, names }: { step: number; total: number; name: string; names?: string[] }) {
  const { color } = useTheme();
  const scale = useFontScale();
  const label = copy.stepper.label(step, total, name);
  const titled = names !== undefined && names.length === total && scale <= 1.3;
  const current = step - 1;
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
      <View style={styles.row}>
        {Array.from({ length: total }, (_, i) => {
          const done = i < current;
          const active = i === current;
          const ring = done || active ? color.text.primary : color.stroke.control;
          return (
            <View key={i} style={styles.item}>
              <View style={styles.line}>
                <View style={[styles.circle, { borderColor: ring, backgroundColor: done ? color.text.primary : 'transparent' }]}>
                  {done ? (
                    <Check color={color.action.onPrimary} size={size.iconSm - space.xxs} strokeWidth={size.outline} />
                  ) : (
                    <Text variant="caption" tabular maxFontSizeMultiplier={1.3} style={{ color: active ? color.text.primary : color.text.secondary }}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                {i < total - 1 ? (
                  <View style={[styles.connector, { backgroundColor: done ? color.text.primary : color.stroke.hairline }]} />
                ) : null}
              </View>
              {titled ? (
                <Text variant="caption" tone={active || done ? 'primary' : 'secondary'}>
                  {names[i]}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
      {titled ? null : (
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  row: { flexDirection: 'row' },
  item: { flex: 1, gap: space.xs },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  circle: { width: CIRCLE, height: CIRCLE, borderRadius: radius.full, borderWidth: size.hairline, alignItems: 'center', justifyContent: 'center' },
  connector: { flex: 1, height: size.hairline, marginRight: space.xs },
});
