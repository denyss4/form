// Layout plan. Job: show the answered days at a glance. Focal element: the segments. Quiet: nothing else.
// One solid segment per followed day, up to a week, oldest on the left. Filled = the plan fit. Outlined = it did not (too hard or too easy).
// A 'Did something else' day has no segment (spec R1).
// Shape carries it, never colour: a fill against an outline. Dashes are never used here: a dashed outline means "Estimated" and only that.
// Segments are thin full-radius pills (5.4: full for segmented pills). At the control radius and icon height they read as buttons.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import type { FitDay } from '@planner/progress';
import { radius, size, space } from '@tokens';
import { useTheme } from '@ui';

export function FitStrip({ days, fit, label }: { days: FitDay[]; fit: number; label: string }) {
  const { color } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={copy.progress.fit.title}
      // aria-value* rather than accessibilityValue: react-native-web drops the latter, and both map to the native value on iOS.
      aria-valuemin={0}
      aria-valuemax={days.length}
      aria-valuenow={fit}
      aria-valuetext={label}
      style={styles.strip}
    >
      {days.map((day) => {
        const didFit = day.fit === 'yes';
        return (
          <View
            key={day.date}
            style={[
              styles.segment,
              didFit
                ? { backgroundColor: color.text.primary, borderColor: color.text.primary }
                : { backgroundColor: 'transparent', borderColor: color.text.primary },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: space.xxs },
  segment: { flex: 1, height: size.segment, borderRadius: radius.full, borderWidth: size.outline },
});
