// Layout plan. Job: show the last 7 days of Plan fit at a glance (first-launch plan, 3 Oct, item 14 and Q9). Focal element: the segments.
// Quiet: nothing else. One segment per day, oldest on the left: filled = the plan fit; a 2 pt outline = too hard or too easy; a dashed
// hairline = no answer, or a "Did something else" day (not followed). The headline above counts followed days only (spec R1).
// Shape carries it, never colour: fill, outline, dashes. (Dashes no longer mean "Estimated": that is a hollow ring under a muted glyph.)
// Segments are thin full-radius pills (5.4: full for segmented pills). At the control radius and icon height they read as buttons.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { addDays } from '@planner/dates';
import type { FitDay } from '@planner/progress';
import { radius, size, space } from '@tokens';
import { useTheme } from '@ui';

const WINDOW = 7;

export function FitStrip({ days, end, fit, answered, label }: { days: FitDay[]; end: string; fit: number; answered: number; label: string }) {
  const { color } = useTheme();
  const dates = Array.from({ length: WINDOW }, (_, i) => addDays(end, i - (WINDOW - 1)));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={copy.progress.fit.title}
      // aria-value* rather than accessibilityValue: react-native-web drops the latter, and both map to the native value on iOS.
      aria-valuemin={0}
      aria-valuemax={answered}
      aria-valuenow={fit}
      aria-valuetext={label}
      style={styles.strip}
    >
      {dates.map((date) => {
        const answer = days.find((d) => d.date === date)?.fit ?? null;
        const shape =
          answer === 'yes'
            ? { backgroundColor: color.text.primary, borderColor: color.text.primary }
            : answer === 'tooHard' || answer === 'tooEasy'
              ? { borderColor: color.text.primary }
              : [styles.open, { borderColor: color.stroke.control }];
        return <View key={date} style={[styles.segment, shape]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: space.xxs },
  segment: { flex: 1, height: size.segment, borderRadius: radius.full, borderWidth: size.outline },
  open: { borderWidth: size.hairline, borderStyle: 'dashed' },
});
